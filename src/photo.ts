import {Constants} from "./constants";
import {Payload, PayloadBody} from "./payload";
import {v4 as uuid4} from 'uuid';
import {BrowserQRCodeSvgWriter} from "@zxing/browser";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

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

        // Create photo
        // const photo: Photo = new Photo(payload, qrCode);

        // const body = domTree.getElementById('main');
        const body = document.getElementById('pass-image');
        body.hidden = false;

        if (payload.receipt.numDoses > 1)
            body.style.backgroundColor = 'green';
        else
            body.style.backgroundColor = 'orangered';

        const vaccineName = payload.receipt.vaccineName;
        const vaccineNameProper = vaccineName.charAt(0) + vaccineName.substr(1).toLowerCase();
        const doseVaccine = "Dose " + String(payload.receipt.numDoses) + ": " + vaccineNameProper;

        document.getElementById('vaccineName').innerText = doseVaccine;
        document.getElementById('vaccinationDate').innerText = payload.receipt.vaccinationDate;
        document.getElementById('organization').innerText = payload.receipt.organization;
        document.getElementById('name').innerText = payload.receipt.name;

        const codeWriter = new BrowserQRCodeSvgWriter();
        const svg = codeWriter.write(qrCode.message,200,200);
        svg.setAttribute('style','background-color: white; display:block; marginLeft: auto; marginRight: auto');
        document.getElementById('qrcode').appendChild(svg);
        
        const blobPromise = toBlob(body);
        return blobPromise;
    }

    private constructor(payload: Payload, qrCode: QrCode) {

        // make a png in buffer using the payload
    }



}
