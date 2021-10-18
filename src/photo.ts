import {Constants} from "./constants";
import {PayloadBody} from "./payload";
import { toBlob } from 'html-to-image';
import {QrCode,PassPhotoCommon} from './passphoto-common';
import { Encoder, QRByte, QRNumeric, ErrorCorrectionLevel } from '@nuintun/qrcode';

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
            let receipt = results.payload.receipts[numDose];

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

            const qrcode = new Encoder();
            
            qrcode.setEncodingHint(true);
            qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.L);

            if (qrCode.message.includes('shc:/')) {
                // Write an SHC code in 2 chunks otherwise it won't render right
                qrcode.write(new QRByte('shc:/'));
                qrcode.write(new QRNumeric(qrCode.message.substring(5)));
            } else {
                // If this isn't an SHC code, just write it out as a string
                qrcode.write(qrCode.message);
            }

            qrcode.make();
            const qrImage = new Image(220, 220);
            qrImage.src = qrcode.toDataURL(2, 15);
            document.getElementById('qrcode').appendChild(qrImage);

            return await toBlob(body);

        }   catch (e) {
            return Promise.reject(e);
        }
    }

    static async generateSHCPass(payloadBody: PayloadBody): Promise<Blob> {
        // Create Payload
        try {
            console.log('generateSHCPass');
            const results = await PassPhotoCommon.preparePayload(payloadBody);
            const qrCode = results.qrCode;
            const body = document.getElementById('shc-pass-image');
            body.hidden = false;

            document.getElementById('shc-card-name').innerText = results.payload.shcReceipt.name;
            document.getElementById('shc-card-dob').innerText = results.payload.shcReceipt.dateOfBirth;

            document.getElementById('shc-card-origin').innerText = results.payload.shcReceipt.cardOrigin;

            const vaccinations = results.payload.shcReceipt.vaccinations;
            const numDisplay = vaccinations.length <= 4 ? vaccinations.length : 4;

            for (let i = 0; i < numDisplay; i++) {

                document.getElementById(`shc-card-vaccine-name-${i+1}`).innerText = vaccinations[i].vaccineName;
                document.getElementById(`shc-card-vaccine-date-${i+1}`).innerText = vaccinations[i].vaccinationDate;
                if (i > 1) {
                    document.getElementById(`shc-card-vaccine-name-${i+1}`).parentElement.hidden = false;
                }

            }

            const qrcode = new Encoder();
            
            qrcode.setEncodingHint(true);
            qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.L);

            if (qrCode.message.includes('shc:/')) {
                // Write an SHC code in 2 chunks otherwise it won't render right
                qrcode.write(new QRByte('shc:/'));
                qrcode.write(new QRNumeric(qrCode.message.substring(5)));
            } else {
                // If this isn't an SHC code, just write it out as a string
                qrcode.write(qrCode.message);
            }

            qrcode.make();
            const qrImage = new Image(220, 220);
            qrImage.src = qrcode.toDataURL(2, 15);
            document.getElementById('shc-qrcode').appendChild(qrImage);

            return await toBlob(body);

        }   catch (e) {
            return Promise.reject(e);
        }
    }

    private constructor() {

        // make a png in buffer using the payload
    }
}
