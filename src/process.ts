import {PayloadBody} from "./payload";
import * as PdfJS from 'pdfjs-dist'
import jsQR, {QRCode} from "jsqr";
import {decodeData} from "./decode";
import {Result} from "@zxing/library";
import {COLORS} from "./colors";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

export async function getPayloadBodyFromFile(file: File, color: COLORS): Promise<PayloadBody> {
    let imageData: ImageData;

    switch (file.type) {
        case 'application/pdf':
            // Read file
            const fileBuffer = await file.arrayBuffer();
            imageData = await getImageDataFromPdf(fileBuffer)
            break
        case 'image/png':
        case 'image/jpeg':
        case 'image/webp':
        case 'image/gif':
            imageData = await getImageDataFromImage(file)
            break
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