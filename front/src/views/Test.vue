<template>
    <div class="row">
        <p> for test porpuse
        </p>

        <b-button   @click.prevent="test()" size="md" class="mr-auto">测试</b-button>
    </div>
</template>


<script>
import {    
    generateAESKey, 
    encryptData_c,
    decryptData_c,
    sha256,
    generatePrivKey,
    importPrivKey,
    signData,
    verifyData,
    exportPrivKey,
    exportPubKey,
    getPubKey,
    generateECDHKey,
    encryptAESKey,
    decryptAESKey} from '@/ckb/crypto'

import {postData,getData}  from  '@/ckb/test'

import {DataServer} from '@/ckb/data_server'

export default {
    name: "Test",
    data: function(){
        return{
        
    postData,getData,
    DataServer,
    //encrypted        
    generateAESKey, 
    encryptData_c,
    decryptData_c,
    sha256,
    generatePrivKey,
    importPrivKey,
    signData,
    verifyData,
    exportPrivKey,
    exportPubKey,
    getPubKey,
    generateECDHKey,
    encryptAESKey,
    decryptAESKey
        }
    }
}
</script>