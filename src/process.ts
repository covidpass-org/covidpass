import {PayloadBody, Receipt, HashTable} from "./payload";
import * as PdfJS from 'pdfjs-dist'
import jsQR, {QRCode} from "jsqr";
import  { getCertificatesInfoFromPDF } from "@ninja-labs/verify-pdf";  // ES6 
import {COLORS} from "./colors";
import * as Sentry from '@sentry/react';
import * as Decode from './decode';
import {getScannedJWS, verifyJWS, decodeJWS} from "./shc";
import { PNG } from 'pngjs/browser';

import { PDFPageProxy, TextContent, TextItem } from "pdfjs-dist/types/display/api";

// import {PNG} from 'pngjs'
// import {decodeData} from "./decode";
// import {Result} from "@zxing/library";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.js`

export async function getPayloadBodyFromFile(file: File): Promise<PayloadBody> {
    // Read file
    const fileBuffer = await file.arrayBuffer();
    let receipts: HashTable<Receipt>;
    let rawData = ''; // unused at the moment, the original use was to store the QR code from issuer

    switch (file.type) {
        case 'application/pdf':
            const receiptType = await detectReceiptType(fileBuffer);
            console.log(receiptType);
            if (receiptType == 'ON') {
                receipts = await loadPDF(fileBuffer)                   // receipt type is needed to decide if digital signature checking is needed
            } else {
                const shcData = await processSHC(fileBuffer);
                receipts = shcData.receipts;
                rawData = shcData.rawData;
            }
            break
        default:
            throw Error('invalidFileType')
    }

    return {
        receipts: receipts,
        rawData: rawData
    }


}

async function detectReceiptType(fileBuffer : ArrayBuffer): Promise<string> {

    // Ontario has 'COVID-19 vaccination receipt'
    // BC has BC Vaccine Card

        console.log('detectPDFTypeAndProcess');

        const typedArray = new Uint8Array(fileBuffer);
        let loadingTask = PdfJS.getDocument(typedArray);
        const pdfDocument = await loadingTask.promise;
        const pdfPage = await pdfDocument.getPage(1);  //first page
        const content = await pdfPage.getTextContent();
        const numItems = content.items.length;
        for (let i = 0; i < numItems; i++) {
            let item = content.items[i] as TextItem;
            const value = item.str;
            console.log(value);
            if (value.includes('COVID-19 vaccination receipt')) {
                console.log('detected on');
                return Promise.resolve('ON');
            }
        }
        return Promise.resolve('SHC');

}

async function loadPDF(fileBuffer : ArrayBuffer): Promise<HashTable<Receipt>> {

    try {

        const certs = getCertificatesInfoFromPDF(fileBuffer);

        const result = certs[0];
        const refcert = '-----BEGIN CERTIFICATE-----\r\n'+
        'MIIHNTCCBh2gAwIBAgIQanhJa+fBXT8GQ8QG/t9p4TANBgkqhkiG9w0BAQsFADCB\r\n'+
        'ujELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUVudHJ1c3QsIEluYy4xKDAmBgNVBAsT\r\n'+
        'H1NlZSB3d3cuZW50cnVzdC5uZXQvbGVnYWwtdGVybXMxOTA3BgNVBAsTMChjKSAy\r\n'+
        'MDE0IEVudHJ1c3QsIEluYy4gLSBmb3IgYXV0aG9yaXplZCB1c2Ugb25seTEuMCwG\r\n'+
        'A1UEAxMlRW50cnVzdCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eSAtIEwxTTAeFw0y\r\n'+
        'MTA1MjAxMzQxNTBaFw0yMjA2MTkxMzQxNDlaMIHTMQswCQYDVQQGEwJDQTEQMA4G\r\n'+
        'A1UECBMHT250YXJpbzEQMA4GA1UEBxMHVG9yb250bzETMBEGCysGAQQBgjc8AgED\r\n'+
        'EwJDQTEYMBYGCysGAQQBgjc8AgECEwdPbnRhcmlvMRcwFQYDVQQKEw5PbnRhcmlv\r\n'+
        'IEhlYWx0aDEaMBgGA1UEDxMRR292ZXJubWVudCBFbnRpdHkxEzARBgNVBAUTCjE4\r\n'+
        'LTA0LTIwMTkxJzAlBgNVBAMTHmNvdmlkMTlzaWduZXIub250YXJpb2hlYWx0aC5j\r\n'+
        'YTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL2bD+Ng1RNYCNVVtEQ3\r\n'+
        'zg8JKFvRWFFPIF/UTXGg3iArK1tKr1xtjx6OdFtwosHyo+3ksPRicc4KeuV6/QMF\r\n'+
        'qiVJ5IOy9TSVImJsmONgFyEiak0dGYG5SeHiWwyaUvkniWd7U3wWEl4nOZuLAYu4\r\n'+
        '8ZLot8p8Q/UaNvAoNsRDv6YDGjL2yGHaXxi3Bb6XTQTLcevuEQeM6g1LtKyisZfB\r\n'+
        'Q8TKThBq99EojwHfXIhddxbPKLeXvWJgK1TcL17UFIwx6ig74s0LyYqEPm8Oa8qR\r\n'+
        '+IesFUT9Liv7xhV+tU52wmNfDi4znmLvs5Cmh/vmcHKyhEbxhYqciWJocACth5ij\r\n'+
        'E3kCAwEAAaOCAxowggMWMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFFoW3zt+jaHS\r\n'+
        'pm1EV5hU4XD+mwO5MB8GA1UdIwQYMBaAFMP30LUqMK2vDZEhcDlU3byJcMc6MGgG\r\n'+
        'CCsGAQUFBwEBBFwwWjAjBggrBgEFBQcwAYYXaHR0cDovL29jc3AuZW50cnVzdC5u\r\n'+
        'ZXQwMwYIKwYBBQUHMAKGJ2h0dHA6Ly9haWEuZW50cnVzdC5uZXQvbDFtLWNoYWlu\r\n'+
        'MjU2LmNlcjAzBgNVHR8ELDAqMCigJqAkhiJodHRwOi8vY3JsLmVudHJ1c3QubmV0\r\n'+
        'L2xldmVsMW0uY3JsMCkGA1UdEQQiMCCCHmNvdmlkMTlzaWduZXIub250YXJpb2hl\r\n'+
        'YWx0aC5jYTAOBgNVHQ8BAf8EBAMCBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsG\r\n'+
        'AQUFBwMCMEsGA1UdIAREMEIwNwYKYIZIAYb6bAoBAjApMCcGCCsGAQUFBwIBFhto\r\n'+
        'dHRwczovL3d3dy5lbnRydXN0Lm5ldC9ycGEwBwYFZ4EMAQEwggF+BgorBgEEAdZ5\r\n'+
        'AgQCBIIBbgSCAWoBaAB3AFYUBpov18Ls0/XhvUSyPsdGdrm8mRFcwO+UmFXWidDd\r\n'+
        'AAABeYoCz+MAAAQDAEgwRgIhAKGKAoZMzwkh/3sZXq6vtEYhoYHfZzsjh9jqZvfS\r\n'+
        'xQVZAiEAmJu/ftbkNFBr8751Z9wA2dpI0Qt+LoeL1TJQ833Kdg4AdQDfpV6raIJP\r\n'+
        'H2yt7rhfTj5a6s2iEqRqXo47EsAgRFwqcwAAAXmKAs/cAAAEAwBGMEQCICsD/Vj+\r\n'+
        'ypZeHhesMyv/TkS5ftQjqyIaAFTL/02Gtem4AiBcWdPQspH3vfzZr4LO9z4u5jTg\r\n'+
        'Psfm5PZr66tI7yASrAB2AEalVet1+pEgMLWiiWn0830RLEF0vv1JuIWr8vxw/m1H\r\n'+
        'AAABeYoC0WkAAAQDAEcwRQIgTL5F11+7KhQ60jnODm9AkyvXRLY32Mj6tgudRAXO\r\n'+
        'y7UCIQDd/dU+Ax1y15yiAA5xM+bWJ7T+Ztd99SD1lw/o8fEmOjANBgkqhkiG9w0B\r\n'+
        'AQsFAAOCAQEAlpV3RoNvnhDgd2iFSF39wytf1R6/0u5FdL7eIkYNfnkqXu9Ux9cO\r\n'+
        '/OeaGAFMSzaDPA8Xt9A0HqkEbh1pr7UmZVqBwDr4a7gczvt7+HFJRn//Q2fwhmaw\r\n'+
        'vXTLLxcAPQF00G6ySsc9MUbsArh6AVhMf9tSXgNaTDj3X3UyYDfR+G8H9eVG/LPp\r\n'+
        '34QV/8uvPUFXGj6MjdQysx6YG+K3mae0GEVpODEl4MiceEFZ7v4CPA6pFNadijRF\r\n'+
        '6tdXky2psuo7VXfnE2WIlahKr56x+8R6To5pcWglKTywTqvCbnKRRVZhXXYo3Awd\r\n'+
        '8h9+TbL3ACHDqA4fi5sAbZ7nMXp8RK4o5A==\r\n'+
        '-----END CERTIFICATE-----';

        const pdfCert = result.pemCertificate.trim();
        const pdfOrg = result.issuedBy.organizationName;
        const issuedpemCertificate = (pdfCert == refcert.trim());

        //console.log(`pdf is signed by this cert ${result.pemCertificate.trim()}`);
        //console.log(issuedpemCertificate);
        //console.log(`PDF is signed by ${result.issuedBy.organizationName}, issued to ${result.issuedTo.commonName}`);

        // const bypass = window.location.href.includes('grassroots2');

        if (( issuedpemCertificate )) {
            //console.log('getting receipt details inside PDF');
            const receipt = await getPdfDetails(fileBuffer);
            // console.log(JSON.stringify(receipt, null, 2));
            return Promise.resolve(receipt);

        } else {
            // According to the Sentry docs, this can be up to 8KB in size
            // https://develop.sentry.dev/sdk/data-handling/#variable-size
            Sentry.setContext("certificate", {
                pdfCert: pdfCert,
                pdfOrg: pdfOrg,
            });
            Sentry.captureMessage('Certificate validation failed');
            console.error('invalid certificate');
            return Promise.reject(`invalid certificate + ${JSON.stringify(result)}`);
        }
        

    } catch (e) {

        console.error(e);

        if (e.message.includes('Failed to locate ByteRange')) {
            e.message = 'Sorry. Selected PDF file is not digitally signed. Please download official copy from Step 1 and retry. Thanks.'
        } else {
            Sentry.captureException(e);
        }
        return Promise.reject(e);
    }


}

async function getPdfDetails(fileBuffer: ArrayBuffer): Promise<HashTable<Receipt>> {

    try {
        const typedArray = new Uint8Array(fileBuffer);
        let loadingTask = PdfJS.getDocument(typedArray);

        const pdfDocument = await loadingTask.promise;
        // Load all dose numbers
        const { numPages } = pdfDocument;
        const receiptObj = {};

        for (let pages = 1; pages <= numPages; pages++){
            const pdfPage = await pdfDocument.getPage(pages);
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
            receiptObj[numDoses] = new Receipt(name, vaccinationDate, vaccineName, dateOfBirth, numDoses, organization);
            console.log(receiptObj[numDoses]);
        }

        return Promise.resolve(receiptObj);
    } catch (e) {
        Sentry.captureException(e);
        return Promise.reject(e);
    }

}

async function getImageDataFromPdf(pdfPage: PDFPageProxy): Promise<ImageData> {

    const pdfScale = 2;

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const canvasContext = canvas.getContext('2d');
    const viewport = pdfPage.getViewport({scale: pdfScale})

    // Set correct canvas width / height
    canvas.width = viewport.width
    canvas.height = viewport.height

    // render PDF
    const renderTask = pdfPage.render({
        canvasContext: canvasContext,
        viewport,
    })

    await renderTask.promise;

    // Return PDF Image Data
    return canvasContext.getImageData(0, 0, canvas.width, canvas.height)

}

async function processSHC(fileBuffer : ArrayBuffer) : Promise<any> {

    console.log('processSHC');

    try {
        const typedArray = new Uint8Array(fileBuffer);
        let loadingTask = PdfJS.getDocument(typedArray);

        const pdfDocument = await loadingTask.promise;
        // Load all dose numbers
        const pdfPage = await pdfDocument.getPage(1);
        const imageData = await getImageDataFromPdf(pdfPage);
        const code : QRCode = await Decode.getQRFromImage(imageData);
        let rawData = code.data;
        const jws = getScannedJWS(rawData);

        let decoded = await decodeJWS(jws);
        
        console.log(decoded);

        const verified = verifyJWS(jws, decoded.iss);

        if (verified) {
            let receipts = Decode.decodedStringToReceipt(decoded.vc.credentialSubject.fhirBundle.entry);
            console.log(receipts);
            return Promise.resolve({receipts: receipts, rawData: rawData});

        } else {
            return Promise.reject(`Issuer ${decoded.iss} cannot be verified.`);
        }

    } catch (e) {
        Promise.reject(e);
    }

}
