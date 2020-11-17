<template>
  <div class="row">
    <p>for test porpuse</p>

    <p>mode is {{ modes }}</p>

    <h3>{{ lists }}</h3>
    <router-link :to="url">Go to about</router-link>
    <el-button @click.prevent="test()" size="md" class="mr-auto"
      >测试</el-button
    >
    <el-button @click.prevent="postDataa()">发送数据</el-button>
    <el-button @click.prevent="purgeState()">清除状态</el-button>
    
  </div>
</template>

<script>
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
