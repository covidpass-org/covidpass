import {v4 as uuid4} from 'uuid';
import * as Sentry from '@sentry/react';
import {Payload, PayloadBody} from "./payload";
    
export enum QrFormat {
    PKBarcodeFormatQR = 'PKBarcodeFormatQR',
    PKBarcodeFormatPDF417 = 'PKBarcodeFormatPDF417'
}

export enum Encoding {
    utf8 = "utf-8",
    iso88591 = "iso-8859-1"
}

export interface QrCode {
    message: string;
    format: QrFormat;
    messageEncoding: Encoding;
    // altText: string;
}

export interface PackageResult {
    payload: Payload;
    qrCode: QrCode;
}

var _configData: any;
export async function getConfigData(): Promise<any> {
    if (!_configData) {
        // Only call this once
        const configResponse = await fetch('/api/config');
        _configData = await configResponse.json();
    }
    
    return _configData;
}

export async function registerPass(payload : Payload) : Promise<boolean> {
    
    const registrationPayload = generateSHCRegisterPayload(payload);
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationPayload) // body data type must match "Content-Type" header
    }

    const configData = await getConfigData();
    // console.log('registering ' + JSON.stringify(registrationPayload, null, 2));

    const registrationHost = configData.registrationHost;
    const functionSuffix = configData.functionSuffix?? '';

    const registerUrl = `${registrationHost}/register${functionSuffix}`;
    // console.log(registerUrl);

    try {
        const response  = await fetch(registerUrl, requestOptions);
        const responseJson = await response.json();

        // console.log(JSON.stringify(responseJson,null,2));
        const wasSuccess = (responseJson["result"] === 'OK');
        if (!wasSuccess) {
            console.error(responseJson);
        }
        
        return Promise.resolve(wasSuccess);
    } catch (e) {
        console.error(e);
        Sentry.captureException(e);

        // Registration was unsuccessful
        return false;
    }
}

function generateSHCRegisterPayload(payload : Payload) : any {

    // Register an SHC pass by adding in our pertinent data fields. We only do this so we
    // can detect changes from providers and react quickly - we don't need these for any
    // validation since SHCs are self-validating. This entire registration process could
    // be turned off for SHCs and there would be no harm to the card creation process 
    const retPayload = {};
    const shcReceipt = payload.shcReceipt;
    retPayload['cardOrigin'] = shcReceipt.cardOrigin;
    retPayload['issuer'] = shcReceipt.issuer;
    retPayload['serialNumber'] = payload.serialNumber;

    for (let i = 0; i < shcReceipt.vaccinations.length; i++) {
        retPayload[`vaccination_${i}_name`] = shcReceipt.vaccinations[i].vaccineName;
        retPayload[`vaccination_${i}_organization`] = shcReceipt.vaccinations[i].organization;
    }
    
    return retPayload;
}

export class PassPhotoCommon {

    static async preparePayload(payloadBody: PayloadBody, shouldRegister = true, numDose: number = 0) : Promise<PackageResult> {

        console.log('preparePayload');
        
        // console.log(JSON.stringify(payloadBody, null, 2), numDose);

        const payload: Payload = new Payload(payloadBody, numDose);
        payload.serialNumber = uuid4();
        if (shouldRegister) {
            const wasSuccess = await registerPass(payload);
            if (!wasSuccess) {
                //return Promise.reject(`Error while trying to register pass!`);
                console.warn('Error while trying to register pass - continuing regardless...');
            }
        }

        // Create QR Code Object
        const qrCode: QrCode = {
            message: payloadBody.rawData,
            format: QrFormat.PKBarcodeFormatQR,
            messageEncoding: Encoding.iso88591,
        }

        return {payload: payload, qrCode: qrCode}
    }
}