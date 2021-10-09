import {toBuffer as createZip} from 'do-not-zip';
import {v4 as uuid4} from 'uuid';

import {Constants} from "./constants";
import {Payload, PayloadBody, PassDictionary} from "./payload";
import * as Sentry from '@sentry/react';
import { QRCodeMatrixUtil } from '@zxing/library';
import {QrCode,Encoding,PackageResult,QrFormat,PassPhotoCommon} from './passphoto-common';

const crypto = require('crypto')

interface SignData {
    PassJsonHash: string;
    useBlackVersion: boolean;
}

export class GPayData {
    passTypeIdentifier: string = Constants.PASS_IDENTIFIER;
    teamIdentifier: string = Constants.TEAM_IDENTIFIER;
    sharingProhibited: boolean = true;
    voided: boolean = false;
    formatVersion: number = 1;
    logoText: string = Constants.NAME;
    organizationName: string = Constants.NAME;
    description: string = Constants.NAME;
    labelColor: string;
    foregroundColor: string;
    backgroundColor: string;
    serialNumber: string;
    barcodes: Array<QrCode>;
    barcode: QrCode;
    generic: PassDictionary;
    expirationDate: string;

    // Generates a sha1 hash from a given buffer
    private static getBufferHash(buffer: Buffer | string): string {
        const sha = crypto.createHash('sha1');
        sha.update(buffer);
        return sha.digest('hex');
    }


    static async generatePass(payloadBody: PayloadBody, numDose: number): Promise<string> {

        // Create Payload
        try {
            
            console.log('> GPayData::generatePass');

            const results = await PassPhotoCommon.preparePayload(payloadBody, numDose);
            const payload = results.payload;
            // Create pass data

            const configResponse = await fetch('/api/config')
            const apiBaseUrl = (await configResponse.json()).gpayBaseUrl

            const result = await fetch(`${apiBaseUrl}/api/loyalty/create`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payloadBody: payloadBody,
                    id: payload.serialNumber,
                    qrCodeMessage: results.qrCode.message
                }),
            });
            const details = await result.json();

            // Step 2: Set JWT based on API response.
            const jwt = details.token;
            
            console.log(jwt);

            return Promise.resolve(jwt);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private constructor(payload: Payload, qrCode: QrCode) {
        this.labelColor = payload.labelColor;
        this.foregroundColor = payload.foregroundColor;
        this.backgroundColor = payload.backgroundColor;
        this.serialNumber = payload.serialNumber; // Generate random UUID v4
        this.barcodes = [qrCode];
        this.barcode = qrCode;
        this.generic = payload.generic;
        this.sharingProhibited = true;
        this.expirationDate = payload.expirationDate;
    }
}
