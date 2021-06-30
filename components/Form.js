import {saveAs} from 'file-saver'
import {BrowserQRCodeReader} from '@zxing/browser'
import React, {useEffect, useRef, useState} from "react"
import {decodeData} from "../src/decode"
import {processPdf, processPng} from "../src/process"
import {createPass} from "../src/pass"
import Card from "../components/Card"
import Alert from "../components/Alert"
import jsQR from "jsqr";

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

    const error = function (heading, message) {
        const alert = document.getElementById('alert')
        alert.setAttribute('style', null)

        document.getElementById('heading').innerHTML = heading
        document.getElementById('message').innerHTML = message

        document.getElementById('spin').style.display = 'none'
    }

    const processFile = async function () {
        console.log(qrCode)
        console.log(file)
        if (!qrCode && !file) {
            error("Error", "Please capture a QR Code or select a file to scan");
            return;
        }

        document.getElementById('spin').style.display = 'block'

        let rawData;

        if (file) {
            let imageData
            const fileBuffer = await readFileAsync(file)

            switch (file.type) {
                case 'application/pdf':
                    console.log('pdf')
                    imageData = await processPdf(fileBuffer)
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

            rawData = code.data;

        } else {
            rawData = qrCode.getText()
        }

        if (rawData) {
            let decoded

            try {
                decoded = decodeData(rawData)
            } catch (e) {
                error('Invalid QR code found', 'Try another method to select your certificate')
                return;
            }

            return {decoded: decoded, raw: rawData}
        } else {
            error('No QR code found', 'Try another method to select your certificate')
        }
    }

    const addToWallet = async function (event) {
        event.preventDefault()

        let result

        try {
            result = await processFile()
        } catch (e) {
            error('Error:', 'Could not extract QR code data from certificate')
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

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [globalControls, setGlobalControls] = useState(undefined);
    const [qrCode, setQrCode] = useState(undefined);
    const [file, setFile] = useState(undefined);

    const inputFile = useRef(undefined)

    useEffect(() => {
        if (inputFile && inputFile.current) {
            inputFile.current.addEventListener('input', () => {
                let selectedFile = inputFile.current.files[0];
                if (selectedFile !== undefined) {
                    setQrCode(undefined);
                    setFile(selectedFile);
                }
            });
        }
    }, [inputFile])

    async function showFileDialog() {
        inputFile.current.click();

    }


    async function hideCameraView() {
        if (globalControls !== undefined) {
            globalControls.stop();
        }
        setIsCameraOpen(false);
    }

    async function showCameraView() {
        const codeReader = new BrowserQRCodeReader();

        // Needs to be called before any camera can be accessed
        await BrowserQRCodeReader.listVideoInputDevices();

        // Get preview Element to show camera stream
        const previewElem = document.querySelector('#cameraPreview');

        setGlobalControls(await codeReader.decodeFromVideoDevice(undefined, previewElem, (result, error, controls) => {

            if (result !== undefined) {
                setQrCode(result);
                setFile(undefined);

                controls.stop();

                // Reset
                setGlobalControls(undefined);
                setIsCameraOpen(false);
            }
        }));

        setIsCameraOpen(true);
    }

    return (
        <div>
            <form className="space-y-5" id="form" onSubmit={(e) => addToWallet(e)}>
                <Card step={1} heading="Select Certificate" content={
                    <div className="space-y-5">
                        <p>
                            Please select the certificate screenshot or (scanned) PDF page, which you received from your
                            doctor, pharmacy, vaccination centre or online. Note that taking a picture does not work on
                            most devices yet.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <button
                                type="button"
                                onClick={isCameraOpen ? hideCameraView : showCameraView}
                                className="focus:outline-none h-20 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md">
                                {isCameraOpen ? "Stop Camera" : "Start Camera"}
                            </button>
                            <button
                                type="button"
                                onClick={showFileDialog}
                                className="focus:outline-none h-20 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md">
                                Open File (PDF, PNG)
                            </button>
                        </div>

                        <video id="cameraPreview" className={`${isCameraOpen ? undefined : "hidden"} rounded-md w-full`}/>
                        <input type='file'
                               id='file'
                               accept="application/pdf,image/png"
                               ref={inputFile}
                               style={{display: 'none'}}
                        />

                        {(qrCode || file) &&
                        <div className="flex items-center space-x-1">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                            </svg>
                            <span className="w-full">
                                {
                                    qrCode && 'Found QR Code!'
                                }
                                {
                                    file && file.name
                                }
                            </span>
                        </div>}

                    </div>
                }/>
                <Card step={2} heading="Pick a Color" content={
                    <div className="space-y-5">
                        <p>
                            Pick a background color for your pass.
                        </p>
                        <div className="relative inline-block w-full">
                            <select name="color" id="color"
                                    className="bg-gray-200 dark:bg-gray-900 focus:outline-none w-full h-10 pl-3 pr-6 text-base rounded-md appearance-none cursor-pointer">
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
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd" fillRule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                }/>
                <Card step={3} heading="Add to Wallet" content={
                    <div className="space-y-5">
                        <p>
                            Data privacy is of special importance when processing health-related data.
                            In order for you to make an informed decision, please read the <a href="/privacy">Privacy
                            Policy</a>.
                        </p>
                        <label htmlFor="privacy" className="flex flex-row space-x-4 items-center">
                            <input type="checkbox" id="privacy" value="privacy" required className="h-4 w-4"/>
                            <p>
                                I accept the <a href="/privacy" className="underline">Privacy Policy</a>
                            </p>
                        </label>
                        <div className="flex flex-row items-center justify-start">
                            <button id="download" type="download"
                                    className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                Add to Wallet
                            </button>
                            <div id="spin" style={{"display": "none"}}>
                                <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                                    <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                }/>
            </form>
            <Alert/>
            <canvas id="canvas" style={{display: "none"}}/>
        </div>
    )
}
