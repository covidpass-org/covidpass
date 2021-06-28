const { VALUE_TYPES, VALUE_SET_BASE_URL } = require("./constants")
const fetch = require("node-fetch")

exports.getValueSets = async function() {
  async function getJSONFromURL(url) {
    return await (await fetch(url)).json()
  }

  let valueSets = {}
  
  for (const [key, value] of Object.entries(VALUE_TYPES)) {
    valueSets[key] = await getJSONFromURL(VALUE_SET_BASE_URL + value)
  }
  
  return valueSets
}
