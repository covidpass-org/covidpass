import {PayloadBody} from "./payload";
import {PNG} from 'pngjs'
import * as PdfJS from 'pdfjs-dist'
import jsQR, {QRCode} from "jsqr";
import {decodeData} from "./decode";
import {Result} from "@zxing/library";
import {COLORS} from "./colors";
import  { getCertificatesInfoFromPDF } from "@ninja-labs/verify-pdf";  // ES6 
import verifyPDF from "@ninja-labs/verify-pdf";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

class Receipt {
  constructor(public name: string, public vaccinationDate: string, public vaccineName: string, public dateOfBirth: string, public numDoses: number) {};
}

export async function getPayloadBodyFromFile(file: File, color: COLORS): Promise<PayloadBody> {
    // Read file
    const fileBuffer = await file.arrayBuffer();

    let imageData: ImageData;

    switch (file.type) {
        case 'application/pdf':
            console.log('pdf')
            await loadPDF(fileBuffer)
            break
        // case 'image/png':
        //     console.log('png')
        //     imageData = await getImageDataFromPng(fileBuffer)
        //     break
        default:
            throw Error('invalidFileType')
    }

    let code: QRCode;

    try {
        code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
    } catch (e) {
        throw Error('couldNotDecode');
    }

    if (code == undefined) {
        throw Error('couldNotFindQrCode')
    }

    // Get raw data
    let rawData = code.data;

    // Decode Data
    let decodedData;

    try {
        decodedData = decodeData(rawData);
    } catch (e) {
        throw Error('invalidQrCode')
    }

    return {
        rawData: rawData,
        decodedData: decodedData,
        color: color,
    }
}

export async function getPayloadBodyFromQR(qrCodeResult: Result, color: COLORS): Promise<PayloadBody> {

    // Get raw data
    let rawData = qrCodeResult.getText();

    // Decode Data
    let decodedData;

    try {
        decodedData = decodeData(rawData);
    } catch (e) {
        throw Error("invalidQrCode")
    }

    return {
        rawData: rawData,
        decodedData: decodedData,
        color: color,
    }
}

async function getImageDataFromPng(fileBuffer: ArrayBuffer): Promise<ImageData> {
    return new Promise(async (resolve, reject) => {
        let png = new PNG({filterType: 4})

        png.parse(fileBuffer, (error, data) => {
            if (error) {
                reject();
            }

            resolve(data);
        })
    })
}

async function getImageDataFromPdf(fileBuffer: ArrayBuffer): Promise<ImageData> {
    const typedArray = new Uint8Array(fileBuffer);
    const pdfScale = 2;

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const canvasContext = canvas.getContext('2d');

    let loadingTask = PdfJS.getDocument(typedArray);

    await loadingTask.promise.then(async function (pdfDocument) {
        // Load last PDF page
        const pageNumber = pdfDocument.numPages;

        const pdfPage = await pdfDocument.getPage(pageNumber)
        const viewport = pdfPage.getViewport({scale: pdfScale})

        // Set correct canvas width / height
        canvas.width = viewport.width
        canvas.height = viewport.height

        // render PDF
        const renderTask = pdfPage.render({
            canvasContext: canvasContext,
            viewport,
        })

        return await renderTask.promise
    });

    // Return PDF Image Data
    return canvasContext.getImageData(0, 0, canvas.width, canvas.height)
}

async function loadPDF(signedPdfBuffer): Promise<any> {

    try {

        const certs = getCertificatesInfoFromPDF(signedPdfBuffer);

        // console.log('certs = ' + JSON.stringify(certs, null, 2));

        // check signature

        // console.log("verifying");
        // const verificationResult = verifyPDF(signedPdfBuffer);      // not sure why it failed

        const result = certs[0];
        const isClientCertificate = result.clientCertificate;
        const issuedByEntrust = (result.issuedBy.organizationName == 'Entrust, Inc.');
        const issuedToOntarioHealth = (result.issuedTo.commonName == 'covid19signer.ontariohealth.ca');
        if (isClientCertificate && issuedByEntrust && issuedToOntarioHealth) {
            console.log('valid, getting payload');
            const receipt = await getPdfDetails(signedPdfBuffer);
            console.log(JSON.stringify(receipt, null, 2));

        } else {
            console.error('invalid certificate');
            return Promise.reject('invalid certificate');

        }

    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }


}

async function getPdfDetails(fileBuffer: ArrayBuffer): Promise<Receipt> {

    const typedArray = new Uint8Array(fileBuffer);
    let loadingTask = PdfJS.getDocument(typedArray);

    const pdfDocument = await loadingTask.promise;
        // Load last PDF page
    const pageNumber = pdfDocument.numPages;

    const pdfPage = await pdfDocument.getPage(pageNumber);
    const content = await pdfPage.getTextContent();
    const numItems = content.items.length;
    let name, vaccinationDate, vaccineName, dateOfBirth, numDoses;

    for (let i = 0; i < numItems; i++) {
        const item = content.items[i];
        const value = item.str;
        if (value.includes('Name / Nom'))
            name = content.items[i+1].str;
        if (value.includes('Date:'))
            vaccinationDate = content.items[i+1].str;
        if (value.includes('Product name'))
            vaccineName = content.items[i+1].str;     
        if (value.includes('Date of birth'))
            dateOfBirth = content.items[i+1].str;
        if (value.includes('You have received'))
            numDoses = Number(value.split(' ')[3]);
    }
    const receipt = new Receipt(name, vaccinationDate, vaccineName, dateOfBirth, numDoses);

    return Promise.resolve(receipt);

}
