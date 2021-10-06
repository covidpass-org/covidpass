import {Constants} from "./constants";
import {Payload, PayloadBody} from "./payload";
import {v4 as uuid4} from 'uuid';
import {BrowserQRCodeSvgWriter} from "@zxing/browser";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import * as Sentry from '@sentry/react';
import {QrCode,Encoding,PackageResult,QrFormat,PassPhotoCommon} from './passphoto-common';
import { EncodeHintType } from "@zxing/library";

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

    static async generatePass(payloadBody: PayloadBody, numDose: number): Promise<Blob> {

        // Create Payload
        try {
            console.log('generatePass');
            const results = await PassPhotoCommon.preparePayload(payloadBody, numDose);
            
            const payload = results.payload;
            const qrCode = results.qrCode;

            let receipt;
            if (results.payload.rawData.length == 0) {
                receipt = results.payload.receipts[numDose];
            } else {
                receipt = results.payload.receipts[numDose];
            }

            const body = document.getElementById('pass-image');
            body.hidden = false;
            body.style.backgroundColor = payload.backgroundColor

            const vaccineName = receipt.vaccineName.toLocaleUpperCase();
            let vaccineNameProper = vaccineName.charAt(0) + vaccineName.substr(1).toLowerCase();
    
            if (vaccineName.includes('PFIZER'))
                vaccineNameProper = 'Pfizer (Comirnaty)'
    
            if (vaccineName.includes('MODERNA'))
                vaccineNameProper = 'Moderna (SpikeVax)'
    
            if (vaccineName.includes('ASTRAZENECA') || vaccineName.includes('COVISHIELD'))
                vaccineNameProper = 'AstraZeneca (Vaxzevria)'  
                
            let doseVaccine = "#" + String(receipt.numDoses) + ": " + vaccineNameProper;

            document.getElementById('vaccineName').innerText = doseVaccine;
            
            document.getElementById('vaccinationDate').innerText = receipt.vaccinationDate;
            document.getElementById('organization').innerText = receipt.organization;

            document.getElementById('name').innerText = receipt.name;
            document.getElementById('dob').innerText = receipt.dateOfBirth;

            if ((results.payload.rawData.length != 0) && (numDose > 1)) {
                for (let i = 1; i < numDose; i++) {
                    
                    //console.log(i);

                    receipt = results.payload.receipts[i];

                    document.getElementById('extraRow' + i ).hidden = false;
                    document.getElementById('vaccinationDate' + i).innerText = receipt.vaccinationDate;
                    document.getElementById('organization' + i).innerText = receipt.organization;
                }
            }

            const codeWriter = new BrowserQRCodeSvgWriter();
            const hints : Map<EncodeHintType,any> = new Map().set(EncodeHintType.ERROR_CORRECTION,'L');
            const svg = codeWriter.write(qrCode.message,200,200, hints);
            svg.setAttribute('style','background-color: white');
            document.getElementById('qrcode').appendChild(svg);

            const blobPromise = toBlob(body);
            return blobPromise;

        }   catch (e) {
            return Promise.reject(e);
        }
    }

    private constructor(payload: Payload, qrCode: QrCode) {

        // make a png in buffer using the payload
    }



}
