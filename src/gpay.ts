import {Constants} from "./constants";
import {Payload, PayloadBody, PassDictionary} from "./payload";
import {QrCode, PassPhotoCommon, getConfigData} from './passphoto-common';

export class GPayData {
    passTypeIdentifier: string = Constants.PASS_IDENTIFIER;
    teamIdentifier: string = Constants.TEAM_IDENTIFIER;
    sharingProhibited: boolean = true;
    voided: boolean = false;
    formatVersion: number = 1;
    logoText: string = Constants.NAME;
    organizationName: string = Constants.NAME;
    description: string = Constants.NAME;
    labelColor: string;
    foregroundColor: string;
    backgroundColor: string;
    serialNumber: string;
    barcodes: Array<QrCode>;
    barcode: QrCode;
    generic: PassDictionary;
    expirationDate: string;

    static async generatePass(payloadBody: PayloadBody, numDose: number): Promise<string> {

        // Create Payload
        try {
            
            console.log('> GPayData::generatePass');

            const results = await PassPhotoCommon.preparePayload(payloadBody, true, numDose);
            const payload = results.payload;
            // Create pass data

            const configResponse = await getConfigData();
            const configJson = await configResponse.json();
            const gpayBaseUrl = configJson.gpayBaseUrl;

            const result = await fetch(gpayBaseUrl, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payloadBody: payloadBody,
                    id: payload.serialNumber,
                    qrCodeMessage: results.qrCode.message
                }),
            });
            const details = await result.json();

            // Step 2: Set JWT based on API response.
            const jwt = details.token;
            
            console.log(jwt);

            return Promise.resolve(jwt);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private constructor(payload: Payload, qrCode: QrCode) {
        this.labelColor = payload.labelColor;
        this.foregroundColor = payload.foregroundColor;
        this.backgroundColor = payload.backgroundColor;
        this.serialNumber = payload.serialNumber; // Generate random UUID v4
        this.barcodes = [qrCode];
        this.barcode = qrCode;
        this.generic = payload.generic;
        this.sharingProhibited = true;
        this.expirationDate = payload.expirationDate;
    }
}
