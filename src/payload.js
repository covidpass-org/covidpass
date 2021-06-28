const img = require('./img')
const consts = require('./constants')

exports.Payload = class {
  constructor(body, valueSets) {

    const color = body["color"]
    const rawData = body["raw"]
    const decoded = body["decoded"]

    if (!(color in consts.COLORS)) {
      throw new Error('Invalid color')
    }

    const dark = (color !== 'white')
    
    let backgroundColor = dark ? consts.COLORS[color] : consts.COLORS.white
    let labelColor = dark ? consts.COLORS.white : consts.COLORS.grey
    let foregroundColor = dark ? consts.COLORS.white : consts.COLORS.black
    let img1x = dark ? img.img1xwhite : img.img1xblack
    let img2x = dark ? img.img2xwhite : img.img2xblack

    if (typeof rawData === 'undefined') {
      throw new Error('No raw payload')
    }

    if (typeof decoded === 'undefined') {
      throw new Error('No decoded payload')
    }

    const v = decoded["-260"]["1"]["v"][0]
    if (typeof v === 'undefined') {
      throw new Error('Failed to read vaccination information')
    }

    const nam = decoded["-260"]["1"]["nam"]
    if (typeof nam === 'undefined') {
      throw new Error('Failed to read name')
    }

    const dob = decoded["-260"]["1"]["dob"]
    if (typeof dob === 'undefined') {
      throw new Error('Failed to read date of birth')
    }

    const firstName = nam["gn"]
    const lastName = nam["fn"]
    const name = lastName + ', ' + firstName
    
    const doseIndex = v["dn"]
    const totalDoses = v["sd"]
    const dose = doseIndex + '/' + totalDoses
    
    const dateOfVaccination = v["dt"]
    const uvci = v["ci"]
    const certificateIssuer = v["is"]

    const medicalProducts = valueSets.medicalProducts["valueSetValues"]
    const countryCodes = valueSets.countryCodes["valueSetValues"]
    const manufacturers = valueSets.manufacturers["valueSetValues"]

    const medicalProductKey = v["mp"]
    if(!(medicalProductKey in medicalProducts)) {
      throw new Error('Invalid medical product key')
    }

    const countryCode = v["co"]
    if(!(countryCode in countryCodes)) {
      throw new Error('Invalid country code')
    }

    const manufacturerKey = v["ma"]
    if(!(manufacturerKey in manufacturers)) {
      throw new Error('Invalid manufacturer')
    }

    this.certificateType = 'Vaccination'

    this.backgroundColor = backgroundColor
    this.labelColor = labelColor
    this.foregroundColor = foregroundColor
    this.img1x = img1x
    this.img2x = img2x

    this.raw = rawData

    this.name = name
    this.dose = dose
    this.dateOfVaccination = dateOfVaccination
    this.dateOfBirth = dob
    this.uvci = uvci
    this.certificateIssuer = certificateIssuer
    this.medicalProductKey = medicalProductKey

    this.countryOfVaccination = countryCodes[countryCode].display
    this.vaccineName = medicalProducts[medicalProductKey].display
    this.manufacturer = manufacturers[manufacturerKey].display
  }
}
