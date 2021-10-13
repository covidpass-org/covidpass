import {Constants} from "./constants";
import {COLORS} from "./colors";

export class Receipt {
    constructor(public name: string, public vaccinationDate: string, public vaccineName: string, public dateOfBirth: string, public numDoses: number, public organization: string) {};
}

export interface HashTable<T> {
    [key: string]: T;
}

// QR CODE NEW FORMAT:
// * Origin jurisdiction
// * Person's name
// * NOTHING ELSE ON THE CARD TO ENCOURAGE SCANNING IT TO GET DATA (this is what QC does, and what BC mostly does; other jurisdictions add more data, but that encourages bad behaviour)

export class SHCReceipt {
    constructor(public name: string, public dateOfBirth: string, public cardOrigin: string, public vaccinations: SHCVaccinationRecord[]) {};
}

export class SHCVaccinationRecord {
    constructor(public vaccineName: string, public vaccinationDate: string, public organization: string) {};
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
    rawData: string;
    receipts: HashTable<Receipt>;
    shcReceipt: SHCReceipt;
}

export class Payload {

    receipts: HashTable<Receipt>;
    shcReceipt: SHCReceipt;
    rawData: string;
    backgroundColor: string;
    labelColor: string;
    foregroundColor: string;
    img1x: Buffer;
    img2x: Buffer;
    serialNumber: string;
    generic: PassDictionary;
    expirationDate: string;

    constructor(body: PayloadBody, numDose: number = 0) {

        this.receipts = body.receipts;
        this.shcReceipt = body.shcReceipt;
        this.rawData = body.rawData;
        this.generic = {
            headerFields: [],
            primaryFields: [],
            secondaryFields: [],
            auxiliaryFields: [],
            backFields: []
        }

        if (body.rawData.length > 0) {
            processSHCReceipt(body.shcReceipt, this.generic);
            this.backgroundColor = COLORS.WHITE;
            this.labelColor = COLORS.BLACK;
            this.foregroundColor = COLORS.BLACK;
            this.img1x = Constants.img1xBlack;
            this.img2x = Constants.img2xBlack;
        } else {
            const fullyVaccinated = processReceipt(body.receipts[numDose], this.generic);
            if (fullyVaccinated) {
               this.backgroundColor = COLORS.GREEN;
            } else {
                this.backgroundColor = COLORS.YELLOW;
            }
            this.labelColor = COLORS.WHITE;
            this.foregroundColor = COLORS.WHITE;
            this.img1x = Constants.img1xWhite;
            this.img2x = Constants.img2xWhite;

            // These are the non-SHC ON receipts, which expire Oct 22nd
            this.expirationDate = '2021-10-22T23:59:59-04:00';
            this.generic.auxiliaryFields.push({
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

function processSHCReceipt(receipt: SHCReceipt, generic: PassDictionary) {

    console.log(`processing receipt for origin ${receipt.cardOrigin}`);

    if (generic.primaryFields.length == 0) {
        generic.primaryFields.push(
            {
                key: "name",
                label: "Name",
                value: receipt.name
            }
        )
    }
}
