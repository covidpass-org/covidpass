// adapted from https://github.com/fproulx/shc-covid19-decoder/blob/main/src/shc.js

const jsQR = require("jsqr");
import {SHCReceipt, SHCVaccinationRecord} from "./payload";
import {getVerifiedIssuer} from "./issuers";
import {registerPass, generateSHCRegisterPayload} from "./passphoto-common";

export function getQRFromImage(imageData: ImageData) {
  return jsQR(
    new Uint8ClampedArray(imageData.data.buffer),
    imageData.width,
    imageData.height
  );
}

// vaccine codes based on Alex Dunae's findings
// https://gist.github.com/alexdunae/49cc0ea95001da3360ad6896fa5677ec
// http://mchp-appserv.cpe.umanitoba.ca/viewConcept.php?printer=Y&conceptID=1514

function getCvxVaccineCodeForResource(immunizationResource: any) : string {
    for (let curCoding of immunizationResource.vaccineCode.coding) {
        if (curCoding.system === 'http://hl7.org/fhir/sid/cvx') {
            return curCoding.code;
        }
    }

    console.error(`Cannot determine vaccine type - missing expected coding [http://hl7.org/fhir/sid/cvx] in SHC resource [${JSON.stringify(immunizationResource)}]`);
    return null;
}

function getOrganizationForResource(immunizationResource: any) : string {
    // By default, this is under performer actor display
    if (immunizationResource.performer) {
        // Assume there's only one performer (this is all that has been seen in data to date)
        return immunizationResource.performer[0].actor.display;
    }

    // Quebec does something different from most.
    if (immunizationResource.location) {
        return immunizationResource.location.display;
    }

    console.error(`Cannot determine organization name for SHC resource [${JSON.stringify(immunizationResource)}]`);
    return null;
}

export function decodedStringToReceipt(decoded: object) : SHCReceipt {

    const cvxCodeToVaccineName = {                   // https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
        '208': 'PFIZER',
        // The two records below are for childrens' doses of Pfizer, they have different CVX codes.
        '218': 'PFIZER', // 5-11 dose size
        '219': 'PFIZER', // 2-4 dose size
        '212': 'JANSSEN',
        '210': 'ASTRAZENECA',
        '207': 'MODERNA',
        '510': 'SINOPHARM-BIBP',
        '511': 'CORONAVAC-SINOVAC',
        // All of the vaccines below this line have not yet been approved by the WHO, but they are here because we have seen them all in our dataset
        '502': 'COVAXIN',
        '505': 'SPUTNIK V',
        '506': 'CONVIDECIA',
        '507': 'ZIFIVAX',
    }

    // Track whether the SHC code is validated - if it is not, we will record it so that we can
    // proactively track new SHC codes we haven't seen yet and support them quickly if appropriate
    let isValidatedSHC = true;

    // console.log(decoded);
    const verifiedIssuer = getVerifiedIssuer(decoded['iss']);
    
    if (!verifiedIssuer) {
        // Bail out now - this is not a recognized issuer
        console.error(`Issuer ${decoded['iss']} was not a recognized issuer! Cannot create card`);
        isValidatedSHC = false;
    }

    // Now verify that this SHC deals with a COVID immunization
    const cardData = decoded['vc'];
    const isCovidCard = cardData.type.includes('https://smarthealth.cards#covid19');
    if (!isCovidCard) {
        // Bail out now - this is not a COVID card
        console.error(`SHC QR code was not COVID-related (type [https://smarthealth.cards#covid19] not found)! Cannot create card`);
        isValidatedSHC = false;
    }

    // If we're here, we have an SHC QR code which was issued by a recognized issuer. Start mapping values now

    const shcResources = cardData.credentialSubject.fhirBundle.entry;
    let name = '';
    let dateOfBirth = '';
    const vaxRecords: SHCVaccinationRecord[] = [];

    const numResources = shcResources.length;
    for (let i = 0; i < numResources; i++) {
        const resource = shcResources[i]['resource'];

        switch(resource.resourceType) {
            case 'Patient':
                // Assume there is only one name on the card.
                const nameObj = resource.name[0];
                name = `${nameObj.given.join(' ')} ${nameObj.family}`;
                dateOfBirth = resource.birthDate;
                console.log('Detected Patient resource, added name and birthdate');

                break;
                
            case 'Immunization':
                // Start collecting data about this immunization record
                const vaccineCode = getCvxVaccineCodeForResource(resource);
                const vaccineName = cvxCodeToVaccineName[vaccineCode];
                const organizationName = getOrganizationForResource(resource);
                const vaccinationDate = resource.occurrenceDateTime;

                // Add this to our set of records
                vaxRecords.push(new SHCVaccinationRecord(vaccineName, vaccinationDate, organizationName));
                console.log(`Detected Immunization resource, added vaccination record (current count: ${vaxRecords.length})`);

                break;
                
            default:
                console.warn(`Unexpected SHC resource type ${resource.resourceType}! Ignoring...`);
                break;
        }
    }

    if (name.length === 0 || dateOfBirth.length === 0) {
        // Bail out now - we are missing basic info
        console.error(`No name or birthdate was found! Cannot create card`);
        isValidatedSHC = false;
    }

    const retReceipt = new SHCReceipt(name, dateOfBirth, verifiedIssuer.display, verifiedIssuer.iss, vaxRecords);
    console.log(`Creating receipt for region [${retReceipt.cardOrigin}] with vaccination records [${JSON.stringify(retReceipt.vaccinations)}]`);

    if (!isValidatedSHC) {
        // Send this SHC to our registration endpoint so we can proactively track and react to unexpected SHCs
        // (e.g. for jurisdictions we aren't aware of yet)
        const registerPayload = generateSHCRegisterPayload(retReceipt);
        registerPass(registerPayload);

        // Now bail out
        return null;
    }

    return retReceipt;
}