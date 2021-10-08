const issuers = [
  {
    id: "ca.qc",
    iss: "https://covid19.quebec.ca/PreuveVaccinaleApi/issuer",
    keys: [
      { kid: "qFdl0tDZK9JAWP6g9_cAv57c3KWxMKwvxCrRVSzcxvM",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "XSxuwW_VI_s6lAw6LAlL8N7REGzQd_zXeIVDHP_j_Do",
        y: "88-aI4WAEl4YmUpew40a9vq_w5OcFvsuaKMxJRLRLL0" },
    ]
  },
  {
    id: "us.ca",
    iss: "https://myvaccinerecord.cdph.ca.gov/creds",
    keys: [
      { kid: "7JvktUpf1_9NPwdM-70FJT3YdyTiSe2IvmVxxgDSRb0",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "3dQz5ZlbazChP3U7bdqShfF0fvSXLXD9WMa1kqqH6i4",
        y: "FV4AsWjc7ZmfhSiHsw2gjnDMKNLwNqi2jMLmJpiKWtE" },
    ]
  },
  {
    id: "us.ny",
    iss: "https://ekeys.ny.gov/epass/doh/dvc/2021",
    keys: [
      { kid: "9ENs36Gsu-GmkWIyIH9XCozU9BFhLeaXvwrT3B97Wok",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "--M0AedrNg31sHZGAs6qg7WU9LwnDCMWmd6KjiKfrZU",
        y: "rSf2dKerJFW3-oUNcvyrI2x39hV2EbazORZvh44ukjg" },
    ]
  },
  {
    id: "us.la",
    iss: "https://healthcardcert.lawallet.com",
    keys: [
      { kid: "UOvXbgzZj4zL-lt1uJVS_98NHQrQz48FTdqQyNEdaNE",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "n1PxhSk7DQj8ZBK3VIfwhlcN__QG357gbiTfZYt1gn8",
        y: "ZDGv5JYe4mCm75HCsHG8UkIyffr1wcZMwJjH8v5cGCc" },
    ]
  },
  {
    id: "ca.yt",
    iss: "https://pvc.service.yukon.ca/issuer",
    keys: [
      { kid: "UnHGY-iyCIr__dzyqcxUiApMwU9lfeXnzT2i5Eo7TvE",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "wCeT9rdLYTpOK52OK0-oRbwDxbljJdNiDuxPsPt_1go",
        y: "IgFPi1OrHtJWJGwPMvlueeHmULUKEpScgpQtoHNjX-Q" },
    ]
  },
  {
    id: "ca.bc",
    iss: "https://smarthealthcard.phsa.ca/v1/issuer",
    keys: [
      { kid: "XCqxdhhS7SWlPqihaUXovM_FjU65WeoBFGc_ppent0Q",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "xscSbZemoTx1qFzFo-j9VSnvAXdv9K-3DchzJvNnwrY",
        y: "jA5uS5bz8R2nxf_TU-0ZmXq6CKWZhAG1Y4icAx8a9CA" },
    ]
  },
  {
    id: "ca.sk",
    iss: "https://skphr.prd.telushealthspace.com",
    keys: [
      { kid: "xOqUO82bEz8APn_5wohZZvSK4Ui6pqWdSAv5BEhkes0",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "Hk4ktlNfoIIo7jp5I8cefp54Ils3TsKvKXw_E9CGIPE",
        y: "7hVieFGuHJeaNRCxVgKeVpoxDJevytgoCxqVZ6cfcdk" },
    ]
  },
  {
	id: "ca.ab",
	iss: "https://covidrecords.alberta.ca/smarthealth/issuer",
	keys: [
      { kid: "JoO-sJHpheZboXdsUK4NtfulfvpiN1GlTdNnXN3XAnM",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "GsriV0gunQpl2X9KgrDZ4EDCtIdfOmdzhdlosWrMqKk",
        y: "S99mZMCcJRsn662RaAmk_elvGiUs8IvSA7qBh04kaw0" },
    ]
  }
];

module.exports = {
  issuers,
};
