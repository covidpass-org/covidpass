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
import {getPayloadBodyFromFile, getPayloadBodyFromQR} from "../src/process";
import {PassData} from "../src/pass";
import {COLORS} from "../src/colors";
import Colors from './Colors';
import Button from './Button';

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
    
    // Whether Safari is used or not
    let [isSafari, setIsSafari] = useState<boolean>(true);

    // Check if Safari is used
    useEffect(() => {
        const navigator = window.navigator;
        setIsSafari(
            navigator.vendor && 
            navigator.vendor.indexOf('Apple') > -1 && 
            navigator.userAgent && 
            navigator.userAgent.indexOf('CriOS') == -1 && 
            navigator.userAgent.indexOf('FxiOS') == -1
        )
    }, [isSafari]);

    // Whether Safari is used or not
    let [isShareDialogAvailable, setIsShareDialogAvailable] = useState<boolean>(false);

    // Check if share dialog is available
    useEffect(() => {
        setIsShareDialogAvailable(window.navigator && window.navigator.share !== undefined);
    }, [isShareDialogAvailable]);

    // Open share dialog
    async function showShareDialog() {
        const shareData = {
            title: document.title,
            text: t('common:title') + ' – ' + t('common:subtitle'),
            url: window.location.protocol + "//" + window.location.host,
        };

        try {
            await window.navigator.share(shareData);
        } catch(error) {
            console.log(error);
        }
    }

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
                (result, _error, controls) => {
                    if (result !== undefined) {
                        setQrCode(result);
                        setFile(undefined);

                        controls.stop();

                        // Reset
                        setGlobalControls(undefined);
                        setIsCameraOpen(false);
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
            } else {
                payloadBody = await getPayloadBodyFromQR(qrCode, color);
            }

            let pass = await PassData.generatePass(payloadBody);

            const passBlob = new Blob([pass], {type: "application/vnd.apple.pkpass"});
            saveAs(passBlob, 'covid.pkpass');
            setLoading(false);
            
            var scrollingElement = (document.scrollingElement || document.body);
            scrollingElement.scrollTop = scrollingElement.scrollHeight;
        } catch (e) {
            setErrorMessage(e.message);
            setLoading(false);
        }
    }

    return (
        <div>
            <form className="space-y-5" id="form" onSubmit={addToWallet}>
                {
                    !isSafari && <Alert isWarning={true} message={t('iosHint')} onClose={() => {}}/>
                }
                <Card step="1" heading={t('index:selectCertificate')} content={
                    <div className="space-y-5">
                        <p>{t('index:selectCertificateDescription')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Button text={isCameraOpen ? t('index:stopCamera') : t('index:startCamera')} onClick={isCameraOpen ? hideCameraView : showCameraView} />
                            <Button text={t('index:openFile')} onClick={showFileDialog} />
                        </div>

                        <video id="cameraPreview"
                               className={`${isCameraOpen ? undefined : "hidden"} rounded-md w-full`}/>
                        <input type='file'
                               id='file'
                               accept="application/pdf,image/png,image/jpeg,image/webp,image/gif"
                               ref={inputFile}
                               style={{display: 'none'}}
                        />

                        {(qrCode || file) &&
                        <div className="flex items-center space-x-1">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
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
                            <Colors onChange={setSelectedColor} initialValue={selectedColor}/>
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
                                <Check text={t('createdOnDevice')}/>
                                <Check text={t('openSourceTransparent')}/>
                                <Check text={t('hostedInEU')}/>
                            </ul>
                        </div>
                        <label htmlFor="privacy" className="flex flex-row space-x-4 items-center pb-2">
                            <input type="checkbox" id="privacy" value="privacy" required className="h-5 w-5 outline-none"/>
                            <p>
                                {t('index:iAcceptThe')}&nbsp;
                                <Link href="/privacy">
                                    <a className="underline">
                                        {t('index:privacyPolicy')}
                                    </a>
                                </Link>.
                            </p>
                        </label>
                        <div className="grid grid-cols-1">
                            <button 
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 relative focus:outline-none h-20 text-white font-semibold rounded-md items-center flex justify-center">
                                <div id="spin" className={`${loading ? undefined : "hidden"} absolute left-2`}>
                                    <svg className="animate-spin h-5 w-5 ml-4" viewBox="0 0 24 24">
                                        <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"/>
                                        <path className="opacity-80" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                </div>
                                {t('index:addToWallet')}
                            </button>
                        </div>
                    </div>
                }/>
                {
                    errorMessage && <Alert isWarning={false} message={errorMessage} onClose={() => setErrorMessage(undefined)}/>
                }
                <Card content={
                    <div className={`${isShareDialogAvailable ? "md:grid-cols-2": ""} grid-cols-1 grid gap-5`}>
                        {
                            isShareDialogAvailable && <Button text={t('index:share')} onClick={showShareDialog} />
                        }
                        <Button icon="kofi.png" text={t('common:donate')} onClick={() => {
                            window.open('https://ko-fi.com/marvinsxtr', '_blank');
                        }} />
                    </div>
                }/>
            </form>
            <canvas id="canvas" style={{display: "none"}}/>
        </div>
    )
}

export default Form;