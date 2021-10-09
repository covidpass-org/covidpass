const jose = require("node-jose");
const jsQR = require("jsqr");
const zlib = require("zlib");
const { issuers } = require("./issuers");

function getQRFromImage(imageData) {
  return jsQR(
    new Uint8ClampedArray(imageData.data.buffer),
    imageData.width,
    imageData.height
  );
}

function getScannedJWS(shcString) {
  try {
    return shcString
      .match(/^shc:\/(.+)$/)[1]
      .match(/(..?)/g)
      .map((num) => String.fromCharCode(parseInt(num, 10) + 45))
      .join("");
  } catch (e) {
    error = new Error("parsing shc string failed");
    error.cause = e;
    throw error;
  }
}

function verifyJWS(jws, iss) {
  const issuer = issuers.find(el => el.iss === iss);
  if (!issuer) {
    error = new Error(`Unknown issuer ${iss}`);
    error.customMessage = true;
    return Promise.reject(error);
  }
  return jose.JWK.asKeyStore({ keys: issuer.keys }).then(function (keyStore) {
    const { verify } = jose.JWS.createVerify(keyStore);
    //console.log("jws", jws);
    return verify(jws);
  });
}

function decodeJWS(jws) {
  try {
    const payload = jws.split(".")[1];
    return decodeJWSPayload(Buffer.from(payload, "base64"));
  } catch (e) {
    error = new Error("decoding payload failed");
    error.cause = e;
    throw error;
  }
}

function decodeJWSPayload(decodedPayload) {
  return new Promise((resolve, reject) => {
    zlib.inflateRaw(decodedPayload, function (err, decompressedResult) {
      if (typeof err === "object" && err) {
        console.log("Unable to decompress");
        reject(err);
      } else {
        try {
          //console.log(decompressedResult);
          scannedResult = decompressedResult.toString("utf8");
          resolve(JSON.parse(scannedResult));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

module.exports = {
  getQRFromImage,
  getScannedJWS,
  verifyJWS,
  decodeJWS,
  decodeJWSPayload,
};
