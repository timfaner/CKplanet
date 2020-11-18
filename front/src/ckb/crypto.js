import  forge from "node-forge"
import { randomBytes }  from "crypto"

import  secp256k1  from "secp256k1"
const hashfunction = forge.sha256

import {encodeUnicode,decodeUnicode} from "./utils"

const ECDH_IV = "0x253544254332253931253545772531414a25433325413625363025433325383425433325394266254332253941254333253842254332254245704f"
const DEFAULT_IV = "0x253544254332253931253545772531414a25433325413625363025433325383425433325394266254332253941254333253842254332254245704f"

const { bytesToHex, hexToBytes } = require('@nervosnetwork/ckb-sdk-utils')
//const { toUnicode } = require("punycode")
//pubkey,privkey,signature 均为hex形式的string

const sha256 = (data) => {
    let h = forge.sha256.create()
    h.update(data)

    return h.digest().toHex()
}

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

//TODO 使用uint8 array减小签名大小
/**
 * 
 * @param {string} privkey  
 * @param {string} pubkey 
 * @returns {string} 返回生成的key
 */
function generateECDHKey(privkey,pubkey) {
    let priv_key = hexToBytes(privkey)
    let pub_key = hexToBytes(pubkey)
    let share = secp256k1.ecdh(pub_key, priv_key)
    share = bytesToHex(share) 
    let key = generateAESKey(share)

    return key

}

function encryptAESKey(privkey = '',pubkey = '',aeskey){
    let key = generateECDHKey(privkey,pubkey)
    
    let  {encrypted_data,iv} =encryptData_c(aeskey,key,ECDH_IV)
    iv === ECDH_IV
    return encrypted_data
}


const decryptAESKey = (privkey = '',pubkey = '',eaeskey) =>{
    let key = generateECDHKey(privkey,pubkey)
    
    let  aeskey =decryptData_c(eaeskey,key,ECDH_IV)
    return aeskey
}




function generateAESKey(password) {
    var salt = 'salt';
    var key = forge.pkcs5.pbkdf2(password, salt, 10, 16);
    return forge.util.bytesToHex(key);
}//盐值固定为'salt'，由初始密码生成固定的加解密密钥

function encryptData(key,iv,data){
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    var encrypted_data = cipher.output;
    return encrypted_data.toHex();
}//由密钥、初始向量、数据进行加密，返回加密数据的hex传输至服务器

function decryptData(key,iv,encrypted_data) {
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(encrypted_data));
    let result = decipher.finish(); // check 'result' for true/false
    if (result)
     {var decrypted_data = decipher.output;
        return forge.util.decodeUtf8(decrypted_data)}
    //return forge.util.hexToBytes(decrypted_data)}
    
}//由密钥、初始向量、从服务器传回的加密数据进行解密，返回明文


function encryptData_c(data,key,iv=DEFAULT_IV) {

    data = encodeUnicode(data)
    if (iv !== DEFAULT_IV && iv !== ECDH_IV){
        iv = forge.random.getBytesSync(16);
        iv = forge.util.bytesToHex(iv)
    }
    //let  iv_hex = bytesToHex(iv)
    let encrypted_data = encryptData(key,iv,data);
    return {encrypted_data,iv:iv}
}

function decryptData_c(e_data,key,iv=DEFAULT_IV){
    let encrypted_data = forge.util.hexToBytes(e_data)
    let decrypted_data = decryptData(key,iv,encrypted_data);
    return decodeUnicode(decrypted_data)
}



const signData = (privkey,data) => {

    if(typeof(data) !== "string"){
        throw(
            "signing something not in string",data
        )
    }
    let priv_key = hexToBytes(privkey)
    let h = hashfunction.create()
    h.update(data)

    let msg = h.digest().toHex()

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




export {    
    generateAESKey, 
    encryptData_c,
    decryptData_c,
    sha256,
    generatePrivKey,
    signData,
    verifyData,
    getPubKey,
    generateECDHKey,
    encryptAESKey,
    decryptAESKey}

