import {toBuffer as createZip} from 'do-not-zip';
import {v4 as uuid4} from 'uuid';

import {Constants} from "./constants";
import {Payload, PayloadBody, PassDictionary} from "./payload";
import {ValueSets} from "./value_sets";

const crypto = require('crypto')

enum QrFormat {
    PKBarcodeFormatQR = 'PKBarcodeFormatQR',
    PKBarcodeFormatPDF417 = 'PKBarcodeFormatPDF417'
}

enum Encoding {
    utf8 = "utf-8",
    iso88591 = "iso-8859-1"
}

interface QrCode {
    message: string;
    format: QrFormat;
    messageEncoding: Encoding;
    // altText: string;
}

interface SignData {
    PassJsonHash: string;
    useBlackVersion: boolean;
}

export class PassData {
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

    // Generates a sha1 hash from a given buffer
    private static getBufferHash(buffer: Buffer | string): string {
        const sha = crypto.createHash('sha1');
        sha.update(buffer);
        return sha.digest('hex');
    }

    private static async signWithRemote(signData: SignData): Promise<ArrayBuffer> {
        // Load API_BASE_URL form nextjs backend

        const configResponse = await fetch('/api/config')
        const apiBaseUrl = (await configResponse.json()).apiBaseUrl
        console.log(`${apiBaseUrl}/sign`);

        console.log(JSON.stringify(signData));

        const response = await fetch(`${apiBaseUrl}/sign`, {
            method: 'POST',
            headers: {
                'Accept': 'application/octet-stream',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signData)
        })

        if (response.status !== 200) {
            throw Error('signatureFailed')
        }

        return await response.arrayBuffer()
    }

    static async generatePass(payloadBody: PayloadBody): Promise<Buffer> {

        // Create Payload

        const payload: Payload = new Payload(payloadBody);

        payload.serialNumber = uuid4();

        // register record

        const clonedReceipt = Object.assign({}, payload.receipt);
        delete clonedReceipt.name;
        delete clonedReceipt.dateOfBirth;
        clonedReceipt["serialNumber"] = payload.serialNumber;

        let requestOptions = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clonedReceipt) // body data type must match "Content-Type" header
        }

        console.log('registering ' + JSON.stringify(clonedReceipt, null, 2));
        const configResponse = await fetch('/api/config')
        const verifierHost = (await configResponse.json()).verifierHost

        // const verifierHost = 'https://verifier.vaccine-ontario.ca';

        const response  = await fetch(`${verifierHost}/register`, requestOptions);
        const responseJson = await response.json();

        console.log(JSON.stringify(responseJson,null,2));

        if (responseJson["result"] != 'OK') 
            return Promise.reject();

        // Create QR Code Object
        const qrCode: QrCode = {
            message: `${verifierHost}/verify?serialNumber=${payload.serialNumber}&vaccineName=${payload.receipt.vaccineName}&vaccinationDate=${payload.receipt.vaccinationDate}&organization=${payload.receipt.organization}&dose=${payload.receipt.numDoses}`,
            format: QrFormat.PKBarcodeFormatQR,
            messageEncoding: Encoding.iso88591,
            // altText : payload.rawData

        }

        // Create pass data
        const pass: PassData = new PassData(payload, qrCode);

        // Create new zip
        const zip = [] as { path: string; data: Buffer | string }[];

        // Adding required fields

        // console.log(pass);

        // Create pass.json
        const passJson = JSON.stringify(pass);

        // Add pass.json to zip
        zip.push({path: 'pass.json', data: Buffer.from(passJson)});

        // Add Images to zip
        zip.push({path: 'icon.png', data: payload.img1x})
        zip.push({path: 'icon@2x.png', data: payload.img2x})
        zip.push({path: 'logo.png', data: payload.img1x})
        zip.push({path: 'logo@2x.png', data: payload.img2x})

        // Adding manifest
        // Construct manifest
        const manifestJson = JSON.stringify(
            zip.reduce(
                (res, {path, data}) => {
                    res[path] = PassData.getBufferHash(data);
                    return res;
                },
                {},
            ),
        );

        // console.log(manifestJson);

        // Add Manifest JSON to zip
        zip.push({path: 'manifest.json', data: Buffer.from(manifestJson)});

        // Create pass hash
        const passHash = PassData.getBufferHash(Buffer.from(passJson));

        // Sign hash with server
        const manifestSignature = await PassData.signWithRemote({
            PassJsonHash: passHash,
            useBlackVersion: false,
        });

        // Add signature to zip
        zip.push({path: 'signature', data: Buffer.from(manifestSignature)});

        return createZip(zip);
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
    }
}
