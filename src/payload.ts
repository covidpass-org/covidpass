import {ValueSets} from "./value_sets";
import {Constants} from "./constants";

export interface PayloadBody {
    color: string;
    rawData: string;
    decodedData: Uint8Array;
}

export class Payload {
    certificateType: string = 'Vaccination';

    rawData: string;

    backgroundColor: string;
    labelColor: string;
    foregroundColor: string;
    img1x: Buffer;
    img2x: Buffer;
    dark: boolean;

    name: string;
    dose: string;
    dateOfVaccination: string;
    dateOfBirth: string;
    uvci: string;
    certificateIssuer: string;
    medicalProductKey: string;

    countryOfVaccination: string;
    vaccineName: string;
    manufacturer: string;

    constructor(body: PayloadBody, valueSets: ValueSets) {

        let colors = Constants.COLORS;

        if (!(body.color in colors)) {
            throw new Error('Invalid color');
        }

        const dark = body.color != 'white'


        // Get Vaccine, Name and Date of Birth information
        const vaccinationInformation = body.decodedData['-260']['1']['v'][0];
        const nameInformation = body.decodedData['-260']['1']['nam'];
        const dateOfBirthInformation = body.decodedData['-260']['1']['dob'];

        if (vaccinationInformation == undefined) {
            throw new Error('Failed to read vaccination information');
        }

        if (nameInformation == undefined) {
            throw new Error('Failed to read name');
        }

        if (dateOfBirthInformation == undefined) {
            throw new Error('Failed to read date of birth');
        }

        // Get Medical, country and manufacturer information
        const medialProductKey = vaccinationInformation['mp'];
        const countryCode = vaccinationInformation['co'];
        const manufacturerKey = vaccinationInformation['ma'];

        if (!(medialProductKey in valueSets.medicalProducts)) {
            throw new Error('Invalid medical product key');
        }
        if (!(countryCode in valueSets.countryCodes)) {
            throw new Error('Invalid country code')
        }
        if (!(manufacturerKey in valueSets.manufacturers)) {
            throw new Error('Invalid manufacturer')
        }


        // Set Values
        this.rawData = body.rawData;

        this.backgroundColor = dark ? colors[body.color] : colors.white
        this.labelColor = dark ? colors.white : colors.grey
        this.foregroundColor = dark ? colors.white : colors.black
        this.img1x = dark ? Constants.img1xWhite : Constants.img1xBlack
        this.img2x = dark ? Constants.img2xWhite : Constants.img2xBlack
        this.dark = dark;

        this.name = `${nameInformation['fn']}, ${nameInformation['gn']}`;
        this.dose = `${vaccinationInformation['dn']}/${vaccinationInformation['sd']}`;
        this.dateOfVaccination = vaccinationInformation['dt'];
        this.dateOfBirth = dateOfBirthInformation;
        this.uvci = vaccinationInformation['ci'];
        this.certificateIssuer = vaccinationInformation['is'];
        this.medicalProductKey = medialProductKey; // TODO is this needed?

        this.countryOfVaccination = valueSets.countryCodes[countryCode].display;
        this.vaccineName = valueSets.medicalProducts[medialProductKey].display;
        this.manufacturer = valueSets.manufacturers[manufacturerKey].display;
    }

}