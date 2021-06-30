import jsQR from "jsqr"
import {saveAs} from 'file-saver'

import {decodeData} from "../src/decode"
import { processJpeg, processPng, processPdf } from "../src/process"
import {createPass} from "../src/pass"
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

  const processFile = async function() {
    document.getElementById('spin').style.display = 'block'

    const file = document.getElementById('file').files[0]
    const fileBuffer = await readFileAsync(file)

    let imageData

    switch (file.type) {
      case 'application/pdf':
        console.log('pdf')
        imageData = await processPdf(fileBuffer)
        break
      case 'image/jpeg':
        console.log('jpeg')
        imageData = await processJpeg(fileBuffer)
        break
      case 'image/png':
        console.log('png')
        imageData = await processPng(fileBuffer)
        break
      default:
        error('Error', 'Invalid file type')
        return
    }

    let code = jsQR(imageData.data, imageData.width, imageData.height, {
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

      return {decoded: decoded, raw: rawData}
    } else {
      error('No QR code found', 'Try scanning the PDF again')
    }
  }

  const addToWallet = async function(event) {
    event.preventDefault()
    
    let result

    try {
      result = await processFile()
    } catch {
      error('Error:', 'Could not extract QR code data from PDF')
    }

    if (typeof result === 'undefined') {
      return
    }

    const color = document.getElementById('color').value
    
    try {
      const pass = await createPass(
        {
          decoded: result.decoded, 
          raw: result.raw, 
          color: color
        }
      )
      
      if (!pass) {
        error('Error:', "Something went wrong.")
      } else {
        const passBlob = new Blob([pass], {type: "application/vnd.apple.pkpass"});
        saveAs(passBlob, 'covid.pkpass')  
      }
    } catch (e) {
      error('Error:', e.message)
    } finally {
      document.getElementById('spin').style.display = 'none'
    }
  }

  return (
    <div>
      <form className="space-y-5" id="form" onSubmit={(e) => addToWallet(e)}>
        <Card step={1} heading="Select Certificate" content={
          <div className="space-y-5">
            <p>
              Please select the certificate, which you received from your doctor, pharmacy, vaccination centre or online. Note that taking a picture does not work on most devices yet.
            </p>
            <input
              className="w-full"
              type="file"
              id="file"
              accept="application/pdf,image/jpeg,image/png"
              required
            />
          </div>
        } />
        <Card step={2} heading="Pick a Color" content={
          <div className="space-y-5">
            <p>
              Pick a background color for your pass.
            </p>
            <div className="relative inline-block w-full">
              <select name="color" id="color" className="bg-gray-200 dark:bg-gray-900 focus:outline-none w-full h-10 pl-3 pr-6 text-base rounded-md appearance-none cursor-pointer">
                <option value="white">white</option>
                <option value="black">black</option>
                <option value="grey">grey</option>
                <option value="green">green</option>
                <option value="indigo">indigo</option>
                <option value="blue">blue</option>
                <option value="purple">purple</option>
                <option value="teal">teal</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"/></svg>
              </div>
            </div>
          </div>
        } />
        <Card step={3} heading="Add to Wallet" content={
          <div className="space-y-5">
            <p>
              Data privacy is of special importance when processing health-related data.
              In order for you to make an informed decision, please read the <a href="/privacy">Privacy Policy</a>.
            </p>
            <label htmlFor="privacy" className="flex flex-row space-x-4 items-center">
              <input type="checkbox" id="privacy" value="privacy" required className="h-4 w-4" />
              <p>
                I accept the <a href="/privacy" className="underline">Privacy Policy</a>
              </p>
            </label>
            <div className="flex flex-row items-center justify-start">
              <button id="download" type="download" className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                Add to Wallet
              </button>
              <div id="spin" style={{ "display": "none" }}>
                <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                  <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
            </div>
          </div>
        } />
      </form>
      <Alert />
      <canvas id="canvas" style={{ display: "none" }} />
    </div>
  )
}
