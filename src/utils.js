const { VALUE_TYPES, BASE_URL } = require("./constants")
const fetch = require("node-fetch")

exports.getValueSets = async function() {
  async function getJSONfromURL(url) {
    return await (await fetch(url)).json()
  }

  var valueSets = {}
  
  for (const [key, value] of Object.entries(VALUE_TYPES)) {
    valueSets[key] = await getJSONfromURL(BASE_URL + value)
  }
  
  return valueSets
}
