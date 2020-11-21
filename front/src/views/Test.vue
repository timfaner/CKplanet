<template>
  <div class="row">
    <p>for test porpuse</p>

    <p>mode is {{ modes }}</p>

    <h3>{{ lists }}</h3>
    <router-link :to="url">Go to about</router-link>
    <el-button @click.prevent="test()" size="md" class="mr-auto"

      >Test</el-button
    >
    <el-button @click.prevent="postDataa()">Send data</el-button>
    <el-button @click.prevent="purgeState()">Clear state</el-button>

    
  </div>
</template>

<script>

import  {
  Keccak256Hasher,
  //PwCollector,
  //Web3ModalProvider,
  //Amount,
  //AmountUnit,
  //Cell,
  // EthSigner,
} from "@lay2/pw-core";

import {  RICH_NODE_RPC_URL,
  RICH_NODE_INDEXER_URL,
  MIN_CAPACITY,
  TRANSACTION_FEE,
  SECP256K1_BLAKE160_CODE_HASH,
  SECP256K1_BLAKE160_DEP_TXHASH,
  KEYPERING_URL,
  DAPP_DESCRIPTION,
  Operator,
  DATASERVER_INFO,
  DATA_INTEGRITY,
  CODE_HASH_CAPACITY,
  DAPP_ID,
  CELLS_CACHE_TIME,
  SECP256K1_BLAKE160_LOCK,
  PW_LOCK} from "@/ckb/const"


import {

  
  generateAESKey,
  encryptData_c,
  decryptData_c,
  generatePrivKey,
  signData,
  verifyData,
  getPubKey,
  generateECDHKey,
  encryptAESKey,
  decryptAESKey,
  importSignature,
  exportSinature,
  Blake2b,
  hashFunc,
} from "@/ckb/crypto";

import secp256k1 from "secp256k1";

import { bytesToHex, hexToBytes } from "@nervosnetwork/ckb-sdk-utils";

import ECPair from "@nervosnetwork/ckb-sdk-utils/lib/ecpair";

import {
  DataServer,
  getMpk,
  getAuth,
  postData,
  getData,
  generateDataSig,
} from "@/ckb/data_server";
import {
  vaildDataType,
  DATA_STRUCT,
  getDataTemplate,
  getDataID,
} from "@/ckb/ckplanet";

import {
  getCellsByLocks,
  requestAuth,
  queryAddresses,
  signAndSendTransaction,
  signMessage,
} from "@/ckb/rpc.js";
import { DataSetter } from "@/ckb/data_handler";

import Vuex_Collector from "@/ckb/vuex-collector"
import CKplanet_Builder from "@/ckb/ckplanet-builder"
import { Amount, AmountUnit, Cell, CellDep, DepType, OutPoint, Script } from '@lay2/pw-core'
export default {
  name: "Test",
  methods: {
    test() {
      this.id = this.id + "1";
      
    },
    purgeState(){
      this.$store.dispatch("resetAllState")
    },
    postDataa() {
      let user_ds = new DataServer(this.$store, this.$store.state.user_chain_info.lock_args);
      let data_setter = new DataSetter(user_ds);

      let data_type = "user_profile";
      let data = getDataTemplate(data_type);
      data.nickname = this.nickname;
      data.avatar_url = this.imageUrl;

      let data_id = getDataID(data_type);

      let tx_id = "";
      data_setter.postData(data, data_id, "public", true, tx_id);
    },
  },
  data: function() {
    return {
        RICH_NODE_RPC_URL,
  RICH_NODE_INDEXER_URL,
  MIN_CAPACITY,
  TRANSACTION_FEE,
  SECP256K1_BLAKE160_CODE_HASH,
  SECP256K1_BLAKE160_DEP_TXHASH,
  KEYPERING_URL,
  DAPP_DESCRIPTION,
  Operator,
  DATASERVER_INFO,
  DATA_INTEGRITY,
  CODE_HASH_CAPACITY,
  DAPP_ID,
  CELLS_CACHE_TIME,
  SECP256K1_BLAKE160_LOCK,
  PW_LOCK,
      Amount, AmountUnit, Cell, CellDep, DepType, OutPoint, Script,
      CKplanet_Builder,
      Vuex_Collector,
      Keccak256Hasher,
      DataServer,
      getMpk,
      getAuth,
      postData,
      getData,
      generateDataSig,
      hashFunc,
      Blake2b,
      ECPair,
      bytesToHex,
      hexToBytes,
      secp256k1,
      importSignature,
      exportSinature,
      getCellsByLocks,
      requestAuth,
      queryAddresses,
      signAndSendTransaction,
      signMessage,
      id: "1",
      DATA_STRUCT,
      vaildDataType,

      //encrypted
      generateAESKey,
      encryptData_c,
      decryptData_c,
      generatePrivKey,
      signData,
      verifyData,
      getPubKey,
      generateECDHKey,
      encryptAESKey,
      decryptAESKey,
    };
  },
  props: ["modes"],
  computed: {
    lists: function() {
      return this.$store.state.ckplanet.user_managed_cycles_index;
    },
    url: function() {
      return "/cycles/" + this.id + "/" + this.id;
    },
  },
};
</script>
