import {Constants} from "./constants";
import {COLORS} from "./colors";
import link from "next/link";

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
    constructor(public name: string, public dateOfBirth: string, public cardOrigin: string, public issuer: string, public vaccinations: SHCVaccinationRecord[]) {};
}

export class SHCVaccinationRecord {
    constructor(public vaccineName: string, public vaccinationDate: string, public organization: string) {};
}

interface Field {
    key: string;
    label: string;
    value?: string;
    textAlignment?: string;
    attributedValue?: string;
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
    dataUrl?: string;
}

export class Payload {

    receipts: HashTable<Receipt>;
    shcReceipt: SHCReceipt;
    rawData: string;
    dataUrl?: string;
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
        this.dataUrl = body.dataUrl;
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

            let displayLocallyStoredPDFUrl = window.location.href + "displayLocallyStoredPDF.html";  
            console.log(displayLocallyStoredPDFUrl)
            const attributedValue = `<a href="${displayLocallyStoredPDFUrl}">View</a>`;
            console.log('*** attributedValue ***');
            console.log(attributedValue);

            this.generic.backFields.push({
                key: "original",
                label: "Original receipt (saved locally in Safari)",
                attributedValue: attributedValue
            });
        }
    }
}

function processSHCReceipt(receipt: SHCReceipt, generic: PassDictionary) {

    console.log(`processing receipt for origin ${receipt.cardOrigin}`);

    if (generic.primaryFields.length == 0) {
        const lastReceiptIndex = receipt.vaccinations.length - 1
        const mostRecentReceipt = receipt.vaccinations[lastReceiptIndex];
        const vaccineName = mostRecentReceipt.vaccineName.substring(0,1).toUpperCase() + mostRecentReceipt.vaccineName.substring(1).toLowerCase();
        const value = `#${lastReceiptIndex + 1} - ${vaccineName}`;
        generic.primaryFields.push(
            {
                key: "name",
                label: `${receipt.name} (Last vaccinated: ${mostRecentReceipt.vaccinationDate})`,
                value: value
            }
        );
    }

    generic.secondaryFields.push({
        key: "details",
        label: "For details or to remove this pass",
        value: "Touch the circle with ... on the top right"
    });

    generic.backFields.push({
        key: "date-of-birth",
        label: "Date of Birth",
        value: receipt.dateOfBirth    
    });

    for (let i = 0; i < receipt.vaccinations.length; i++) {

        generic.backFields.push(
            {
                key: 'vaccine' + i,
                label: receipt.vaccinations[i].vaccineName,
                value: receipt.vaccinations[i].vaccinationDate
            }
        )

    }
}
