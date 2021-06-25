export const BASE_URL = 'https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-valuesets/main/'
export const VALUE_TYPES = {
  vaccine_medical_products: 'vaccine-medicinal-product.json',
  country_codes: 'country-2-codes.json',
  vaccine_auth_holders: 'vaccine-mah-manf.json',
  vaccine_prophylaxis: 'vaccine-prophylaxis.json',
  marketing_auth_holders: 'vaccine-mah-manf.json'
}
export const PASS_MIME_TYPE = 'application/vnd.apple.pkpass'
export const SECRETS = {
  TEAM_ID: process.env.TEAM_ID,
  PASS_TYPE_ID: process.env.PASS_TYPE_ID,
  CERT: Buffer.from(process.env.CERT, 'base64').toString('ascii'),
  PASSPHRASE: process.env.PASSPHRASE,
}