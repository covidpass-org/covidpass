'use strict';

const constants = require('./constants')
const utils = require('./utils')

const { Payload } = require('./payload')
const { toBuffer } = require('do-not-zip')
const crypto = require('crypto')

exports.createPass = async function(data) {
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
    const passHash = getBufferHash(Buffer.from(JSON.stringify(pass)))

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

    // Load API_BASE_URL form nextjs backend
    const configResponse = await fetch('/api/config')
    const apiBaseUrl = (await configResponse.json()).apiBaseUrl

    const response = await fetch(`${apiBaseUrl}/sign`, {
        method: 'POST',
        headers: {
          'Accept': 'application/octet-stream',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          PassJsonHash: passHash,
        })
    })

    if (response.status !== 200) {
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

  const qrCode = {
    message: payload.raw,
    format: "PKBarcodeFormatQR",
    messageEncoding: "utf-8"
  }

  const pass = {
    passTypeIdentifier: constants.PASS_IDENTIFIER,
    teamIdentifier: constants.TEAM_IDENTIFIER,
    sharingProhibited: true,
    voided: false,
    formatVersion: 1,
    logoText: constants.NAME,
    organizationName: constants.NAME,
    description: constants.NAME,
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

  return await signPassWithRemote(pass, payload)
}
