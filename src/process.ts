import {PayloadBody} from "./payload";
import * as PdfJS from 'pdfjs-dist/legacy/build/pdf'
import {QRCode} from "jsqr";
import * as Sentry from '@sentry/react';
import * as Decode from './decode';
import {getScannedJWS, verifyJWS, decodeJWS} from "./shc";

import { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

// import {PNG} from 'pngjs'
// import {decodeData} from "./decode";
// import {Result} from "@zxing/library";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

export async function getPayloadBodyFromFile(file: File): Promise<PayloadBody> {
    // Read file
    const fileBuffer = await file.arrayBuffer();
    let imageData: ImageData[];

    switch (file.type) {
        case 'application/pdf':
        
            imageData = await getImageDataFromPdf(fileBuffer);
            break;

        case 'image/png':
        case 'image/jpeg':
        case 'image/webp':
        case 'image/gif':
            console.log(`image ${file.type}`);
            imageData = [await getImageDataFromImage(file)];
            break;

        default:
            throw Error('invalidFileType')
    }

    // Send back our SHC payload now
    return processSHC(imageData);
}

async function getImageDataFromPdfPage(pdfPage: PDFPageProxy): Promise<ImageData> {

    const pdfScale = 2;

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const canvasContext = canvas.getContext('2d');
    const viewport = pdfPage.getViewport({scale: pdfScale});

    // Set correct canvas width / height
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // render PDF
    const renderTask = pdfPage.render({
        canvasContext: canvasContext,
        viewport,
    })

    await renderTask.promise;

    // Return PDF Image Data
    return canvasContext.getImageData(0, 0, canvas.width, canvas.height);

}

function getImageDataFromImage(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        const canvasContext = canvas.getContext('2d');

        // create Image object
        const img = new Image();

        img.onload = () => {
            // constrain image to 2 Mpx
            const maxPx = 2000000;
            let width: number;
            let height: number;
            if (img.naturalWidth * img.naturalHeight > maxPx) {
                const ratio = img.naturalHeight / img.naturalWidth;
                width = Math.sqrt(maxPx / ratio);
                height = Math.floor(width * ratio);
                width = Math.floor(width);
            } else {
                width = img.naturalWidth;
                height = img.naturalHeight;
            }

            // Set correct canvas width / height
            canvas.width = width;
            canvas.height = height;

            // draw image into canvas
            canvasContext.clearRect(0, 0, width, height);
            canvasContext.drawImage(img, 0, 0, width, height);

            // Obtain image data
            resolve(canvasContext.getImageData(0, 0, width, height));
        };

        img.onerror = (e) => {
            reject(e);
        };

        // start loading image from file
        img.src = URL.createObjectURL(file);
    });
}

async function getImageDataFromPdf(fileBuffer: ArrayBuffer): Promise<ImageData[]> {

    const typedArray = new Uint8Array(fileBuffer);
    const loadingTask = PdfJS.getDocument(typedArray);

    const pdfDocument = await loadingTask.promise;
    console.log('SHC PDF loaded');
    const retArray = [];

    // Load and return every page in our PDF
    for (let i = 1; i <= pdfDocument.numPages; i++) {
        console.log(`Processing PDF page ${i}`);
        const pdfPage = await pdfDocument.getPage(i);
        const imageData = await getImageDataFromPdfPage(pdfPage);
        retArray.push(imageData);
    }

    return Promise.resolve(retArray);
}

export async function processSHCCode(shcQrCode : string) : Promise<PayloadBody> {
    console.log('processSHCCode');

    try {
        // We found a QR code of some kind - start analyzing now
        const jws = getScannedJWS(shcQrCode);
        const decoded = await decodeJWS(jws);

        //console.log(decoded);

        const verified = verifyJWS(jws, decoded.iss);

        if (verified) {
            const shcReceipt = await Decode.decodedStringToReceipt(decoded);
            //console.log(shcReceipt);
            return Promise.resolve({receipts: null, shcReceipt, rawData: shcQrCode});            
        } else {
            // If we got here, we found an SHC which was not verifiable. Consider it fatal and stop processing.
            return Promise.reject(`Issuer ${decoded.iss} cannot be verified.`);
        }                    
    } catch (e) {
        return Promise.reject(e);
    }
} 

async function processSHC(allImageData : ImageData[]) : Promise<PayloadBody> {

    console.log('processSHC');

    try {
        if (allImageData) {
            for (let i = 0; i < allImageData.length; i++) {

                const imageData = allImageData[i];
                const code : QRCode = await Decode.getQRFromImage(imageData);
                //console.log(`SHC code result from page ${i}:`);
                //console.log(code);

        		if (code) {
                    try {
                        return await processSHCCode(code.data);
                    } catch (e) {
                        // We blew up during processing - log it and move on to the next page
                        console.log(e);
                    }
                }    
            }
        }

        // If we got here, no SHC was detected and successfully decoded.
        // The vast majority of our processed things right now are ON proof-of-vaccination PDFs, not SHC docs, so assume anything
        // that blew up here was a malformed ON proof-of-vaccination and create an appropriate error message for that
        return Promise.reject(new Error('No SHC QR code found! Please try taking another picture of the SHC you wish to import'));

    } catch (e) {
        Sentry.captureException(e);
        return Promise.reject(e);
    }
}