import {ValueSets} from "./value_sets";
import {Constants} from "./constants";

enum CertificateType {
    Vaccine = 'Vaccine',
    Test = 'Test',
    Recovery = 'Recovery',
}

enum TextAlignment {
    right = 'PKTextAlignmentRight',
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
    color: string;
    rawData: string;
    decodedData: Uint8Array;
}

export class Payload {
    certificateType: CertificateType;

    rawData: string;

    backgroundColor: string;
    labelColor: string;
    foregroundColor: string;
    img1x: Buffer;
    img2x: Buffer;
    dark: boolean;

    generic: PassDictionary;

    constructor(body: PayloadBody, valueSets: ValueSets) {

        let colors = Constants.COLORS;

        if (!(body.color in colors)) {
            throw new Error('invalidColor');
        }

        const dark = body.color != 'white'

        const healthCertificate = body.decodedData['-260'];
        const covidCertificate = healthCertificate['1']; // Version number subject to change

        if (covidCertificate == undefined) {
            throw new Error('certificateData');
        }

        // Get name and date of birth information
        const nameInformation = covidCertificate['nam'];
        const dateOfBirth = covidCertificate['dob'];

        if (nameInformation == undefined) {
            throw new Error('nameMissing');
        }
        if (dateOfBirth == undefined) {
            throw new Error('dobMissing');
        }

        const firstName = nameInformation['gn'];
        const lastName = nameInformation['fn'];
        
        const transliteratedFirstName = nameInformation['gnt'].replaceAll('<', ' ');
        const transliteratedLastName = nameInformation['fnt'].replaceAll('<', ' ');

        // Check if name contains non-latin characters
        const nameRegex = new RegExp('^[\\p{Script=Latin}\\p{P}\\p{M}\\p{Z}]+$', 'u');
        
        let name: string;

        if (nameRegex.test(firstName) && nameRegex.test(lastName)) {
            name = `${firstName} ${lastName}`;
        } else {
            name = `${transliteratedFirstName} ${transliteratedLastName}`;
        }

        let properties: object;

        // Set certificate type and properties
        if (covidCertificate['v'] !== undefined) {
            this.certificateType = CertificateType.Vaccine;
            properties = covidCertificate['v'][0];
        }
        if (covidCertificate['t'] !== undefined) {
            this.certificateType = CertificateType.Test;
            properties = covidCertificate['t'][0];
        }
        if (covidCertificate['r'] !== undefined) {
            this.certificateType = CertificateType.Recovery;
            properties = covidCertificate['r'][0];
        }
        if (this.certificateType == undefined) {
            throw new Error('certificateType')
        }

        // Get country, identifier and issuer
        const countryCode = properties['co'];
        const uvci = properties['ci'];
        const certificateIssuer = properties['is'];

        if (!(countryCode in valueSets.countryCodes)) {
            throw new Error('invalidCountryCode');
        }

        const country = valueSets.countryCodes[countryCode].display;

        const generic: PassDictionary = {
            headerFields: [
                {
                    key: "type",
                    label: "EU Digital COVID",
                    value: this.certificateType + " Certificate"
                }
            ],
            primaryFields: [
                {
                    key: "name",
                    label: "Name",
                    value: name
                }
            ],
            secondaryFields: [],
            auxiliaryFields: [],
            backFields: [
                {
                    key: "uvci",
                    label: "Unique Certificate Identifier (UVCI)",
                    value: uvci
                },
                {
                    key: "issuer",
                    label: "Certificate Issuer",
                    value: certificateIssuer
                }
            ]
        }

        // Set Values
        this.rawData = body.rawData;

        this.backgroundColor = dark ? colors[body.color] : colors.white
        this.labelColor = dark ? colors.white : colors.grey
        this.foregroundColor = dark ? colors.white : colors.black
        this.img1x = dark ? Constants.img1xWhite : Constants.img1xBlack
        this.img2x = dark ? Constants.img2xWhite : Constants.img2xBlack
        this.dark = dark;

        this.generic = Payload.fillPassData(this.certificateType, generic, properties, valueSets, country, dateOfBirth);
    }

    static fillPassData(type: CertificateType, data: PassDictionary, properties: Object, valueSets: ValueSets, country: string, dateOfBirth: string): PassDictionary {
        switch (type) {
            case CertificateType.Vaccine:
                const dose = `${properties['dn']}/${properties['sd']}`;
                const dateOfVaccination = properties['dt'];
                const medialProductKey = properties['mp'];
                const manufacturerKey = properties['ma'];

                if (!(medialProductKey in valueSets.medicalProducts)) {
                    throw new Error('invalidMedicalProduct');
                }
                if (!(manufacturerKey in valueSets.manufacturers)) {
                    throw new Error('invalidManufacturer')
                }

                const vaccineName = valueSets.medicalProducts[medialProductKey].display.replace(/\s*\([^)]*\)\s*/g, "");
                const manufacturer = valueSets.manufacturers[manufacturerKey].display;

                data.secondaryFields.push(...[
                    {
                        key: "dose",
                        label: "Dose",
                        value: dose
                    }, 
                    {
                        key: "dov",
                        label: "Date of Vaccination",
                        value: dateOfVaccination,
                        textAlignment: TextAlignment.right
                    }
                ]);
                data.auxiliaryFields.push(...[
                    {
                        key: "vaccine",
                        label: "Vaccine",
                        value: vaccineName
                    },
                    {
                        key: "dob",
                        label: "Date of Birth",
                        value: dateOfBirth,
                        textAlignment: TextAlignment.right
                    }
                ]);
                data.backFields.push(...[
                    {
                        key: "cov",
                        label: "Country of Vaccination",
                        value: country
                    },
                    {
                        key: "manufacturer",
                        label: "Manufacturer",
                        value: manufacturer
                    },
                    {
                        key: "disclaimer",
                        label: "Disclaimer",
                        value: "This certificate is not a travel document. It is only valid in combination with the ID card of the certificate holder and may expire one year + 14 days after the last dose. The validity of this certificate was not checked by CovidPass."
                    }
                ]);
                break;
            case CertificateType.Test:
                const testTypeKey = properties['tt'];
                const testDateTimeString = properties['sc'];
                const testResultKey = properties['tr'];
                const testingCentre = properties['tc'];
                
                if (!(testResultKey in valueSets.testResults)) {
                    throw new Error('invalidTestResult');
                }
                if (!(testTypeKey in valueSets.testTypes)) {
                    throw new Error('invalidTestType')
                }

                const testResult = valueSets.testResults[testResultKey].display;
                const testType = valueSets.testTypes[testTypeKey].display;

                const testTime = testDateTimeString.replace(/.*T/, '').replace('Z', ' ') + 'UTC';
                const testDate = testDateTimeString.replace(/T.*/,'');

                data.secondaryFields.push(...[
                    {
                        key: "result",
                        label: "Test Result",
                        value: testResult
                    },
                    {
                        key: "dot",
                        label: "Date of Test",
                        value: testDate,
                        textAlignment: TextAlignment.right
                    }
                ]);
                data.auxiliaryFields.push(...[
                    {
                        key: "time",
                        label: "Time of Test",
                        value: testTime
                    },
                    {
                        key: "dob",
                        label: "Date of Birth",
                        value: dateOfBirth,
                        textAlignment: TextAlignment.right
                    },
                ]);
                data.backFields.push({
                    key: "cot",
                    label: "Country of Test",
                    value: country
                });
                if (testingCentre !== undefined)
                    data.backFields.push({
                        key: "centre",
                        label: "Testing Centre",
                        value: testingCentre
                    });
                data.backFields.push(...[
                    {
                        key: "test",
                        label: "Test Type",
                        value: testType
                    },
                    {
                        key: "disclaimer",
                        label: "Disclaimer",
                        value: "This certificate is not a travel document. It is only valid in combination with the ID card of the certificate holder and may expire 24h after the test. The validity of this certificate was not checked by CovidPass."
                    }
                ]);
                break;
            case CertificateType.Recovery:
                const firstPositiveTestDate = properties['fr'];
                const validFrom = properties['df'];
                const validUntil = properties['du'];

                data.secondaryFields.push(...[
                    {
                        key: "until",
                        label: "Valid Until",
                        value: validUntil,
                    },
                    {
                        key: "dot",
                        label: "Date of positive Test",
                        value: firstPositiveTestDate,
                        textAlignment: TextAlignment.right
                    }
                ]);
                data.auxiliaryFields.push(...[
                    {
                        key: "from",
                        label: "Valid From",
                        value: validFrom,
                    },
                    {
                        key: "dob",
                        label: "Date of Birth",
                        value: dateOfBirth,
                        textAlignment: TextAlignment.right
                    }
                ]);
                data.backFields.push(...[
                    {
                        key: "cot",
                        label: "Country of Test",
                        value: country
                    },
                    {
                        key: "disclaimer",
                        label: "Disclaimer",
                        value: "This certificate is not a travel document. It is only valid in combination with the ID card of the certificate holder. The validity of this certificate was not checked by CovidPass."
                    }
                ]);
                break;
            default:
                throw new Error('certificateType');
        }
        
        return data;
    }
}