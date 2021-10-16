export const issuers = [
  {
    id: "ca.qc",
    display: "Québec",
    iss: "https://covid19.quebec.ca/PreuveVaccinaleApi/issuer",
    keys: [
      { kid: "qFdl0tDZK9JAWP6g9_cAv57c3KWxMKwvxCrRVSzcxvM",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "XSxuwW_VI_s6lAw6LAlL8N7REGzQd_zXeIVDHP_j_Do",
        y: "88-aI4WAEl4YmUpew40a9vq_w5OcFvsuaKMxJRLRLL0" },
      { kid: "2XlWk1UQMqavMtLt-aX35q_q9snFtGgdjH4-Y1gfH1M",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "XSxuwW_VI_s6lAw6LAlL8N7REGzQd_zXeIVDHP_j_Do",
        y: "88-aI4WAEl4YmUpew40a9vq_w5OcFvsuaKMxJRLRLL0" },
    ]
  },
  {
    id: "us.ca",
    display: "California, USA",
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
    display: "New York, USA",
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
    display: "Louisiana, USA",
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
    display: "Yukon",
    iss: "https://pvc.service.yukon.ca/issuer",
    keys: [
      { kid: "UnHGY-iyCIr__dzyqcxUiApMwU9lfeXnzT2i5Eo7TvE",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x5c: [
          "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"
        ],
        x: "wCeT9rdLYTpOK52OK0-oRbwDxbljJdNiDuxPsPt_1go",
        y: "IgFPi1OrHtJWJGwPMvlueeHmULUKEpScgpQtoHNjX-Q" },
    ]
  },
  {
    id: "ca.bc",
    display: "British Columbia",
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
    display: "Saskatchewan",
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
    display: "Alberta",
	iss: "https://covidrecords.alberta.ca/smarthealth/issuer",
	keys: [
      { kid: "JoO-sJHpheZboXdsUK4NtfulfvpiN1GlTdNnXN3XAnM",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "GsriV0gunQpl2X9KgrDZ4EDCtIdfOmdzhdlosWrMqKk",
        y: "S99mZMCcJRsn662RaAmk_elvGiUs8IvSA7qBh04kaw0" },
    ]
  },
  {
    id: "ca.ns",
    display: "Nova Scotia",
    iss: "https://pvc.novascotia.ca/issuer",
    keys: [
      { kid: "UJrT9jU8vOCUl4xsI1RZjOPP8hFUv7n9mhVtolqH9qw",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "kIaIeOhhxpiN13sDs6RKVzCpvxxObI9adKF5YEmKngM",
        y: "AZPQ7CHd3UHp0i4a4ua1FhIq8SJ__BuHgDESuK3A_zQ" },
    ]
  },
  {
    id: "ca.on",
    display: "Ontario",
    iss: "https://prd.pkey.dhdp.ontariohealth.ca",
    keys: [
      { kid: "Nlgwb6GUrU_f0agdYKc77sXM9U8en1gBu94plufPUj8",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "ibapbMkHMlkR3D-AU0VTFDsiidQ49oD9Ha7VY8Gao3s",
        y: "arXU5frZGOvTZpvg045rHC7y0fqVOS3dKqJbUYhW5gw" },
    ]
  },
  {
    id: "us.hi",
    display: "Hawaii, USA",
    iss: "https://travel.hawaii.gov",
    keys: [
      { kid: "Qxzp3u4Z6iafzbz-6oNnzobPG8HUr0Jry38M3nuV5A8",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "sxIW-vGe4g7LXU0ZpMOiMmgMznaC_8qj6HW-2JhCTkI",
        y: "Ytmnz6q7qn9GhnsAB3GP3MFlnk9kTW3wKk7RAue9j8U" },
    ]
  },
  {
    id: "us.va",
    display: "Virginia, USA",
    iss: "https://apps.vdh.virginia.gov/credentials",
    keys: [
      { kid: "sy5Q85VbiH4jNee-IpFkQvMxlVAhZ_poLMPLHiDF_8I",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "UDYtkThsYIdMuzC9AJi0CDNwwmSGt8Z75BBl9DbLXn0",
        y: "xWNNHxwz0RtTgTlBom3X8xFP6U5e92KYGZIBI2SYImA" },
    ]
  },
  {
    id: "ca.mb",
    display: "Manitoba",
    iss: "https://immunizationcard.manitoba.ca/api/national",
    keys: [
      { kid: "YnYeVk1pCtYvnmOytVTq09igCGdu_SyJM2Wn29AV7AQ",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "E2mScyP_Iwm0gn1nAYldT0MbWFUeapIsuh9ebqCJgkQ",
        y: "AePVDo-_XxQDJ_25BW4txoLPzuu7CQ65C2oLJIN4DxI" },
    ]
  },
  {
    id: "ca.nt",
    display: "Northwest Territories",
    iss: "https://www.hss.gov.nt.ca/covax",
    keys: [
      { kid: "8C-9TNgyGuOqc-3FXyNRq6m5U9S1wyhCS1TvpgjzkoU",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "C-9Lltax_iU6iYdK8DdCZzv4cQN6SFVUG7ACaCT_MKM",
        y: "_qaENBMJz6iLf1qyYMx2_D6fXxbbNoHbLcfdPF9rUI0" },
    ]
  },
  {
    id: "us.nj",
    display: "New Jersey, USA",
    iss: "https://docket.care/nj",
    keys: [
      { kid: "HvlLNClY2JAEhIhsZZ_CfRaxF5jdooWgaKAbLajhv2I",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "FssCyCxGTEuKiKqo-MwLDQlxz1vdKll4YFMkQaXVOkY",
        y: "A3nNMWC8IEQsZqH8Mp83qVLTA_X9eYwzr46o4-3YyRE" },
    ]
  },
  {
    id: "us.ut",
    display: "Utah, USA",
    iss: "https://docket.care/ut",
    keys: [
      { kid: "sBHR4URZTz8cq2kIV_JhTXwicbqp1tHtodItRSx0O0Q",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "uyzHUWf8EVXtlFW9nssxa1Z002rpc-GUw-YrZOZtmqo",
        y: "oFofHWIlPqfqCCU9R3fJOaUoWdzVzTcSNgmtF0Qgb6w" },
    ]
  }
];

// Check for updates above at https://files.ontario.ca/apps/verify/verifyRulesetON.json

export function getVerifiedIssuer(requestIssuer) {
    for (let curIssuer of issuers) {
        if (curIssuer.iss === requestIssuer) {
            return curIssuer;
        }
    }

    return null;
}
