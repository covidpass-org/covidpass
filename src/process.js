import {PNG} from 'pngjs'
import * as PdfJS from 'pdfjs-dist'

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

// Processes a pdf file and returns it as ImageData
export async function processPdf(file) {
    // Array to store ImageData information
    const typedArray = new Uint8Array(file)

    // PDF scale, increase to read smaller QR Codes
    const pdfScale = 2;

    // Get the canvas and context to render PDF
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    let loadingTask = PdfJS.getDocument(typedArray)

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
            canvasContext: ctx,
            viewport,
        })

        return await renderTask.promise
    })

    // Return PDF Image Data
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// Processes a PNG File and returns it as ImageData
export async function processPng(file) {
    return new Promise(async (resolve, reject) => {
        let png = new PNG({filterType: 4})

        png.parse(file, (error, data) => {
            if (error) {
                reject()
            }

            resolve(data)
        })
    })
}