import {Constants} from "./constants";
import {Payload, PayloadBody} from "./payload";
import {v4 as uuid4} from 'uuid';
import {BrowserQRCodeSvgWriter} from "@zxing/browser";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import * as Sentry from '@sentry/react';

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

export class Photo {
    logoText: string = Constants.NAME;
    organizationName: string = Constants.NAME;
    description: string = Constants.NAME;
    labelColor: string;
    foregroundColor: string;
    backgroundColor: string;
    serialNumber: string;
    barcodes: Array<QrCode>;
    barcode: QrCode;



    static async generatePass(payloadBody: PayloadBody): Promise<Blob> {

        // Create Payload
        try {
            const payload: Payload = new Payload(payloadBody);

            payload.serialNumber = uuid4();

            // register record

            const clonedReceipt = Object.assign({}, payload.receipt);
            delete clonedReceipt.name;
            delete clonedReceipt.dateOfBirth;
            clonedReceipt["serialNumber"] = payload.serialNumber;
            clonedReceipt["type"] = 'photo';

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

            const response  = await fetch('https://us-central1-grassroot-verifier.cloudfunctions.net/register', requestOptions);
            const responseJson = await response.json();

            console.log(JSON.stringify(responseJson,null,2));

            if (responseJson["result"] != 'OK')
                return Promise.reject();

            const encodedUri = `serialNumber=${encodeURIComponent(payload.serialNumber)}&vaccineName=${encodeURIComponent(payload.receipt.vaccineName)}&vaccinationDate=${encodeURIComponent(payload.receipt.vaccinationDate)}&organization=${encodeURIComponent(payload.receipt.organization)}&dose=${encodeURIComponent(payload.receipt.numDoses)}`;
            const qrCodeUrl = `${verifierHost}/verify?${encodedUri}`;

            // Create QR Code Object
            const qrCode: QrCode = {
                message: qrCodeUrl,
                format: QrFormat.PKBarcodeFormatQR,
                messageEncoding: Encoding.iso88591,
                // altText : payload.rawData

            }

            // Create photo
            // const photo: Photo = new Photo(payload, qrCode);

            // const body = domTree.getElementById('main');
            const body = document.getElementById('pass-image');
            body.hidden = false;
            body.style.backgroundColor = payload.backgroundColor

            const name = payload.receipt.name;
            const dateOfBirth = payload.receipt.dateOfBirth;
            const vaccineName = payload.receipt.vaccineName;
            let vaccineNameProper = vaccineName.charAt(0) + vaccineName.substr(1).toLowerCase();

            if (vaccineName.includes('PFIZER'))
                vaccineNameProper = 'Pfizer (Comirnaty)'

            if (vaccineName.includes('MODERNA'))
                vaccineNameProper = 'Moderna (SpikeVax)'

            if (vaccineName.includes('ASTRAZENECA'))
                vaccineNameProper = 'AstraZeneca (Vaxzevria)'

            let doseVaccine = "#" + String(payload.receipt.numDoses) + ": " + vaccineNameProper;

            document.getElementById('vaccineName').innerText = doseVaccine;
            document.getElementById('vaccinationDate').innerText = payload.receipt.vaccinationDate;
            document.getElementById('organization').innerText = payload.receipt.organization;
            document.getElementById('name').innerText = payload.receipt.name;
            document.getElementById('dob').innerText = payload.receipt.dateOfBirth;


            const codeWriter = new BrowserQRCodeSvgWriter();
            const svg = codeWriter.write(qrCode.message,200,200);
            svg.setAttribute('style','background-color: white');
            document.getElementById('qrcode').appendChild(svg);

            const blobPromise = toBlob(body);
            return blobPromise;
        }   catch (e) {
            Sentry.captureException(e);
            return Promise.reject();
        }
    }

    private constructor(payload: Payload, qrCode: QrCode) {

        // make a png in buffer using the payload
    }



}
