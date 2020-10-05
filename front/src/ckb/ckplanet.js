const forge = require("node-forge")


const DATA_TYPE = {
    user_profile:"1",
    user_managed_cycle_list:"2",
    user_joined_cycle_list:"3",
    cycle_profile:(cycleid) =>{return "4"+ cycleid},
    cycle_contents:(cycleid) =>{return "5"+ cycleid},
    cycle_users:(cycleid) => {return "6" + cycleid}
}



//unicode编码
function encodeUnicode(str) {
    var res = [];
    for (var i = 0; i < str.length; i++) {
        res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
    }
    return "\\u" + res.join("\\u");
  }

  //unicode解码
function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
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


function encryptData_c(data,key) {

    data = encodeUnicode(data)
    let iv = forge.random.getBytesSync(16);
    iv = forge.util.bytesToHex(iv)

    //let  iv_hex = bytesToHex(iv)
    let encrypted_data = encryptData(key,iv,data);
    return {encrypted_data,iv:iv}
}

function decryptData_c(e_data,key,iv){
    let encrypted_data = forge.util.hexToBytes(e_data)
    let decrypted_data = decryptData(key,iv,encrypted_data);
    return decodeUnicode(decrypted_data)
    
}
module.exports = {DATA_TYPE,
    generateAESKey, 
    encryptData_c,
    decryptData_c,
}

