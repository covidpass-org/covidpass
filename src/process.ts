import {PayloadBody} from "./payload";
import {PNG} from 'pngjs'
import * as PdfJS from 'pdfjs-dist'
import jsQR, {QRCode} from "jsqr";
import {decodeData} from "./decode";
import {Result} from "@zxing/library";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

export async function getPayloadBodyFromFile(file: File, color: string): Promise<PayloadBody> {
    // Read file
    const fileBuffer = await file.arrayBuffer();

    let imageData: ImageData;

    switch (file.type) {
        case 'application/pdf':
            console.log('pdf')
            imageData = await getImageDataFromPdf(fileBuffer)
            break
        case 'image/png':
            console.log('png')
            imageData = await getImageDataFromPng(fileBuffer)
            break
        default:
            throw Error('Invalid File Type')
    }

    let code: QRCode;

    try {
        code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
    } catch (e) {
        throw Error("Could not decode QR Code from File");
    }

    if (code == undefined) {
        throw Error("Could not find QR Code in provided File")
    }

    // Get raw data
    let rawData = code.data;

    // Decode Data
    let decodedData;

    try {
        decodedData = decodeData(rawData);
    } catch (e) {
        throw Error("Invalid QR Code")
    }

    return {
        rawData: rawData,
        decodedData: decodedData,
        color: color,
    }
}

export async function getPayloadBodyFromQR(qrCodeResult: Result, color: string): Promise<PayloadBody> {

    // Get raw data
    let rawData = qrCodeResult.getText();

    // Decode Data
    let decodedData;

    try {
        decodedData = decodeData(rawData);
    } catch (e) {
        throw Error("Invalid QR Code")
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