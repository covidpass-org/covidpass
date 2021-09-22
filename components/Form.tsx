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
import {Photo} from "../src/photo";
import {COLORS} from "../src/colors";
import Colors from './Colors';
import {isChrome, isIOS, isIPad13, isMacOs, isSafari, deviceDetect, osName, osVersion} from 'react-device-detect';
import * as Sentry from '@sentry/react';
import { counterReset } from 'html2canvas/dist/types/css/property-descriptors/counter-reset';
import { color } from 'html2canvas/dist/types/css/types/color';


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

    const [passCount, setPassCount] = useState<string>('');
    const [generated, setGenerated] = useState<boolean>(false);         // this flag represents the file has been used to generate a pass
    const hitcountHost = 'https://stats.vaccine-ontario.ca';


    useEffect(() => {
        if (passCount.length == 0) {
            getPassCount();
        }
    }, []);

    const getPassCount = async () => {
        const hitCount = await getHitCount();
        setPassCount(hitCount);
    };

    async function getHitCount() {

        try {
            const request = `${hitcountHost}/nocount?url=pass.vaccine-ontario.ca`;

            let response = await fetch(request);
            const counter = await response.text();
    
            return Promise.resolve(counter);

        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }

    }

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
                    setGenerated(false);
                }
            });
        }
        checkBrowserType();
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

    async function incrementCount() {

        try {
            if (typeof generated == undefined || !generated) {

                const request = `${hitcountHost}/count?url=pass.vaccine-ontario.ca`;
                console.log(request);

                let response = await fetch(request);
                console.log(request);

                const counter = await response.text();      // response count is not used intentionally so it always goes up by 1 only even if the server has changed

                let newPasscount = Number(passCount) + 1;
                console.log(counter);
                setPassCount(counter);
                setGenerated(true);
                console.log(`new PassCount  = ${newPasscount}`);

            }

        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }

    }

    // Add Pass to wallet
    async function addToWallet(event: FormEvent<HTMLFormElement>) {
        
        event.preventDefault();
        setLoading(true);

        if (!file && !qrCode) {
            setErrorMessage('noFileOrQrCode')
            setLoading(false);
            return;
        }

        const color = selectedColor;
        let payloadBody: PayloadBody;

        try {
            if (file) {

                console.log('> generatePass');

                payloadBody = await getPayloadBodyFromFile(file, COLORS.GREEN);
                await incrementCount();

                let pass = await PassData.generatePass(payloadBody);
                const passBlob = new Blob([pass], {type: "application/vnd.apple.pkpass"});
                saveAs(passBlob, 'covid.pkpass');
                setLoading(false);
            } 


        } catch (e) {
            console.error(e);

            Sentry.captureException(e);

            if (e.message != undefined) {
                setErrorMessage(e.message);
            } else {
                setErrorMessage("Unable to continue.");
            }

            setLoading(false);
        }
    }

    //TODO: merge with addToWallet for common flow

    async function saveAsPhoto() {
        
        setLoading(true);

        if (!file && !qrCode) {
            setErrorMessage('noFileOrQrCode')
            setLoading(false);
            return;
        }

        let payloadBody: PayloadBody;

        try {
            payloadBody = await getPayloadBodyFromFile(file, COLORS.GREEN);
            await incrementCount();

            let photoBlob = await Photo.generatePass(payloadBody);
            saveAs(photoBlob, 'pass.png');

            // need to clean up
            const qrcodeElement = document.getElementById('qrcode');
            const svg = qrcodeElement.firstChild;
            qrcodeElement.removeChild(svg);
            const body = document.getElementById('pass-image');
            body.hidden = true;

            setLoading(false);
        } catch (e) {
            Sentry.captureException(e);
            setErrorMessage(e.message);
            setLoading(false);
        }
    }

    async function checkBrowserType() {

        if (isIPad13) {
            setErrorMessage('Sorry. Apple does not support the use of Wallet on iPad. Please use iPhone/Safari.');
            document.getElementById('download').setAttribute('disabled','true');
        } 
        if (!isSafari && !isChrome) {
            setErrorMessage('Sorry. Apple Wallet pass can be added using Safari or Chrome only.');
            document.getElementById('download').setAttribute('disabled','true');
        }
        if (isIOS && (!osVersion.includes('13') && !osVersion.includes('14') && !osVersion.includes('15'))) {
            setErrorMessage('Sorry, iOS 13+ is needed for the Apple Wallet functionality to work')
            document.getElementById('download').setAttribute('disabled','true')
        }
        if (isIOS && !isSafari) {
            setErrorMessage('Sorry, only Safari can be used to add a Wallet Pass on iOS')
            document.getElementById('download').setAttribute('disabled','true')
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
                        <p>{t('index:selectCertificateReminder')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <button
                                type="button"
                                onClick={showFileDialog}
                                className="focus:outline-none h-20 bg-green-600 hover:bg-gray-700 text-white font-semibold rounded-md">
                                {t('index:openFile')}
                            </button>
                        </div>

                        <input type='file'
                               id='file'
                               accept="application/pdf"
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

                <Card step="3" heading={t('index:addToWalletHeader')} content={
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
                                <Check text={t('qrCode')}/>
                                <Check text={t('openSourceTransparent')}/>
                                <Check text={t('verifierLink')}/>
                                {passCount && <Check text={passCount + ' ' + t('numPasses')}/>}

                                {/* <Check text={t('hostedInEU')}/> */}
                            </ul>
                        </div>

                        <div className="flex flex-row items-center justify-start">
                            <button id="download" type="submit" value='applewallet' name='action'
                                    className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                {t('index:addToWallet')}
                            </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button id="saveAsPhoto" type="button" value='photo' name='action' onClick={saveAsPhoto}
                                    className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                {t('index:saveAsPhoto')}
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