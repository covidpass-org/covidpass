import {toBuffer as createZip} from 'do-not-zip';
import {v4 as uuid4} from 'uuid';

import {Constants} from "./constants";
import {Payload, PayloadBody, PassDictionary} from "./payload";
import * as Sentry from '@sentry/react';
import { QRCodeMatrixUtil } from '@zxing/library';
    
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

export class PassPhotoCommon {

    static async preparePayload(payloadBody: PayloadBody, numDose: number) : Promise<PackageResult> {

        console.log('preparePayload');
        
        // console.log(JSON.stringify(payloadBody, null, 2), numDose);

        const payload: Payload = new Payload(payloadBody, numDose);

        payload.serialNumber = uuid4();
        let qrCodeMessage;

        if (payloadBody.rawData.startsWith('shc:/')) {
            
            qrCodeMessage = payloadBody.rawData;

        } else {
            
            // register record

            const clonedReceipt = Object.assign({}, payloadBody.receipts[numDose]);
            delete clonedReceipt.name;
            delete clonedReceipt.dateOfBirth;
            clonedReceipt["serialNumber"] = payload.serialNumber;
            clonedReceipt["type"] = 'applewallet';

            let requestOptions = {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clonedReceipt) // body data type must match "Content-Type" header
            }

            // console.log('registering ' + JSON.stringify(clonedReceipt, null, 2));
            const configResponse = await fetch('/api/config');

            const configResponseJson = await configResponse.json();

            const verifierHost = configResponseJson.verifierHost;
            const registrationHost = configResponseJson.registrationHost;
            let functionSuffix = configResponseJson.functionSuffix;

            if (functionSuffix == undefined)
                functionSuffix = '';

            const registerUrl = `${registrationHost}/register${functionSuffix}`;
            // console.log(registerUrl);

            const response  = await fetch(registerUrl, requestOptions);
            const responseJson = await response.json();

            // console.log(JSON.stringify(responseJson,null,2));

            if (responseJson["result"] != 'OK') {
                console.error(responseJson);
                return Promise.reject();
            }

            const encodedUri = `serialNumber=${encodeURIComponent(payload.serialNumber)}&vaccineName=${encodeURIComponent(payloadBody.receipts[numDose].vaccineName)}&vaccinationDate=${encodeURIComponent(payloadBody.receipts[numDose].vaccinationDate)}&organization=${encodeURIComponent(payloadBody.receipts[numDose].organization)}&dose=${encodeURIComponent(payloadBody.receipts[numDose].numDoses)}`;
            const qrCodeUrl = `${verifierHost}/verify?${encodedUri}`;
            qrCodeMessage = qrCodeUrl;
            // console.log(qrCodeUrl);
        }

        // Create QR Code Object
        const qrCode: QrCode = {
            message: qrCodeMessage,
            format: QrFormat.PKBarcodeFormatQR,
            messageEncoding: Encoding.iso88591,
            // altText : payload.rawData

        }

        return {payload: payload, qrCode: qrCode}

    }
}