const PDFJS = require('pdfjs-dist')
PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`

import jsQR from "jsqr";

import { decodeData } from "../src/decode"
import Card from "../components/Card"

export default Form

function Form() {
  const processPdf = async function(input) {
    const file = input.target.files[0]
    var fileReader = new FileReader(); 

    fileReader.onload = async function() {
      var typedarray = new Uint8Array(this.result)
      
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

      console.log(canvas.toDataURL('image/png'));

      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        const rawData = code.data
        console.log(rawData)

        const decoded = decodeData(rawData)
        console.log(decoded)

        const result = JSON.stringify({ decoded: decoded, raw: rawData })

        const payload = document.getElementById('payload')
        payload.setAttribute('value', result)

        const download = document.getElementById('download')
        download.disabled = false
      }
    }

	  fileReader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <form id="form">
        <Card step={1} heading="Select Certificate" content={
          <div className="space-y-5">
            <p>
              Please select the (scanned) certificate PDF, which you received from your doctor, pharmacy, vaccination centre or online.
            </p>
            <input
              type="file"
              id="pdf"
              accept="application/pdf"
              required
              onChange={(input) => { processPdf(input) }}
              style={{
                "whiteSpace": "nowrap",
                "overflow": "hidden",
                "width": "300px",
              }}
            />
          </div>
        }/>
        <Card step={2} heading="Add to Wallet" content={
          <div className="space-y-5">
            <label htmlFor="privacy" className="flex flex-row space-x-4">
              <input type="checkbox" id="privacy" value="privacy" required />
              <p>
                I have read the <a href="/privacy">Privacy Policy</a>
              </p>
            </label>
            <form id="hidden" action="https://api.covidpass.marvinsextro.de/covid.pkpass" method="POST">
              <input type="hidden" id="payload" name="payload" />
              <button id="download" type="download" disabled className="shadow-inner focus:outline-none bg-green-600 py-1 px-2 text-white font-semibold rounded-md disabled:bg-gray-400">
                Add to Wallet
              </button>
            </form>
          </div>
        }/>
        <canvas id="canvas" style={{display: "none"}} />
      </form>
    </div>
  )
}
  