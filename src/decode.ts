// adapted from https://github.com/fproulx/shc-covid19-decoder/blob/main/src/shc.js

const jose = require("node-jose");
const jsQR = require("jsqr");
const zlib = require("zlib");
import {Receipt} from "./payload";

export function getQRFromImage(imageData) {
  return jsQR(
    new Uint8ClampedArray(imageData.data.buffer),
    imageData.width,
    imageData.height
  );
}

export function getScannedJWS(shcString) {
  return shcString
    .match(/^shc:\/(.+)$/)[1]
    .match(/(..?)/g)
    .map((num) => String.fromCharCode(parseInt(num, 10) + 45))
    .join("");
}

//TODO: switch to https://github.com/smart-on-fhir/health-cards-dev-tools at some point

export function verifyJWS(jws) {
  return jose.JWK.asKey({
    kid: "some-kid",
    alg: "ES256",
    kty: "EC",
    crv: "P-256",
    use: "sig",
    x: "XSxuwW_VI_s6lAw6LAlL8N7REGzQd_zXeIVDHP_j_Do",       
    y: "88-aI4WAEl4YmUpew40a9vq_w5OcFvsuaKMxJRLRLL0",       
  }).then(function (key) {
    const { verify } = jose.JWS.createVerify(key);
    console.log("jws", jws);
    return verify(jws);
  });
}

export function decodeJWS(jws) : Promise<object[]> {
  const verifiedPayload = jws.split(".")[1];
  const decodedPayload = Buffer.from(verifiedPayload, "base64");

  return new Promise((resolve, reject) => {
    zlib.inflateRaw(decodedPayload, function (err, decompressedResult) {
      let scannedResult;
      if (typeof err === "object" && err) {
        console.log("Unable to decompress");
        reject();
      } else {
        console.log(decompressedResult);
        scannedResult = decompressedResult.toString("utf8");
        const entries =
          JSON.parse(scannedResult).vc.credentialSubject.fhirBundle.entry;

        resolve(entries);
      }
    });
  });
}

// vaccine codes based on Alex Dunae's findings
// https://gist.github.com/alexdunae/49cc0ea95001da3360ad6896fa5677ec
// http://mchp-appserv.cpe.umanitoba.ca/viewConcept.php?printer=Y&conceptID=1514


export function decodedStringToReceipt(shcResources: object[]) : Receipt[] {

    const codeToVaccineName = {
        '28581000087106': 'Pfizer-BioNTech',
        '28951000087107': 'Johnson & Johnson / Janssen',
        '28761000087108': 'AstraZeneca',
        '28571000087109': 'Moderna'
    }

    let name = '';
    let dateOfBirth;
    let receipts : Receipt[] = [];

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
            const performers = resource['performer'];
            for (let j = 0; j < performers.length; j++) {
                const performer = performers[j];
                organizationName = performer.actor.display;
            }
            vaccinationDate = resource.occurrenceDateTime;
            const receiptNumber = receipts.length + 1;
            const receipt = new Receipt(name, vaccinationDate, vaccineName, dateOfBirth, receiptNumber, organizationName);
            console.log(receipt);
            receipts.push(receipt);
        }
    }
    return receipts;

}