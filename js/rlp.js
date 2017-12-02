// based on:
//   https://github.com/ethereumjs/rlp/raw/3122e47f7c2ff2c7efa67acfeabe02a5f3a3670a/index.js

/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This function takes in a data, convert it to buffer if not, and a length for recursion
 *
 *
 * @param {Buffer,String,Integer,Array} data - will be converted to buffer
 * @returns {Buffer} - returns buffer of encoded data
 **/

function encode (input) {
    if (input instanceof Array) {
      var output = []
      for (var i = 0; i < input.length; i++) {
        output.push(encode(input[i]))
      }
      var buf = Buffer.concat(output)
      return Buffer.concat([encodeLength(buf.length, 192), buf])
    } else {
      input = toBuffer(input)
      if (input.length === 1 && input[0] < 128) {
        return input
      } else {
        return Buffer.concat([encodeLength(input.length, 128), input])
      }
    }
  }
  
  function safeParseInt (v, base) {
    if (v.slice(0, 2) === '00') {
      throw (new Error('invalid RLP: extra zeros'))
    }
  
    return parseInt(v, base)
  }
  
  function encodeLength (len, offset) {
    if (len < 56) {
      return new Buffer([len + offset])
    } else {
      var hexLength = intToHex(len)
      var lLength = hexLength.length / 2
      var firstByte = intToHex(offset + 55 + lLength)
      return new Buffer(firstByte + hexLength, 'hex')
    }
  }
  
  function isHexPrefixed (str) {
    return str.slice(0, 2) === '0x'
  }
  
  // Removes 0x from a given String
  function stripHexPrefix (str) {
    if (typeof str !== 'string') {
      return str
    }
    return isHexPrefixed(str) ? str.slice(2) : str
  }
  
  // Removes leading zeros from: Buffer, Array, or String
  function stripZeros (a) {
    a = stripHexPrefix(a)
    var first = a[0]
    while (a.length > 0 && first.toString() === '0') {
      a = a.slice(1)
      first = a[0]
    }
    return a
  }
  
  function intToHex (i) {
    var hex = i.toString(16)
    if (hex.length % 2) {
      hex = '0' + hex
    }
  
    return hex
  }
  
  function padToEven (a) {
    if (a.length % 2) a = '0' + a
    return a
  }
  
  function intToBuffer (i) {
    var hex = intToHex(i)
    return new Buffer(hex, 'hex')
  }
  
  function toBuffer (v) {
    if (!Buffer.isBuffer(v)) {
      if (Array.isArray(v)) {
        v = Buffer.from(v)
      } else if (typeof v === 'string') {
        if (isHexPrefixed(v)) {
          v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex')
        } else {
          v = Buffer.from(v)
        }
      } else if (typeof v === 'number') {
        v = intToBuffer(v)
      } else if (v === null || v === undefined) {
        v = Buffer.allocUnsafe(0)
      } else if (v.toArray) {
        // converts a BN to a Buffer
        v = Buffer.from(v.toArray())
      } else {
        throw new Error('invalid type')
      }
    }
    return v
  }
  
  function bufferToHex (buf, add_prefix) {
    add_prefix = (typeof add_prefix !== 'undefined') ?  add_prefix : true
    buf = toBuffer(buf)
    if ((! buf) || (buf.length === 0))
      return ''
    else
      return (add_prefix ? '0x' : '') + buf.toString('hex')
  }
  
  function bufferToInt (buf) {
    return parseInt(bufferToHex(buf), 16)
  }
 
  
rlp = {encode:encode, isHexPrefixed:isHexPrefixed, stripHexPrefix:stripHexPrefix, stripZeros:stripZeros, intToHex:intToHex, padToEven:padToEven, intToBuffer:intToBuffer, toBuffer:toBuffer, bufferToHex:bufferToHex, bufferToInt:bufferToInt}
  
const fields = [{
  name: 'nonce',
  length: 32,
  allowLess: true,
  default: new Buffer([])
}, {
  name: 'gasPrice',
  length: 32,
  allowLess: true,
  default: new Buffer([])
}, {
  name: 'gasLimit',
  alias: 'gas',
  length: 32,
  allowLess: true,
  default: new Buffer([])
}, {
  name: 'to',
  allowZero: true,
  length: 20,
  default: new Buffer([])
}, {
  name: 'value',
  length: 32,
  allowLess: true,
  default: new Buffer([])
}, {
  name: 'data',
  alias: 'input',
  allowZero: true,
  default: new Buffer([])
}, {
  name: 'v',
  alias: 'chaindId',
  allowZero: true,
  default: new Buffer([0x1c])
}, {
  name: 'r',
  length: 32,
  allowZero: true,
  allowLess: true,
  default: new Buffer([])
}, {
  name: 's',
  length: 32,
  allowZero: true,
  allowLess: true,
  default: new Buffer([])
}]