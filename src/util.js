import { VALUE_TYPES, BASE_URL } from "./constants"

export async function getValueSets() {
  var valueSets = {}
  
  for (const [key, value] of Object.entries(VALUE_TYPES)) {
    valueSets[key] = await getJSONfromURL(BASE_URL + value)
  }
  
  return valueSets
}

export async function getJSONfromURL(url) {
  return await (await fetch(url)).json()
}
