const forge = require("node-forge")
const { randomBytes } = require('crypto')

const secp256k1 = require('secp256k1')
const hashfunction = forge.sha256



const { bytesToHex, hexToBytes } = require('@nervosnetwork/ckb-sdk-utils')
//pubkey,privkey,signature 均为hex形式的string


const generatePrivKey = () =>{
    let privKey
    do {
    privKey = randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privKey))
    return bytesToHex(privKey)
}


const getPubKey = (privkey) =>{
    let priv_key = hexToBytes(privkey)
    let pub_key = secp256k1.publicKeyCreate(priv_key)
    return(bytesToHex(pub_key))
}


const importPrivKey = () => {

}

const exportPrivKey = () => {

}

const exportPubKey = () => {

}


const signData = (privkey,data) => {
    let priv_key = hexToBytes(privkey)
    let h = hashfunction.create()
    h.update(data)
    let msg = h.digest.toHex()

    let sig = secp256k1.ecdsaSign(hexToBytes("0x"+msg),priv_key).signature
    return bytesToHex(sig)
}


const verifyData = (sig,data,pubkey) => {
    let pub_key = hexToBytes(pubkey)
    let h = hashfunction.create()
    h.update(data)
    let msg = h.digest().toHex()
    return secp256k1.ecdsaVerify(hexToBytes(sig),hexToBytes("0x"+msg),pub_key)
}
module.exports = {hashfunction,generatePrivKey,importPrivKey,signData,verifyData,exportPrivKey,exportPubKey,getPubKey}


