import {Constants} from "./constants";
import {COLORS} from "./colors";
import { TEXT_ALIGN } from "html2canvas/dist/types/css/property-descriptors/text-align";

export class Receipt {
  constructor(public name: string, public vaccinationDate: string, public vaccineName: string, public dateOfBirth: string, public numDoses: number, public organization: string) {};
}
export interface HashTable<T> {
    [key: string]: T;
}

enum TextAlignment {
    right = 'PKTextAlignmentRight',
    center = 'PKTextAlignmentCenter'
}

interface Field {
    key: string;
    label: string;
    value: string;
    textAlignment?: string;
}

export interface PassDictionary {
    headerFields: Array<Field>;
    primaryFields: Array<Field>;
    secondaryFields: Array<Field>;
    auxiliaryFields: Array<Field>;
    backFields: Array<Field>;
}

export interface PayloadBody {
    // color: COLORS;
    rawData: string;
    receipts: HashTable<Receipt>;
}

export class Payload {

    receipts: HashTable<Receipt>;
    rawData: string;
    backgroundColor: string;
    labelColor: string;
    foregroundColor: string;
    img1x: Buffer;
    img2x: Buffer;
    serialNumber: string;
    generic: PassDictionary;
    expirationDate: string;

    constructor(body: PayloadBody, numDose: number) {

        let generic: PassDictionary = {
            headerFields: [],
            primaryFields: [],
            secondaryFields: [],
            auxiliaryFields: [],
            backFields: []
        }
        this.backgroundColor = COLORS.YELLOW;
        this.labelColor = COLORS.WHITE
        this.foregroundColor = COLORS.WHITE
        this.img1x = Constants.img1xWhite
        this.img2x = Constants.img2xWhite

        let fullyVaccinated = false;
        var keys = Object.keys(body.receipts).reverse();

        if (body.rawData.length > 0) {                      // SHC contains multiple receipts
            for (let k of keys) {
                fullyVaccinated = processReceipt(body.receipts[k], generic);
                if (fullyVaccinated) {
                    this.backgroundColor = COLORS.GREEN;
                }            
            }
        } else {
            fullyVaccinated = processReceipt(body.receipts[numDose], generic);
            if (fullyVaccinated) {
               this.backgroundColor = COLORS.GREEN;
            }
        }

        this.receipts = body.receipts;
        this.rawData = body.rawData;
        this.generic = generic;
        if (body.rawData.length == 0) {          // Ontario special handling
            this.expirationDate = '2021-10-22T23:59:59-04:00';
            generic.auxiliaryFields.push({
                    key: "expiry",
                    label: "QR code expiry",
                    value: '2021-10-22'
            })
        }
    }
}

function processReceipt(receipt: Receipt, generic: PassDictionary) : boolean {

        console.log(`processing receipt #${receipt.numDoses}`);

        const name = receipt['name'];
        const dateOfBirth = receipt.dateOfBirth;
        const numDoses = receipt.numDoses;
        const vaccineName = receipt.vaccineName.toLocaleUpperCase();
        let vaccineNameProper = vaccineName.charAt(0) + vaccineName.substr(1).toLowerCase();

        if (vaccineName.includes('PFIZER'))
            vaccineNameProper = 'Pfizer (Comirnaty)'

        if (vaccineName.includes('MODERNA'))
            vaccineNameProper = 'Moderna (SpikeVax)'

        if (vaccineName.includes('ASTRAZENECA') || vaccineName.includes('COVISHIELD'))
            vaccineNameProper = 'AstraZeneca (Vaxzevria)'  

        let doseVaccine = "#" + String(receipt.numDoses) + ": " + vaccineNameProper;
        let fullyVaccinated = false;

        if (receipt.numDoses > 1 || 
            vaccineName.toLowerCase().includes('janssen') || 
            vaccineName.toLowerCase().includes('johnson') || 
            vaccineName.toLowerCase().includes('j&j')) {
            fullyVaccinated = true;
        }

        if (generic.primaryFields.length == 0) {
            generic.primaryFields.push(
                {
                    key: "vaccine",
                    label: "Vaccine",
                    value: doseVaccine
                }
            )
        }

        let fieldToPush = generic.secondaryFields;
        if (fieldToPush.length > 0) {
            fieldToPush = generic.backFields;
            generic.headerFields.push({
                key: "extra",
                label: "More",
                value: "(i)",
                "textAlignment" : "PKTextAlignmentCenter"
            });
            generic.backFields.push({
                key: "vaccine" + numDoses,
                label: `Vaccine (Dose ${numDoses})`,
                value: receipt.vaccineName
            })
        }

        fieldToPush.push(
            {
                    key: "issuer",
                    label: "Authorized Organization",
                    value: receipt.organization
            },
            {
                key: "dov",
                label: "Vacc. Date",
                value: receipt.vaccinationDate,
            }
        );

        if (generic.auxiliaryFields.length == 0) {
            generic.auxiliaryFields.push(
            {
                key: "name",
                label: "Name",
                value: name
            },
                           {
                key: "dob",
                label: "Date of Birth",
                value: dateOfBirth
            });
        }

        return fullyVaccinated;
    }
