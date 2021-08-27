import {Constants} from "./constants";
import {COLORS} from "./colors";

export class Receipt {
  constructor(public name: string, public vaccinationDate: string, public vaccineName: string, public dateOfBirth: string, public numDoses: number, public organization: string) {};
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
    receipt: Receipt;
}

export class Payload {

    receipt: Receipt;
    rawData: string;
    backgroundColor: string;
    labelColor: string;
    foregroundColor: string;
    img1x: Buffer;
    img2x: Buffer;
    serialNumber: string;
    generic: PassDictionary;

    constructor(body: PayloadBody) {

        // Get name and date of birth information
        const name = body.receipt.name;
        const dateOfBirth = body.receipt.dateOfBirth;
        const vaccineName = body.receipt.vaccineName;
        const vaccineNameProper = vaccineName.charAt(0) + vaccineName.substr(1).toLowerCase();
        const doseVaccine = "Dose " + String(body.receipt.numDoses) + ": " + vaccineNameProper;
        if (name == undefined) {
            throw new Error('nameMissing');
        }
        if (dateOfBirth == undefined) {
            throw new Error('dobMissing');
        }

        const generic: PassDictionary = {
            headerFields: [
            ],
            primaryFields: [
                {
                key: "vaccine",
                label: "Vaccine",
                value: doseVaccine,
                }

            ],
            secondaryFields: [
                                {
                    key: "issuer",
                    label: "Authorized Organization",
                    value: body.receipt.organization
                },

            {
                key: "dov",
                label: "Date",
                value: body.receipt.vaccinationDate,
                // textAlignment: TextAlignment.right
            }
            ],
            auxiliaryFields: [   
               {
                key: "name",
                label: "Name",
                value: name
            }
            ],
            backFields: [

            // {
            //     key: "dob",
            //     label: "Date of Birth",
            //     value: body.receipt.dateOfBirth,
            //     textAlignment: TextAlignment.right
            // }

            ]
        }

        // Set Values
        this.receipt = body.receipt;
        this.rawData = body.rawData;

        if (body.receipt.numDoses > 1) {
            this.backgroundColor = COLORS.GREEN;
        } else {
            this.backgroundColor = COLORS.YELLOW;
        }

        this.labelColor = COLORS.BLACK
        this.foregroundColor = COLORS.BLACK
        this.img1x = Constants.img1xBlack
        this.img2x = Constants.img2xBlack
        this.generic = generic;

    }



}