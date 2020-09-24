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

const importPrivKey = () => {

}

const exportPrivKey = () => {

}

const exportPubKey = () => {

}

const signData = (priv_key,data) => {
    priv_key = hexToBytes(priv_key)
    let h = hashfunction.create()
    h.update(data)
    let msg = h.digest().toHex()
    let sig = secp256k1.ecdsaSign(hexToBytes("0x"+msg),priv_key).signature
    return bytesToHex(sig)
}

const verifyData = (sig,data,pub_key) => {
    pub_key = hexToBytes(pub_key)
    let h = hashfunction.create()
    h.update(data)
    let msg = h.digest().digest()
    return secp256k1.ecdsaVerify(sig,hexToBytes("0x"+msg),pub_key)
}
module.exports = {hashfunction,generatePrivKey,importPrivKey,signData,verifyData,exportPrivKey,exportPubKey}

