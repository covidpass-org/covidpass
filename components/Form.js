const PDFJS = require('pdfjs-dist')
PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`

import jsQR from "jsqr";

import { decodeData } from "../src/decode"
import Card from "../components/Card"
import Alert from "../components/Alert"

export default Form

function Form() {

  const error = function(heading, message) {
    const alert = document.getElementById('alert')
    alert.setAttribute('style', null)
    
    document.getElementById('heading').innerHTML = heading
    document.getElementById('message').innerHTML = message
  }

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

      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        const rawData = code.data
        let decoded

        try {
          decoded = decodeData(rawData) 
        } catch (error) {
          error('Invalid QR code found', 'Make sure that you picked the correct PDF')
        }

        const result = JSON.stringify({ decoded: decoded, raw: rawData })

        const payload = document.getElementById('payload')
        payload.setAttribute('value', result)

        const download = document.getElementById('download')
        download.disabled = false
      } else {
        error('No QR code found', 'Try scanning the PDF again')
      }
    }

	  fileReader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <Alert message="" heading="" />
      <form id="form">
        <Card step={1} heading="Select Certificate" content={
          <div className="space-y-5">
            <p>
              Please select the (scanned) certificate PDF page, which you received from your doctor, pharmacy, vaccination centre or online.
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
      </form>
      <form id="hidden" action="https://api.covidpass.marvinsextro.de/covid.pkpass" method="POST">
        <Card step={2} heading="Pick a Color" content={
          <div className="space-y-5">
            <select name="color" id="color">
              <option value="white">white</option>
              <option value="black">black</option>
              <option value="grey">grey</option>
              <option value="green">green</option>
              <option value="indigo">indigo</option>
              <option value="blue">blue</option>
              <option value="purple">purple</option>
              <option value="teal">teal</option>
            </select>
          </div>
        }/>
        <Card step={3} heading="Add to Wallet" content={
          <div className="space-y-5">
            <label htmlFor="privacy" className="flex flex-row space-x-4 items-center">
              <input type="checkbox" id="privacy" value="privacy" required />
              <p>
                I have read the <a href="/privacy" className="underline">Privacy Policy</a>
              </p>
            </label>
            <input type="hidden" id="payload" name="payload" />
            <button id="download" type="download" disabled className="shadow-inner focus:outline-none bg-green-600 py-1 px-2 text-white font-semibold rounded-md disabled:bg-gray-400">
              Add to Wallet
            </button>
          </div>
        }/>
      </form>
      <canvas id="canvas" style={{display: "none"}} />
    </div>
  )
}
  