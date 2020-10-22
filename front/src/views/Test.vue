<template>
    <div class="row">
        <p> for test porpuse
        </p>

        <p> mode is {{modes}} </p>

        <h3> {{lists}} </h3>
        <router-link :to="url">Go to about</router-link>
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
    signData,
    verifyData,
    getPubKey,
    generateECDHKey,
    encryptAESKey,
    decryptAESKey} from '@/ckb/crypto'

import {postData,getData}  from  '@/ckb/test'

import {DataServer} from '@/ckb/data_server'
import {vaildDataType,DATA_STRUCT} from    '@/ckb/ckplanet'

import {  getCellsByLocks,
  requestAuth,
  queryAddresses,
  signAndSendTransaction,
  signMessage,} from "@/ckb/rpc.js"


export default {
    name: "Test",
    methods:{
        test(){
            
            this.id = this.id + "1"
            
        }
    },
    data: function(){
        return{

              getCellsByLocks,
  requestAuth,
  queryAddresses,
  signAndSendTransaction,
  signMessage,
    id:'1',
    DATA_STRUCT,        
    vaildDataType,
    postData,getData,
    DataServer,
    //encrypted        
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
    decryptAESKey
        }
    },
    props:[
        "modes"
    ],
    computed:{
        lists : function(){ return this.$store.state.ckplanet.user_managed_cycles_index},
        url: function(){return "/cycles/"+this.id+"/"+this.id}
    }
}
</script>