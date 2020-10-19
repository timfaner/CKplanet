<template>
    <div class="row">
        <p> for test porpuse
        </p>

        <p> mode is {{modes}} </p>

        <h3> {{lists}} </h3>

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


export default {
    name: "Test",
    methods:{
        test(){
            
            this.$store.commit("updateManagedCyclesIndex",[1,2,3])
        }
    },
    data: function(){
        return{
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
        lists : function(){ return this.$store.state.ckplanet.user_managed_cycles_index}
    }
}
</script>