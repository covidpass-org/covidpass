import {PayloadBody, Receipt} from "./payload";
import * as PdfJS from 'pdfjs-dist'
import jsQR, {QRCode} from "jsqr";
import  { getCertificatesInfoFromPDF } from "@ninja-labs/verify-pdf";  // ES6 
import * as Sentry from '@sentry/react';
import * as Decode from './decode';
import {getScannedJWS, verifyJWS, decodeJWS} from "./shc";
import { PNG } from 'pngjs/browser';

import { PDFPageProxy, TextContent, TextItem } from "pdfjs-dist/types/display/api";

// import {PNG} from 'pngjs'
// import {decodeData} from "./decode";
// import {Result} from "@zxing/library";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

export async function getPayloadBodyFromFile(file: File): Promise<PayloadBody> {
    // Read file
    const fileBuffer = await file.arrayBuffer();

    switch (file.type) {
        case 'application/pdf':
            return detectPDFTypeAndProcess(fileBuffer)
        case 'image/png':
            return processBCPNG(fileBuffer);
        default:
            throw Error('invalidFileType')
    }

}

async function detectPDFTypeAndProcess(fileBuffer : ArrayBuffer): Promise<any> {

    // Ontario has 'COVID-19 vaccination receipt'
    // BC has BC Vaccine Card

        console.log('detectPDFTypeAndProcess');

        const typedArray = new Uint8Array(fileBuffer);
        let loadingTask = PdfJS.getDocument(typedArray);
        const pdfDocument = await loadingTask.promise;
        let pageNumber = pdfDocument.numPages;
        const pdfPage = await pdfDocument.getPage(1);  //first page
        const content = await pdfPage.getTextContent();
        const numItems = content.items.length;
        for (let i = 0; i < numItems; i++) {
            let item = content.items[i] as TextItem;
            const value = item.str;
            console.log(value);
            if (value.includes('BC Vaccine Card')) {
                console.log('detected bc');
                return processBC(pdfPage);
            }
            if (value.includes('COVID-19 vaccination receipt')) {
                console.log('detected on');
                return processON(fileBuffer, content);
            }
        }

}

async function getImageDataFromPdf(pdfPage: PDFPageProxy): Promise<ImageData> {

    const pdfScale = 2;

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const canvasContext = canvas.getContext('2d');
    const viewport = pdfPage.getViewport({scale: pdfScale})

    // Set correct canvas width / height
    canvas.width = viewport.width
    canvas.height = viewport.height

    // render PDF
    const renderTask = pdfPage.render({
        canvasContext: canvasContext,
        viewport,
    })

    await renderTask.promise;

    // Return PDF Image Data
    return canvasContext.getImageData(0, 0, canvas.width, canvas.height)

}

async function processBC(pdfPage: PDFPageProxy) {

    const imageData = await getImageDataFromPdf(pdfPage);
    const code : QRCode = await Decode.getQRFromImage(imageData);
    let rawData = code.data;
    const jws = getScannedJWS(rawData);

    let decoded = await decodeJWS(jws);
    
    console.log(JSON.stringify(decoded, null, 2));

    const verified = verifyJWS(jws, decoded.iss);

    if (verified) {
        
        let receipts = Decode.decodedStringToReceipt(decoded.vc.credentialSubject.fhirBundle.entry);

        console.log(receipts);

        return Promise.resolve({receipts: receipts, rawData: rawData});

    } else {

        return Promise.reject(`Issuer ${decoded.iss} cannot be verified.`);
    
    }
}

async function processON(signedPdfBuffer : ArrayBuffer, content: TextContent): Promise<any> {

    // check for certs first

    try {

        const certs = getCertificatesInfoFromPDF(signedPdfBuffer);

        const result = certs[0];
        const isClientCertificate = result.clientCertificate;
        const issuedByEntrust = (result.issuedBy.organizationName == 'Entrust, Inc.');
        const issuedToOntarioHealth = (result.issuedTo.commonName == 'covid19signer.ontariohealth.ca');
        console.log(`PDF is signed by ${result.issuedBy.organizationName}, issued to ${result.issuedTo.commonName}`);
        
        if ((isClientCertificate && issuedByEntrust && issuedToOntarioHealth)) {
            
            console.log('getting receipt details inside PDF');
            
            // to add logic to handle QR code here when it's available

            const numItems = content.items.length;

            let name, vaccinationDate, vaccineName, dateOfBirth, numDoses, organization;

            for (let i = 0; i < numItems; i++) {
                let item = content.items[i] as TextItem;
                const value = item.str;
                if (value.includes('Name / Nom'))
                    name = (content.items[i+1] as TextItem).str;
                if (value.includes('Date:')) {
                    vaccinationDate = (content.items[i+1] as TextItem).str;
                    vaccinationDate = vaccinationDate.split(',')[0];
                }
                if (value.includes('Product name')) {
                    vaccineName = (content.items[i+1] as TextItem).str;
                    vaccineName = vaccineName.split(' ')[0];
                } 
                if (value.includes('Date of birth'))
                    dateOfBirth = (content.items[i+1] as TextItem).str;

                if (value.includes('Authorized organization'))
                    organization = (content.items[i+1] as TextItem).str;    
                
                if (value.includes('You have received'))
                    numDoses = Number(value.split(' ')[3]);
            }
            const receipt = new Receipt(name, vaccinationDate, vaccineName, dateOfBirth, numDoses, organization);

            return Promise.resolve({ receipt: receipt, rawData: ''});

        } else {
            console.error('invalid certificate');
            return Promise.reject(`invalid certificate + ${JSON.stringify(result)}`);
        }

    } catch (e) {

        console.error(e);

        if (e.message.includes('Failed to locate ByteRange')) {
            e.message = 'Sorry. Selected PDF file is not digitally signed. Please download official copy from Step 1 and retry. Thanks.'
        } else {
            Sentry.captureException(e);
        }

        return Promise.reject(e);
    }

}