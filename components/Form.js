const PDFJS = require('pdfjs-dist')
PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`

import jsQR from "jsqr"
import { saveAs } from 'file-saver'

import { decodeData } from "../src/decode"
import Card from "../components/Card"
import Alert from "../components/Alert"

export default Form

function Form() {

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsArrayBuffer(file);
    })
  }

  const error = function(heading, message) {
    const alert = document.getElementById('alert')
    alert.setAttribute('style', null)
    
    document.getElementById('heading').innerHTML = heading
    document.getElementById('message').innerHTML = message

    document.getElementById('spin').style.display = 'none'
  }

  const processPdf = async function() {
    document.getElementById('spin').style.display = 'block'

    const file = document.getElementById('pdf').files[0]

    const result = await readFileAsync(file)
    var typedarray = new Uint8Array(result)

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

      const result = { decoded: decoded, raw: rawData }
      
      return result
    } else {
      error('No QR code found', 'Try scanning the PDF again')
    }
  }

  const addToWallet = async function(event) {
    event.preventDefault()
    
    let result

    try {
      result = await processPdf()
    } catch {
      error('Error:', 'Could not extract QR code data from PDF')
    }

    if (typeof result === 'undefined') {
      return
    }

    const color = document.getElementById('color').value

    fetch(event.target.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.apple.pkpass',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          decoded: result.decoded, 
          raw: result.raw, 
          color: color
        })
    }).then( async (resp) => {
      if (!resp.ok) {
        error('Error:', await resp.text())
        return
      }

      const pass = await resp.blob()
      saveAs(pass, 'covid.pkpass')
    }).catch((error) => {
      error('Error:', error.message)
    }).finally(() => {
      document.getElementById('spin').style.display = 'none'
    })
  }

  return (
    <div>
      <form id="form"  action="https://api.covidpass.marvinsextro.de/covid.pkpass" method="POST" onSubmit={(e) => addToWallet(e)}>
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
              style={{
                "whiteSpace": "nowrap",
                "overflow": "hidden",
                "width": "300px",
              }}
            />
          </div>
        }/>
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
            <p>
              Data privacy is of special importance when processing health-related data.
              In order for you to make an informed decision, please read the <a href="/privacy">Privacy Policy</a>.
            </p>
            <label htmlFor="privacy" className="flex flex-row space-x-4 items-center">
              <input type="checkbox" id="privacy" value="privacy" required />
              <p>
                I accept the <a href="/privacy" className="underline">Privacy Policy</a>
              </p>
            </label>
            <div className="flex flex-row items-center justify-start">
              <button id="download" type="download" className="shadow-inner focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                Add to Wallet
              </button>
              <div id="spin" style={{"display": "none"}}>
                <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                  <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          </div>
        }/>
      </form>
      <Alert />
      <canvas id="canvas" style={{display: "none"}} />
    </div>
  )
}
  