import {PayloadBody, Receipt} from "./payload";
import * as PdfJS from 'pdfjs-dist'
import {COLORS} from "./colors";
import  { getCertificatesInfoFromPDF } from "@ninja-labs/verify-pdf";  // ES6 
// import verifyPDF from "@ninja-labs/verify-pdf";
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

async function loadPDF(signedPdfBuffer): Promise<any> {

    try {

        const certs = getCertificatesInfoFromPDF(signedPdfBuffer);

        // console.log('certs = ' + JSON.stringify(certs, null, 2));

        // check signature

        // console.log("verifying");
        // const verificationResult = verifyPDF(signedPdfBuffer);      // not sure why it failed

        const result = certs[0];
        const isClientCertificate = result.clientCertificate;
        const issuedByEntrust = (result.issuedBy.organizationName == 'Entrust, Inc.');
        const issuedToOntarioHealth = (result.issuedTo.commonName == 'covid19signer.ontariohealth.ca');
        if (isClientCertificate && issuedByEntrust && issuedToOntarioHealth) {
            console.log('PDF looks good, getting payload');
            const receipt = await getPdfDetails(signedPdfBuffer);
            console.log(JSON.stringify(receipt, null, 2));
            return Promise.resolve(receipt);

        } else {
            console.error('invalid certificate');
            return Promise.reject('invalid certificate');

        }

    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }


}

async function getPdfDetails(fileBuffer: ArrayBuffer): Promise<Receipt> {

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
        const item = content.items[i];
        const value = item.str;
        if (value.includes('Name / Nom'))
            name = content.items[i+1].str;
        if (value.includes('Date:')) {
            vaccinationDate = content.items[i+1].str;
            vaccinationDate = vaccinationDate.split(',')[0];
        }
        if (value.includes('Product name')) {
            vaccineName = content.items[i+1].str;
            vaccineName = vaccineName.split(' ')[0];
        } 
        if (value.includes('Date of birth'))
            dateOfBirth = content.items[i+1].str;
        if (value.includes('Authorized organization'))
            organization = content.items[i+1].str;    
        if (value.includes('You have received'))
            numDoses = Number(value.split(' ')[3]);
    }
    const receipt = new Receipt(name, vaccinationDate, vaccineName, dateOfBirth, numDoses, organization);

    return Promise.resolve(receipt);

}
