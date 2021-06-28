'use strict';

const consts = require('./constants')
const utils = require('./utils')
const img = require('./img')

const { Payload } = require('./payload')
const { toBuffer } = require('do-not-zip')
const crypto = require('crypto')

exports.createPass = async function(data) {
  async function getJSONfromURL(url) {
    return await (await fetch(url)).json()
  }
  
  function getBufferHash(buffer) {
    // creating hash
    const sha = crypto.createHash('sha1');
    sha.update(buffer);
    return sha.digest('hex');
  }
  
  async function signPassWithRemote(pass, payload) {
    // From pass-js
    // https://github.com/walletpass/pass-js/blob/2b6475749582ca3ea742a91466303cb0eb01a13a/src/pass.ts
    
    // Creating new Zip file
    const zip = []
  
    // Adding required files
    // Create pass.json
    zip.push({ path: 'pass.json', data: Buffer.from(JSON.stringify(pass)) })
  
    zip.push({ path: 'icon.png', data: payload.img1x })
    zip.push({ path: 'icon@2x.png', data: payload.img2x })
    zip.push({ path: 'logo.png', data: payload.img1x })
    zip.push({ path: 'logo@2x.png', data: payload.img2x })
  
    // adding manifest
    // Construct manifest here
    const manifestJson = JSON.stringify(
      zip.reduce(
        (res, { path, data }) => {
          res[path] = getBufferHash(data);
          return res;
        },
        {},
      ),
    );
    zip.push({ path: 'manifest.json', data: manifestJson });
    
    const response = await fetch(consts.API_BASE_URL + 'sign_manifest', {
        method: 'POST',
        headers: {
          'Accept': 'application/octet-stream',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          manifest: manifestJson
        })
    })
    
    if (response.status != 200) {
      return undefined
    }
    
    const manifestSignature = await response.arrayBuffer()
    
    zip.push({ path: 'signature', data: Buffer.from(manifestSignature) });
  
    // finished!
    return toBuffer(zip);
  }
  
  let valueSets

  try {
    valueSets = await utils.getValueSets()
  } catch {
    return undefined
  }

  let payload

  try {
    payload = new Payload(data, valueSets)
  } catch (e) {
    return undefined
  }
  
  let signingIdentity = await getJSONfromURL(consts.API_BASE_URL + 'signing_identity')

  const qrCode = {
    message: payload.raw,
    format: "PKBarcodeFormatQR",
    messageEncoding: "utf-8"
  }

  const pass = {
    passTypeIdentifier: signingIdentity['pass_identifier'],
    teamIdentifier: signingIdentity['pass_team_id'],
    sharingProhibited: true,
    voided: false,
    formatVersion: 1,
    logoText: consts.NAME,
    organizationName: consts.NAME,
    description: consts.NAME,
    labelColor: payload.labelColor,
    foregroundColor: payload.foregroundColor,
    backgroundColor: payload.backgroundColor,
    serialNumber: payload.uvci,
    barcodes: [qrCode],
    barcode: qrCode,
    generic: {
      headerFields: [
        { 
          key: "type", 
          label: "Certificate Type", 
          value: payload.certificateType 
        }
      ],
      primaryFields: [
        { 
          key: "name", 
          label: "Name", 
          value: payload.name 
        }
      ],
      secondaryFields: [
        { 
          key: "dose", 
          label: "Dose", 
          value: payload.dose 
        },
        { 
          key: "dov", 
          label: "Date of Vaccination", 
          value: payload.dateOfVaccination, 
          textAlignment: "PKTextAlignmentRight"
        }
      ],
      auxiliaryFields: [
        { 
          key: "vaccine", 
          label: "Vaccine", 
          value: payload.vaccineName 
        },
        { 
          key: "dob", 
          label: "Date of Birth", value: 
          payload.dateOfBirth, 
          textAlignment: "PKTextAlignmentRight"
        }
      ],
      backFields: [
        { 
          key: "uvci", 
          label: "Unique Certificate Identifier (UVCI)", 
          value: payload.uvci
        },
        { 
          key: "issuer", 
          label: "Certificate Issuer", 
          value: payload.certificateIssuer 
        },
        { 
          key: "country", 
          label: "Country of Vaccination", 
          value: payload.countryOfVaccination
        },
        { 
          key: "manufacturer", 
          label: "Manufacturer", 
          value: payload.manufacturer 
        },
        { 
          key: "disclaimer", 
          label: "Disclaimer", 
          value: "This certificate is only valid in combination with the ID card of the certificate holder and expires one year + 14 days after the last dose. The validity of this certificate was not checked by CovidPass."
        }
      ]
    }
  };

  let buf = await signPassWithRemote(pass, payload)
  return buf
}
