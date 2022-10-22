// 控制台
const readline = require('readline')
const oxoKeyPairs = require('oxo-keypairs')
const qrcode = require('qrcode-terminal')
const rl = readline.createInterface(process.stdin, process.stdout)

function strToHex(str) {
  let arr = []
  let length = str.length
  for (let i = 0; i < length; i++) {
    arr[i] = (str.charCodeAt(i).toString(16))
  }
  return arr.join('').toUpperCase()
}

function Sign(msg, sk) {
  let msgHexStr = strToHex(msg)
  let sig = oxoKeyPairs.sign(msgHexStr, sk)
  return sig
}

function signJson(json, sk) {
  let sig = Sign(JSON.stringify(json), sk)
  json.Signature = sig
  return json
}

function genAddressQrcode(pk, sk) {
  let json = {
    "Timestamp": Date.now(),
    "PublicKey": pk
  }
  return JSON.stringify(signJson(json, sk))
}

rl.on('line', function (line) {
  let seed = line.trim()
  try {
    let KeyPair = oxoKeyPairs.deriveKeypair(seed)
    let pk = KeyPair.publicKey
    let sk = KeyPair.privateKey

    let address = oxoKeyPairs.deriveAddress(KeyPair.publicKey)
    console.log('===================')
    console.log(address)
    let address_qrcode = genAddressQrcode(pk, sk)
    qrcode.generate(address_qrcode)

    
    console.log('===================')
    console.log(seed)
    let json = { "Name": '000', "Seed": seed }
    qrcode.generate(JSON.stringify(json))
  } catch (error) {
    console.log(error)
    console.log('seed invalid...')
  }
})

rl.on('close', function () {
  console.log('bye bye!')
  process.exit(0)
})