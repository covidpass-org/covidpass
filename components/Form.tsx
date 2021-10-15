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
import Bullet from './Bullet';


function Form(): JSX.Element {
    const {t} = useTranslation(['index', 'errors', 'common']);

    // Whether camera is open or not
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

    // Currently selected color
    const [selectedColor, setSelectedColor] = useState<COLORS>(COLORS.WHITE);

    // Currently selected dose
    const [selectedDose, setSelectedDose] = useState<number>(2);

    // Global camera controls
    const [globalControls, setGlobalControls] = useState<IScannerControls>(undefined);

    // Currently selected QR Code / File. Only one of them is set.
    const [qrCode, setQrCode] = useState<Result>(undefined);
    const [file, setFile] = useState<File>(undefined);
    const [payloadBody, setPayloadBody] = useState<PayloadBody>(undefined);

    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [fileLoading, setFileLoading] = useState<boolean>(false);

    const [generated, setGenerated] = useState<boolean>(false);         // this flag represents the file has been used to generate a pass

    const [isDisabledAppleWallet, setIsDisabledAppleWallet] = useState<boolean>(false);
    const [addErrorMessages, _setAddErrorMessages] = useState<Array<string>>([]);
    const [fileErrorMessages, _setFileErrorMessages] = useState<Array<string>>([]);

    const [showDoseOption, setShowDoseOption] = useState<boolean>(false);
    // const [warningMessages, _setWarningMessages] = useState<Array<string>>([]);
    const hitcountHost = 'https://stats.vaccine-ontario.ca';


    // Check if there is a translation and replace message accordingly
    const setAddErrorMessage = (message: string) => {
        if (!message) {
            return;
        }

        const translation = t('errors:'.concat(message));
        _setAddErrorMessages(Array.from(new Set([...addErrorMessages, translation !== message ? translation : message])));
    };

    const setFileErrorMessage = (message: string) => {
        if (!message) {
            return;
        }

        const translation = t('errors:'.concat(message));
        _setFileErrorMessages(Array.from(new Set([...addErrorMessages, translation !== message ? translation : message])));
    };

    // const setWarningMessage = (message: string) => {
    //     if (!message) {
    //         return;
    //     }

    //     const translation = t('errors:'.concat(message));
    //     _setWarningMessages(Array.from(new Set([...warningMessages, translation !== message ? translation : message])));
    // }

    const deleteAddErrorMessage = (message: string) =>{
        _setAddErrorMessages(addErrorMessages.filter(item => item !== message))
    }
    const deleteFileErrorMessage = (message: string) =>{
        _setFileErrorMessages(addErrorMessages.filter(item => item !== message))
    }

    // File Input ref
    const inputFile = useRef<HTMLInputElement>(undefined)

    // Add event listener to listen for file change events
    useEffect(() => {
        if (inputFile && inputFile.current) {
            inputFile.current.addEventListener('change', () => {
                let selectedFile = inputFile.current.files[0];
                if (selectedFile !== undefined) {
                    setFileLoading(true);
                    setQrCode(undefined);
                    setPayloadBody(undefined);
                    setFile(undefined);
                    setShowDoseOption(false);
                    setGenerated(false);
                    deleteAddErrorMessage(t('errors:'.concat('noFileOrQrCode')));
                    _setFileErrorMessages([]);
                    checkBrowserType();
                    getPayload(selectedFile);
                }
            });
        }
        checkBrowserType();
    }, [inputFile])

    async function getPayload(file){
        try {
            const payload = await getPayloadBodyFromFile(file);
            setPayloadBody(payload);
            setFileLoading(false);
            setFile(file);

            if (payload.rawData.length == 0) {
                if (Object.keys(payload.receipts).length === 1) {
                    setSelectedDose(parseInt(Object.keys(payload.receipts)[0]));
                } else {
                    setShowDoseOption(true);
                }
            } 
        } catch (e) {
            setFile(file);
            setFileLoading(false);
            if (e != undefined) {
                console.error(e);

                // Don't report known errors to Sentry
                if (!e.message.includes('invalidFileType') &&
                    !e.message.includes('not digitally signed') &&
					!e.message.includes('No valid ON proof-of-vaccination')) {
                  Sentry.captureException(e);
                }

                if (e.message != undefined) {
                    setFileErrorMessage(e.message);
                } else {
                    setFileErrorMessage("Unable to continue.");
                }

            } else {
                setFileErrorMessage("Unexpected error. Sorry.");
            }
        }

    }

    // Show file Dialog
    async function showFileDialog() {
        inputFile.current.click();
    }

    async function gotoOntarioHealth(e) {
        e.preventDefault();
        window.open('https://covid19.ontariohealth.ca','_blank');
    }
    async function goToFAQ(e) {
        e.preventDefault();
        window.location.href = '/faq';
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
            setAddErrorMessage('noCameraAccess');
            return;
        }

        // Check if camera device is present
        if (deviceList.length == 0) {
            setAddErrorMessage("noCameraFound");
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
                        setAddErrorMessage(error.message);
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
                //console.log(request);

                let response = await fetch(request);
                //console.log(response);

                setGenerated(true);
            }

        } catch (e) {
	        // Fail silently - we shouldn't blow up receipt processing because we couldn't increment our counter
            console.error(e);
            //return Promise.reject(e);
        }
    }

    // Add Pass to wallet
    async function addToWallet(event: FormEvent<HTMLFormElement>) {
        
        event.preventDefault();
        setSaveLoading(true);

        if (!file && !qrCode) {
            setAddErrorMessage('noFileOrQrCode')
            setSaveLoading(false);
            return;
        }

        try {
            if (payloadBody) {
                
                let selectedReceipt;
                let filenameDetails = '';
                if (payloadBody.rawData.length > 0) {
                    // This is an SHC receipt, so do our SHC thing
                    selectedReceipt = payloadBody.shcReceipt;
                    filenameDetails = selectedReceipt.cardOrigin.replace(' ', '-');
                } else {
                    selectedReceipt = payloadBody.receipts[selectedDose];
                    const vaxName = selectedReceipt.vaccineName.replace(' ', '-');
                    const passDose = selectedReceipt.numDoses;
                    filenameDetails = `${vaxName}-${passDose}`;
                }
                const passName = selectedReceipt.name.replace(' ', '-');
                const covidPassFilename = `grassroots-receipt-${passName}-${filenameDetails}.pkpass`;

                const pass = await PassData.generatePass(payloadBody, selectedDose);

                const passBlob = new Blob([pass], {type: "application/vnd.apple.pkpass"});

                await incrementCount();

                saveAs(passBlob, covidPassFilename);
                setSaveLoading(false);
            } 


        } catch (e) {

            if (e) {
                console.error(e);
                Sentry.captureException(e);

                if (e.message) {
                    setAddErrorMessage(e.message);
                } else {
                    setAddErrorMessage("Unable to continue.");
                }

            } else {
                setAddErrorMessage("Unexpected error. Sorry.");
            }

            setSaveLoading(false);
        }
    }

    //TODO: merge with addToWallet for common flow

    async function saveAsPhoto() {
        
        setSaveLoading(true);

        if (!file && !qrCode) {
            setAddErrorMessage('noFileOrQrCode');
            setSaveLoading(false);
            return;
        }

        try {

            let selectedReceipt;
            let photoBlob: Blob;
            let filenameDetails = '';
            if (payloadBody.rawData.length > 0) {    
                // This is an SHC receipt, so do our SHC thing
                selectedReceipt = payloadBody.shcReceipt;
                photoBlob = await Photo.generateSHCPass(payloadBody);
                filenameDetails = selectedReceipt.cardOrigin.replace(' ', '-');
            } else {
                // This is an old-style ON custom QR code Receipt
                selectedReceipt = payloadBody.receipts[selectedDose];
                const vaxName = selectedReceipt.vaccineName.replace(' ', '-');
                const passDose = selectedReceipt.numDoses;
                photoBlob = await Photo.generatePass(payloadBody, passDose);
                filenameDetails = `${vaxName}-${passDose}`;
            }
            const passName = selectedReceipt.name.replace(' ', '-');
            const covidPassFilename = `grassroots-receipt-${passName}-${filenameDetails}.png`;

            await incrementCount();
            
            saveAs(photoBlob, covidPassFilename);

            // need to clean up
            if (document.getElementById('qrcode').hasChildNodes()) {
                document.getElementById('qrcode').firstChild.remove();
            }

            if (document.getElementById('shc-qrcode').hasChildNodes()) {
                document.getElementById('shc-qrcode').firstChild.remove();
            }

            // Hide both our possible passes
            document.getElementById('pass-image').hidden = true;
            document.getElementById('shc-pass-image').hidden = true;

            setSaveLoading(false);
        } catch (e) {

            Sentry.captureException(e);

            setAddErrorMessage(e.message);
            setSaveLoading(false);
        }
    }
    const verifierLink = () => <li className="flex flex-row items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 fill-current text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <p>
            {t('verifierLink')}&nbsp;
            <Link href="https://verifier.vaccine-ontario.ca/">
                <a className="underline">verifier.vaccine-ontario.ca </a>
            </Link>&nbsp;(NOTE: does not yet support new QR codes; will add support shortly)
        </p>
    </li>

    const setDose = (e) => {
        setSelectedDose(e.target.value);
    }

    function checkBrowserType() {

        // if (isIPad13) {
        //     setAddErrorMessage('Sorry. Apple does not support the use of Wallet on iPad. Please use iPhone/Safari.');
        //     setIsDisabledAppleWallet(true);
        // } 
        // if (!isSafari && !isChrome) {
        //     setAddErrorMessage('Sorry. Apple Wallet pass can be added using Safari or Chrome only.');
        //     setIsDisabledAppleWallet(true);
        // }
        // if (isIOS && (!osVersion.includes('13') && !osVersion.includes('14') && !osVersion.includes('15'))) {
        //     setAddErrorMessage('Sorry, iOS 13+ is needed for the Apple Wallet functionality to work')
        //     setIsDisabledAppleWallet(true);
        // }
        if (isIOS && !isSafari) {
            // setAddErrorMessage('Sorry, only Safari can be used to add a Wallet Pass on iOS');
            setAddErrorMessage('Sorry, only Safari can be used to add a Wallet Pass on iOS');
            setIsDisabledAppleWallet(true);
            console.log('not safari')
        }
        // } else if (!isIOS) {
        //     setWarningMessage('Only Safari on iOS is officially supported for Wallet import at the moment - ' +
        //         'for other platforms, please ensure you have an application which can open Apple Wallet .pkpass files');
        //     setIsDisabledAppleWallet(false);
        // }
    }

    return (
        <div>
            <form className="space-y-5" id="form" onSubmit={addToWallet}>
                <Card step="1" heading={t('index:downloadReceipt')} content={
                    <div className="space-y-5">
                        <p>
                            {t('index:visit')}&nbsp;
                                <Link href="https://covid19.ontariohealth.ca">
                                    <a className="underline" target="_blank">
                                        {t('index:ontarioHealth')}
                                    </a>
                                </Link>&nbsp;
                                {t('index:downloadSignedPDF')}<br/><br/>
                                {t('index:reminderNotToRepeat')}

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center justify-start">
                            <button
                                type="button"
                                onClick={showFileDialog}
                                className="focus:outline-none h-20 bg-green-600 hover:bg-gray-700 text-white font-semibold rounded-md">
                                {t('index:openFile')}
                            </button>
                            <div id="spin" className={fileLoading ? undefined : "hidden"}>
                                <svg className="animate-spin h-5 w-5 ml-4" viewBox="0 0 24 24">
                                    <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                            </div>
                        </div>

                        <input type='file'
                               id='file'
                               accept="application/pdf,.png,.jpg,.jpeg,.gif,.webp"
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
                        
                        {fileErrorMessages.map((message, i) =>
                            <Alert message={message} key={'error-' + i} type="error" />
                        )}
                    </div>
                }/>

                {showDoseOption && <Card step="3" heading={'Choose dose number'} content={
                    <div className="space-y-5">
                        <p>
                            {t('index:formatChange')}
                            <br /><br />
                            {t('index:saveMultiple')}
                        </p>
                        <link href="https://cdn.jsdelivr.net/npm/@tailwindcss/custom-forms@0.2.1/dist/custom-forms.css" rel="stylesheet"/>
                        <div className="block">
                            <div className="mt-2">
                                {payloadBody && Object.keys(payloadBody.receipts).map(key =>
                                    <div key={key}>
                                        <label className="inline-flex items-center">
                                            <input onChange={setDose} type="radio" className="form-radio" name="radio" value={key} checked={parseInt(key) == selectedDose} />
                                            <span className="ml-2">Dose {key}</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                } />}

                <Card step={showDoseOption ? '4' : '3'} heading={t('index:addToWalletHeader')} content={
                    <div className="space-y-5">
                        {/* <p>
                            {t('index:dataPrivacyDescription')}
                            <Link href="/privacy">
                                <a>
                                    {t('index:privacyPolicy')}
                                </a>
                            </Link>.
                        </p> */}
                        <div>
                            <ul className="list-none">
                                <Check text={t('createdOnDevice')}/>
                                <Check text={t('piiNotSent')}/>
                                <Check text={t('openSourceTransparent')}/>
                                {verifierLink()}
                            </ul>
                        </div>

                        <div className="flex flex-row items-center justify-start">
                            <button disabled={isDisabledAppleWallet || saveLoading ||!payloadBody} id="download" type="submit" value='applewallet' name='action'
                                className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                {t('index:addToWallet')}
                            </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button id="saveAsPhoto" type="button" disabled={saveLoading || !payloadBody} value='photo' name='action' onClick={saveAsPhoto}
                                    className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                {t('index:saveAsPhoto')}
                            </button>

                            <div id="spin" className={saveLoading ? undefined : "hidden"}>
                                <svg className="animate-spin h-5 w-5 ml-4" viewBox="0 0 24 24">
                                    <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                            </div>
                        </div>
                        {addErrorMessages.map((message, i) =>
                            <Alert message={message} key={'error-' + i} type="error" />
                        )}
                        {/* {warningMessages.map((message, i) =>
                            <Alert message={message} key={'warning-' + i} type="warning" />
                        )} */}
                    </div>
                }/>

                <Card step="?" heading={t('index:questions')} content={
                    <div className="space-y-5">
                        <p>Do you want to use this tool but...</p>
                        <div>
                            <ul>
                                <Bullet text="You would like to understand how your data is handled?"/> 
                                <Bullet text="You don't have a health card?"/>
                                <Bullet text="You have a Red/White OHIP card?"/>
                                <Bullet text='You have an iPhone 6 or older?'/>
                                <Bullet text='You have an Android?'/>
                            </ul>
                        </div>

                        <div className="flex flex-row items-center justify-start">
                            <button id="faq-redirect" onClick={goToFAQ}
                                className="focus:outline-none bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                                Visit our FAQ section for the answers!
                            </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                }/>
            </form>
            <canvas id="canvas" style={{ display: "none" }} />
        </div>
    )
}

export default Form;
