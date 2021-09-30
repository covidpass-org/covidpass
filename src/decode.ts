// adapted from https://github.com/fproulx/shc-covid19-decoder/blob/main/src/shc.js

const jsQR = require("jsqr");
const zlib = require("zlib");
import {Receipt, HashTable} from "./payload";

export function getQRFromImage(imageData) {
  return jsQR(
    new Uint8ClampedArray(imageData.data.buffer),
    imageData.width,
    imageData.height
  );
}

// vaccine codes based on Alex Dunae's findings
// https://gist.github.com/alexdunae/49cc0ea95001da3360ad6896fa5677ec
// http://mchp-appserv.cpe.umanitoba.ca/viewConcept.php?printer=Y&conceptID=1514

// .vc.credentialSubject.fhirBundle.entry
export function decodedStringToReceipt(decoded: object) : HashTable<Receipt> {

    const codeToVaccineName = {
        '28581000087106': 'Pfizer-BioNTech',
        '28951000087107': 'Johnson & Johnson / Janssen',
        '28761000087108': 'AstraZeneca',
        '28571000087109': 'Moderna'
    }

    console.log(decoded);
    const shcResources = decoded['vc'].credentialSubject.fhirBundle.entry;
    let issuer;
    if (decoded['iss'].includes('quebec.ca')) {
        issuer = 'qc';
    }
    if (decoded['iss'].includes('ontariohealth.ca')) {
        issuer = 'on';
    }
    if (decoded['iss'].includes('bchealth.ca')) {
        issuer = 'bc';
    }

    let name = '';
    let dateOfBirth;
    let receipts : HashTable<Receipt> = {};

    const numResources = shcResources.length;
    for (let i = 0; i < numResources; i++) {
        const resource = shcResources[i]['resource'];
        if (resource["resourceType"] == 'Patient') {
            if (name.length > 0)
                name += '\n';

            for (const nameField of resource.name) {
                for (const given of nameField.given) {
                    name += (given + ' ')
                }
                name += (nameField.family);
            }
            dateOfBirth = resource['birthDate'];
        }
       if (resource["resourceType"] == 'Immunization') { 
            let vaccineName : string;
            let organizationName : string;
            let vaccinationDate : string;

            for (const vaccineCodes of resource.vaccineCode.coding) {
                if (vaccineCodes.system.includes("snomed.info")) {
                    vaccineName = codeToVaccineName[vaccineCodes.code];
                    if (vaccineName == undefined)
                        vaccineName = 'Unknown - ' + vaccineCodes.code;
                }
            }

            let performers = resource['performer'];     // BC
            let receiptNumber;
            if (issuer == 'bc') {
                performers = resource['performer'];     
                receiptNumber = shcResources[i]['fullUrl'].split(':')[1];
                for (let j = 0; j < performers.length; j++) {
                   const performer = performers[j];
                    organizationName = performer.actor.display;
                }
            }
            if (issuer == 'qc') {
                organizationName = resource['location'].display;      // QC
                receiptNumber = resource['protocolApplied'].doseNumber;
            } 
            vaccinationDate = resource.occurrenceDateTime;

            const receipt = new Receipt(name, vaccinationDate, vaccineName, dateOfBirth, receiptNumber, organizationName);
            console.log(receipt);
            receipts[receiptNumber] = receipt;
        }
    }
    return receipts;

}