import {saveAs} from 'file-saver';
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {BrowserQRCodeReader} from "@zxing/browser";
import {Result} from "@zxing/library";
import {useTranslation} from 'next-i18next';
import Link from 'next/link';

import Card from "./Card";
import Alert from "./Alert";
import Check from './Check';
import {PayloadBody} from "../src/payload";
import {getPayloadBodyFromFile, getPayloadBodyFromQR} from "../src/process";
import {PassData} from "../src/pass";

function Form(): JSX.Element {
    const { t } = useTranslation(['index', 'errors', 'common']);

    // Whether camera is open or not
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

    // Global camera controls
    const [globalControls, setGlobalControls] = useState(undefined);

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

        if(navigator.userAgent.match('CriOS')) {
            setErrorMessage('safariSupportOnly');
            setLoading(false);
            return;
        }

        if (!file && !qrCode) {
            setErrorMessage('noFileOrQrCode')
            setLoading(false);
            return;
        }

        const color = (document.getElementById('color') as HTMLSelectElement).value;
        let payloadBody: PayloadBody;

        try {
            if (file) {
                payloadBody = await getPayloadBodyFromFile(file, color);
            } else {
                payloadBody = await getPayloadBodyFromQR(qrCode, color);
            }

            let pass = await PassData.generatePass(payloadBody);

            const passBlob = new Blob([pass], {type: "application/vnd.apple.pkpass"});
            saveAs(passBlob, 'covid.pkpass');
            setLoading(false);
        } catch (e) {
            setErrorMessage(e.message);
            setLoading(false);
        }
    }

    return (
        <div>
            <form className="space-y-5" id="form" onSubmit={addToWallet}>
                <Card step="1" heading={t('index:selectCertificate')} content={
                    <div className="space-y-5">
                        <p>{t('index:selectCertificateDescription')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <button
                                type="button"
                                onClick={isCameraOpen ? hideCameraView : showCameraView}
                                className="focus:outline-none h-20 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md">
                                {isCameraOpen ? t('index:stopCamera') : t('index:startCamera')}
                            </button>
                            <button
                                type="button"
                                onClick={showFileDialog}
                                className="focus:outline-none h-20 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md">
                                {t('index:openFile')}
                            </button>
                        </div>

                        <video id="cameraPreview"
                               className={`${isCameraOpen ? undefined : "hidden"} rounded-md w-full`}/>
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
                <Card step="2" heading={t('index:pickColor')} content={
                    <div className="space-y-5">
                        <p>{t('index:pickColorDescription')}</p>
                        <div className="relative inline-block w-full">
                            <select name="color" id="color"
                                    className="bg-gray-200 dark:bg-gray-900 focus:outline-none w-full h-10 pl-3 pr-6 text-base rounded-md appearance-none cursor-pointer">
                                <option value="white">{t('index:colorWhite')}</option>
                                <option value="black">{t('index:colorBlack')}</option>
                                <option value="grey">{t('index:colorGrey')}</option>
                                <option value="green">{t('index:colorGreen')}</option>
                                <option value="indigo">{t('index:colorIndigo')}</option>
                                <option value="blue">{t('index:colorBlue')}</option>
                                <option value="purple">{t('index:colorPurple')}</option>
                                <option value="teal">{t('index:colorTeal')}</option>
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
                <Card step="3" heading={t('index:addToWallet')} content={
                    <div className="space-y-5">
                        <p>
                            {t('index:dataPrivacyDescription')}
                            <Link href="/privacy">
                                <a>
                                    {t('index:privacyPolicy')}
                                </a>
                            </Link>.
                        </p>
                        <div>
                            <ul className="list-none">
                                <Check text={t('createdOnDevice')}></Check>
                                <Check text={t('openSourceTransparent')}></Check>
                                <Check text={t('hostedInEU')}></Check>
                            </ul>
                        </div>
                        <label htmlFor="privacy" className="flex flex-row space-x-4 items-center">
                            <input type="checkbox" id="privacy" value="privacy" required className="h-4 w-4"/>
                            <p>
                                {t('index:iAcceptThe')}&nbsp;
                                <Link href="/privacy">
                                    <a className="underline">
                                        {t('index:privacyPolicy')}
                                    </a>
                                </Link>.
                            </p>
                        </label>
                        <div className="flex flex-row items-center justify-start">
                            <button id="download" type="submit"
                                    className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                {t('index:addToWallet')}
                            </button>
                            <div id="spin" className={loading ? undefined : "hidden"}>
                                <svg className="animate-spin h-5 w-5 ml-3" viewBox="0 0 24 24">
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