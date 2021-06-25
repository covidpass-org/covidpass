// Taken from https://github.com/ehn-dcc-development/ehn-sign-verify-javascript-trivial/blob/main/cose_verify.js
// and https://github.com/ehn-dcc-development/dgc-check-mobile-app/blob/2c2ebf4e9b7650ceef44f7e1fb05a57572830c5b/src/app/cose-js/sign.js

const base45 = require('base45-js')
const zlib = require('pako')
const cbor = require('cbor-js')

export function typedArrayToBufferSliced(array) {
  return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

export function typedArrayToBuffer(array) {
  var buffer = new ArrayBuffer(array.length)

  array.map(function(value, i) {
    buffer[i] = value
  })
  return array.buffer
}

export function toBuffer(ab) {
  var buf = Buffer.alloc(ab.byteLength)
  var view = new Uint8Array(ab)

  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i]
  }
  return buf
}

export function decodeData(data) {
  console.log(data)

  data = data.toString('ASCII')

  if (data.startsWith('HC1')) {
    data = data.substring(3)
  if (data.startsWith(':')) {
    data = data.substring(1)
  } else {
    console.log("Warning: unsafe HC1: header - update to v0.0.4")
  }
  } else {
    console.log("Warning: no HC1: header - update to v0.0.4")
  }

  data = base45.decode(data)

  if (data[0] == 0x78) {
    data = zlib.inflate(data)
  }

  data = cbor.decode(typedArrayToBuffer(data));

  if (!Array.isArray(data)) {
    throw new Error('Expecting Array')
  }

  if (data.length !== 4) {
    throw new Error('Expecting Array of length 4')
  }

  let plaintext = data[2]
  let decoded = cbor.decode(typedArrayToBufferSliced(plaintext))

  console.log(JSON.stringify(decoded, null, 4))

  return decoded
}