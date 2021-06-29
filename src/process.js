const PDFJS = require('pdfjs-dist')
PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`

import jpeg from 'jpeg-js'
import { PNG } from 'pngjs'

export async function processPdf(file) {
  var typedarray = new Uint8Array(file)

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  var loadingTask = PDFJS.getDocument(typedarray)
  await loadingTask.promise.then(async function (pdfDocument) {
    const pdfPage = await pdfDocument.getPage(1)
    const viewport = pdfPage.getViewport({ scale: 1 })
    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderTask = pdfPage.render({
      canvasContext: ctx,
      viewport,
    })
    
    return await renderTask.promise
  })

  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  return imageData
}

export async function processJpeg(file) {
  return jpeg.decode(file)
}

export async function processPng(file) {
  return new Promise(async (resolve, reject) => {
    let png = new PNG({ filterType: 4 })
    
    png.parse(file, (error, data) => {
      if(error) {
        reject()
      }

      resolve(data)
    })
  })
}