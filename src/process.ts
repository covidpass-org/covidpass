import {PayloadBody, Receipt} from "./payload";
import * as PdfJS from 'pdfjs-dist'
import {COLORS} from "./colors";
import  { getCertificatesInfoFromPDF } from "@ninja-labs/verify-pdf";  // ES6 
import * as Sentry from '@sentry/react';

import { TextItem } from "pdfjs-dist/types/display/api";

// import {PNG} from 'pngjs'
// import {decodeData} from "./decode";
// import {Result} from "@zxing/library";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

export async function getPayloadBodyFromFile(file: File, color: COLORS): Promise<PayloadBody> {
    // Read file
    const fileBuffer = await file.arrayBuffer();

    let receipt: Receipt;

    switch (file.type) {
        case 'application/pdf':
            receipt = await loadPDF(fileBuffer)
            break
        default:
            throw Error('invalidFileType')
    }

    const rawData = ''; // unused at the moment, the original use was to store the QR code from issuer

    return {
        receipt: receipt,
        rawData: rawData
    }
}

async function loadPDF(signedPdfBuffer : ArrayBuffer): Promise<any> {

    try {

        const certs = getCertificatesInfoFromPDF(signedPdfBuffer);

        const result = certs[0];
        const isClientCertificate = result.clientCertificate;
        const issuedByEntrust = (result.issuedBy.organizationName == 'Entrust, Inc.');
        const issuedToOntarioHealth = (result.issuedTo.commonName == 'covid19signer.ontariohealth.ca');
        console.log(`PDF is signed by ${result.issuedBy.organizationName}, issued to ${result.issuedTo.commonName}`);
        
        // const bypass = window.location.href.includes('grassroots2');

        if ((isClientCertificate && issuedByEntrust && issuedToOntarioHealth)) {
            console.log('getting receipt details inside PDF');
            const receipt = await getPdfDetails(signedPdfBuffer);
            // console.log(JSON.stringify(receipt, null, 2));
            return Promise.resolve(receipt);

        } else {
            console.error('invalid certificate');
            return Promise.reject(`invalid certificate + ${JSON.stringify(result)}`);
        }

    } catch (e) {
        console.error(e);
        Sentry.captureException(e);

        if (e.message.includes('Failed to locate ByteRange')) {
            e.message = 'Sorry. Selected PDF file is not digitally signed. Please download official copy from Step 1 and retry. Thanks.'
        }
        return Promise.reject(e);
    }


}

async function getPdfDetails(fileBuffer: ArrayBuffer): Promise<Receipt> {

    try {
        const typedArray = new Uint8Array(fileBuffer);
        let loadingTask = PdfJS.getDocument(typedArray);

        const pdfDocument = await loadingTask.promise;
            // Load last PDF page
        const pageNumber = pdfDocument.numPages;

        const pdfPage = await pdfDocument.getPage(pageNumber);
        const content = await pdfPage.getTextContent();
        const numItems = content.items.length;
        let name, vaccinationDate, vaccineName, dateOfBirth, numDoses, organization;

        for (let i = 0; i < numItems; i++) {
            let item = content.items[i] as TextItem;
            const value = item.str;
            if (value.includes('Name / Nom'))
                name = (content.items[i+1] as TextItem).str;
            if (value.includes('Date:')) {
                vaccinationDate = (content.items[i+1] as TextItem).str;
                vaccinationDate = vaccinationDate.split(',')[0];
            }
            if (value.includes('Product name')) {
                vaccineName = (content.items[i+1] as TextItem).str;
                vaccineName = vaccineName.split(' ')[0];
            } 
            if (value.includes('Date of birth'))
                dateOfBirth = (content.items[i+1] as TextItem).str;
            if (value.includes('Authorized organization'))
                organization = (content.items[i+1] as TextItem).str;    
            if (value.includes('You have received'))
                numDoses = Number(value.split(' ')[3]);
        }
        const receipt = new Receipt(name, vaccinationDate, vaccineName, dateOfBirth, numDoses, organization);

        return Promise.resolve(receipt);
    } catch (e) {
        Sentry.captureException(e);
        return Promise.reject(e);
    }

}
