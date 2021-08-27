import {saveAs} from 'file-saver';
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {BrowserQRCodeReader, IScannerControls} from "@zxing/browser";
import {Result} from "@zxing/library";
import {useTranslation} from 'next-i18next';
import Link from 'next/link';

import Card from "./Card";
import Alert from "./Alert";
import Check from './Check';
import {PayloadBody} from "../src/payload";
import {getPayloadBodyFromFile} from "../src/process";
import {PassData} from "../src/pass";
import {COLORS} from "../src/colors";
import Colors from './Colors';

function Form(): JSX.Element {
    const {t} = useTranslation(['index', 'errors', 'common']);

    // Whether camera is open or not
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

    // Currently selected color
    const [selectedColor, setSelectedColor] = useState<COLORS>(COLORS.WHITE);

    // Global camera controls
    const [globalControls, setGlobalControls] = useState<IScannerControls>(undefined);

    // Currently selected QR Code / File. Only one of them is set.
    const [qrCode, setQrCode] = useState<Result>(undefined);
    const [file, setFile] = useState<File>(undefined);

    const [errorMessage, _setErrorMessage] = useState<string>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    // Check if there is a translation and replace message accordingly
    const setErrorMessage = (message: string) => {
        if (message == undefined) {
            _setErrorMessage(undefined);
            return;
        }

        const translation = t('errors:'.concat(message));
        _setErrorMessage(translation !== message ? translation : message);
    };

    // File Input ref
    const inputFile = useRef<HTMLInputElement>(undefined)

    // Add event listener to listen for file change events
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

    // Show file Dialog
    async function showFileDialog() {
        inputFile.current.click();
    }

    async function gotoOntarioHealth() {
        window.location.href = 'https://covid19.ontariohealth.ca';
    }
    
    // Hide camera view
    async function hideCameraView() {
        if (globalControls !== undefined) {
            globalControls.stop();
        }
        setIsCameraOpen(false);
    }

    // Show camera view
    async function showCameraView() {
        // Create new QR Code Reader
        const codeReader = new BrowserQRCodeReader();

        // Needs to be called before any camera can be accessed
        let deviceList: MediaDeviceInfo[];

        try {
            deviceList = await BrowserQRCodeReader.listVideoInputDevices();
        } catch (e) {
            setErrorMessage('noCameraAccess');
            return;
        }

        // Check if camera device is present
        if (deviceList.length == 0) {
            setErrorMessage("noCameraFound");
            return;
        }

        // Get preview Element to show camera stream
        const previewElem: HTMLVideoElement = document.querySelector('#cameraPreview');

        // Set Global controls
        setGlobalControls(
            // Start decoding from video device
            await codeReader.decodeFromVideoDevice(undefined,
                previewElem,
                (result, error, controls) => {
                    if (result !== undefined) {
                        setQrCode(result);
                        setFile(undefined);

                        controls.stop();

                        // Reset
                        setGlobalControls(undefined);
                        setIsCameraOpen(false);
                    }
                    if (error !== undefined) {
                        setErrorMessage(error.message);
                    }
                }
            )
        );

        setIsCameraOpen(true);
    }

    // Add Pass to wallet
    async function addToWallet(event: FormEvent<HTMLFormElement>) {
        
        event.preventDefault();
        setLoading(true);

        if (navigator.userAgent.match('CriOS')) {
            setErrorMessage('safariSupportOnly');
            setLoading(false);
            return;
        }

        if (!file && !qrCode) {
            setErrorMessage('noFileOrQrCode')
            setLoading(false);
            return;
        }

        const color = selectedColor;
        let payloadBody: PayloadBody;

        try {
            if (file) {
                payloadBody = await getPayloadBodyFromFile(file, color);
                let pass = await PassData.generatePass(payloadBody);

                const passBlob = new Blob([pass], {type: "application/vnd.apple.pkpass"});
                saveAs(passBlob, 'covid.pkpass');
                setLoading(false);
            } 


        } catch (e) {
            setErrorMessage(e.message);
            setLoading(false);
        }
    }

    return (
        <div>
            <form className="space-y-5" id="form" onSubmit={addToWallet}>
                <Card step="1" heading={t('index:downloadReceipt')} content={
                    <div className="space-y-5">
                        <p>
                            {t('index:visit')}&nbsp;

                                <Link href="https://covid19.ontariohealth.ca">
                                    <a className="underline">
                                        {t('index:ontarioHealth')}
                                    </a>
                                </Link>&nbsp;
                                {t('index:downloadSignedPDF')}
                        </p>
                        <button id="ontariohealth" onClick={gotoOntarioHealth}
        
                                    className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                {t('index:gotoOntarioHealth')}
                        </button>
                    </div>
                }/>

                <Card step="2" heading={t('index:selectCertificate')} content={
                    <div className="space-y-5">
                        <p>{t('index:selectCertificateDescription')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* <button
                                type="button"
                                onClick={isCameraOpen ? hideCameraView : showCameraView}
                                className="focus:outline-none h-20 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md">
                                {isCameraOpen ? t('index:stopCamera') : t('index:startCamera')}
                            </button> */}
                            <button
                                type="button"
                                onClick={showFileDialog}
                                className="focus:outline-none h-20 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md">
                                {t('index:openFile')}
                            </button>
                        </div>

                        {/* <video id="cameraPreview"
                               className={`${isCameraOpen ? undefined : "hidden"} rounded-md w-full`}/> */}
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
                            <span className="w-full truncate">
                                {
                                    qrCode && t('index:foundQrCode')
                                }
                                {
                                    file && file.name
                                }
                            </span>
                        </div>
                        }
                    </div>
                }/>

                <Card step="3" heading={t('index:addToWallet')} content={
                    <div className="space-y-5">
                        <p>
                            {t('index:dataPrivacyDescription')}
                            {/* <Link href="/privacy">
                                <a>
                                    {t('index:privacyPolicy')}
                                </a>
                            </Link>. */}
                        </p>
                        <div>
                            <ul className="list-none">
                                <Check text={t('createdOnDevice')}/>
                                <Check text={t('openSourceTransparent')}/>
                                {/* <Check text={t('hostedInEU')}/> */}
                            </ul>
                        </div>

                        <div className="flex flex-row items-center justify-start">
                            <button id="download" type="submit"
                                    className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                {t('index:addToWallet')}
                            </button>
                            <div id="spin" className={loading ? undefined : "hidden"}>
                                <svg className="animate-spin h-5 w-5 ml-4" viewBox="0 0 24 24">
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
            <canvas id="canvas" style={{display: "none"}}/>
            {
                errorMessage && <Alert errorMessage={errorMessage} onClose={() => setErrorMessage(undefined)}/>
            }
        </div>
    )
}

export default Form;