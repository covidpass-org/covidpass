// Taken from https://github.com/ehn-dcc-development/ehn-sign-verify-javascript-trivial/blob/main/cose_verify.js
// and https://github.com/ehn-dcc-development/dgc-check-mobile-app/blob/main/src/app/cose-js/sign.js

import base45 from 'base45';
import pako from 'pako';
import cbor from 'cbor-js';

export function typedArrayToBufferSliced(array: Uint8Array): ArrayBuffer {
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
}

export function typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
    var buffer = new ArrayBuffer(array.length);

    array.map(function (value, i) {
        return buffer[i] = value;
    })

    return array.buffer;
}

export function decodeData(data: string): Object {

    if (data.startsWith('HC1')) {
        data = data.substring(3);

        if (data.startsWith(':')) {
            data = data.substring(1);
        } else {
            console.log("Warning: unsafe HC1: header");
        }
    } else {
        console.log("Warning: no HC1: header");
    }

    var arrayBuffer: Uint8Array = base45.decode(data);

    if (arrayBuffer[0] == 0x78) {
        arrayBuffer = pako.inflate(arrayBuffer);
    }

    var payloadArray: Array<Uint8Array> = cbor.decode(typedArrayToBuffer(arrayBuffer));

    if (!Array.isArray(payloadArray)) {
        throw new Error('Expecting Array');
    }

    if (payloadArray.length !== 4) {
        throw new Error('Expecting Array of length 4');
    }

    var plaintext: Uint8Array = payloadArray[2];
    var decoded: Object = cbor.decode(typedArrayToBufferSliced(plaintext));

    return decoded;
}