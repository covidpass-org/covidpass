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
  },
  {
    id: "us.de",
    display: "Delaware, USA",
    iss: "https://smarthealthcard.iisregistry.net/delaware/issuer",
    keys: [
      { kid: "vYkxPjrksrvOfK8S02wkQ6LYcY5JLuDpnyERBklL-V8",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "alTrUEv7wMrOf9Sge9GeSAwz8cGz56JsJaZKzOlRQG4",
        y: "N1eSU9XhVdtb7l3rYj6_mXxHDVHj5ZDN_oB-sq6vVH8" },
    ]
  },
  {
    id: "ca.nl",
    display: "Newfoundland and Labrador",
    iss: "https://www.gov.nl.ca/covid-19/life-during-covid-19/vaccination-record/prod",
    keys: [
      { kid: "UboztS3pE1mr0dnG7Rv24kRNqlYbHrbxd-qBFerpZvI",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "mB0PKTVRnr3JCtyucEjCHXkXW3COg5KP0y4gKCNJxWc",
        y: "PTpxiYECNiuyRwpwqjme8OIFdG7N-HwN2XH02phdZCs" },
    ]
  },
  {
    id: "us.ct",
    display: "Connecticut, USA",
    iss: "https://smarthealthcard.iisregistry.net/connecticut/issuer",
    keys: [
      { kid: "SzxkIArQIMhaFvD7yASR75tYfcIvc3SxbcY82WqpJYc",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "WOfXcDqfbL5pHYJ7TZ1G5nUs5RlpFEULjKK58-GIZHU",
        y: "cfP-u94WNE_gBD3dvp2XqKHF7k4JWC-JJsOhf8bxk4M" },
    ]
  },
  {
    id: "us.nv",
    display: "Nevada, USA",
    iss: "https://smarthealthcard.iisregistry.net/nevada/issuer",
    keys: [
      { kid: "MLHtoHWeAr5PeKA8C-S16QduFcPVHYMnuRAMLag1Fus",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "XCA3RZFKOnDep4BA8MhxrUguZZeTofsm16WuQ-a3sKU",
        y: "9W0_JW9U7s98tOuZrkYiQyDEOoxgpMAEnIItC0_vLME" },
    ]
  },
  {
    id: "us.nm",
    display: "New Mexico, USA",
    iss: "https://smarthealthcard.iisregistry.net/newmexico/issuer",
    keys: [
      { kid: "TyJXvion-N1hiPReLqGqP3GEHIHUKqDbpNF6_Yx2x1g",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "h6eiqSzzTu5x5lL3WcrQcN8Dw-InqaZO24ejEqtaBUo",
        y: "lwnDiJgFRShPY0PMmfGdGWF84XlpJxIFU1C4cYnQhGM" },
    ]
  },
  {
    id: "us.ok",
    display: "Oklahoma, USA",
    iss: "https://smarthealthcard.iisregistry.net/oklahoma/issuer",
    keys: [
      { kid: "mdc6xSqYJBj5wAfdO75tFY96MP1sRwv8o1vRKcJvWe4",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "_0Ykdew25aOEAoEqgiKOwsuQHaSBo8m4cxp7JrpnFoE",
        y: "SWDMBC-y-YMiso_hSQB6bl3MvYOii-rpYtgQJISt84Y" },
    ]
  },
  {
    id: "us.ky",
    display: "Kentucky, USA",
    iss: "https://smarthealthcard.iisregistry.net/kentucky/issuer",
    keys: [
      { kid: "xjDAI01aAqqKVfTby1HgI5mGmaNov_iNAe7YU42-GYI",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "XGD2eTGy-Ty264jBz6__6yVih4HIShgGzWdJBAeLJOU",
        y: "KvM4EauttKWSVjF5unr7MUWz1QSwsEW46A4aGWsFY4I" },
      { kid: "COtZJhsWjnta-bYXwlRkWlldA95Ai7S6YGZE4MPB-tk",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "X2Erdh2dszBgm0y5RF0C6tcA2fwGdDU_ZsOeJLjjcQk",
        y: "haxiYhRJifQY_qU3Dv_qqk1aBzY4IrcegLqu6rvikMQ" },
    ]
  },
  {
    id: "ca.pe",
    display: "Prince Edward Island",
    iss: "https://pvcprod.gov.pe.ca",
    keys: [
    { kid: "Z8YjtXO3hGPpbDR9wMcrifbcL-PswLyMFhEJGSn1yC0",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "oxD89LV7Y_GBRei7wNmKLYdo-25ujdI74OdC9NkQlyQ",
      y: "NNY2ntabDPKk_5fnjpRyxkre34Ru7NzrFgcWgRKb2I8", 
      date: 1630513678410 }, 
    { kid: "uXqBkl4jkadfFUtcrkeVtXRaCCy-nNHA1aD6nKb0OJ4",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig", 
      x: "YwKKFnC2hgQHZVsqKUz9oDwjF0FvCrYIKicT9HpwuLQ",
      y: "9WuBIW9S5eXKRhkFW2LvcVsgFGgOURlMIU1i_syhbyg", 
      date: 1630517153168 }, 
    { kid: "rDW5Ssu6mvGAnouM1oaeiDh06OdTePgH9ZwC1MbwAoY",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig", 
      x: "M6tuTL6MBUHZNfzGUTivBcpGXord54xHiKVL3XIOLM0",
      y: "fgSw0roeZpXgYLHhfSz-W_XWMZu-RqbR7my-_d9Vvl8", 
      date: 1630517520701 }, 
    { kid: "AWbze1dsT_69BBvlCv8g8rzUAyIBM3q6OT7zMQxBWVU",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig", 
      x: "nbI9SWaXfrEnbxG36Q8EWkl-sKNirCAlGqpseG1BERA", 
      y: "ogVD4hZwgT30g-h6UKZBTMIbYeg6u4W7TI7mzvp1Fy8", 
      date: 1630600429633 }, 
    { kid: "icKN8sxNH2ijHGcmqCOWHKziRPd25BoENF5Z0dVrkaI",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "AjAdLBY7cpq5m3Eq5MTtENvs5TuBPbyqRcNa5hTxgq8", 
      y: "MKxRT1jZpZpLjx9cefytBiE5s18M-jSAmMNYmldGjbE", 
      date: 1630613433678 }, 
    { kid: "SkSCQeF4JDcLSShAM5wejAAdB8rIT3X9-EH8rLNk0fY",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "5pwa78_VUGsxRK0lP_PODB2wBofjlxcaFl6r0N1-ODE", 
      y: "oV2yJ0qVZG5INljTl5AUbU1uMxlVFS-BhNC12LzdHN0", 
      date: 1630613435615 }, 
    { kid: "L0ACjkybPcCgJOrMywfz3gJGDeEvxkUSa2j9Pbhjwz8",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "CTa6_OO8QKrrlNXjXAbDc0rnvPRGo5UpfmGnuCrWiPw", 
      y: "UXbNAiw7sSImEvOwWH1NytR8MXSaXCb6sWR9z4fTA_M", 
      date: 1630613436458 }, 
    { kid: "pCmOvJBUfo30WuG9UVlDCOvyBhPScLU2_CrAGy9A4Q8",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "kvwC_MYV8lBVfeamcGj5XXV944VwhSJZ_rBKD0Hcn_s", 
      y: "UR8MzZCVIArauwJ-OODIbim0HLRbCFkDPXNjPsoRmfM", 
      date: 1630613437404 }, 
    { kid: "gzeRVlR44Ia5cL67gN-6HhWsBikN_ZodlGAeGLv_HsI",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "QmZMR0zgMTKLgqSKUeOfV10moL5nLcjfeUIO3Ns1u0M", 
      y: "FP8vGUU-wAkqUd07o5q2tdakV5rJ6hg2cT0bgunW9kU", 
      date: 1630613438138 }, 
    { kid: "D86U5NZ_OusITiBEqmgW2gRUAw1vhcbRtHujJ4wPx7w",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "J24rRVpojPItd1Wda4ZkIc6gooPEDzlstiSQMqHaURA", 
      y: "X5jqWz8RY6Zkc6Ib6WNnnkAJHwt1C-PmtELC2c13hyQ", 
      date: 1630613469805 }, 
    { kid: "JMCyyrr9wjXT5FY8rx6Jiel4DCfXS0ZDQPUuGdv4P1k",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "fY8esOCER1T-68OIvXtizxtXVC7KT9qsztZQhll3UJk", 
      y: "6J1DpZVjPGEQG9EApygaM0ZkfQOLRAWuN_YB3BT93DU", 
      date: 1631122847087 }, 
    { kid: "B5zoHRXFX54o1XgT9IbQLEqTc1GK4SEJg9vjd-K4n3o",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "Ze3--8ERukpW9nMd317lQJ_97qg5q7BEqFMoJmGj59s", 
      y: "H36ot9jzPKpPVa4aHka7SXnPOTjEBdtZRZ4wN-OUHQw", 
      date: 1631207785437 }, 
    { kid: "cZxJnAOT6390E103SoaVyX2RNJenO46qyBcceU4A8go",
      alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
      x: "KhqF3iMvKDeiarW85OFrKstJWK5maNEi1H6JttLfky8", 
      y: "RWUlC2s1aEdminnoqyMxtyU4fVlsDLJt36feT0qsJmU", 
      date: 1634299350636 }
    ]
  },
  {
    id: "ca.nu",
    display: "Nunavut",
    iss: "https://pvc.gov.nu.ca/pvc",
    keys: [
      { kid: "MXH6EAfEDZ0JH46r3j5axkCTo-QdreVtEXE-dbvydUU",
        alg: "ES256", kty: "EC", crv: "P-256", use: "sig",
        x: "TW2mjeWs2JRBDblltiq2W00M_Q3gXnCl5FlLKIKV3oQ",
        y: "sbraf7XcT2iH7uLUtH_grf5eVF7LltpVb9z8E31WGj4" },
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
