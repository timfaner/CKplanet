<template>
  <div id="UpdateDataServer">

    <el-form :disabled='btnloading' status-icon :model="form" :rules="formCheckRules">
      <el-form-item v-if="data_server_connected" label="Current Data server:">
          <span class="data_server_ip">{{user_dataserver}} </span>
      </el-form-item>
      <el-form-item prop="url" label="Data server" >
        <el-input
          v-model="form.url"
          placeholder=" Input dataserver ip and port, like :http://demo.com:8181"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-collapse-transition>
          <TxStatusDashBoard v-if="showProgress"> </TxStatusDashBoard>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnloading"
          @click="UpdateDataServer()"
          >SAVE</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TxStatusDashBoard from "@/components/TxStatusDashBoard.vue";
import { DataServer } from "@/ckb/data_server";

import { mapState, mapMutations } from "vuex";

export default {
  name: "UpdateDataServer",
  components: {
    TxStatusDashBoard,
  },
  computed: mapState({
    user_address: (state) => state.user_chain_info.address,
    user_lock_args: (state) => state.user_chain_info.lock_args,
    user_dataserver:function (state) {
      return state.data_server_pool[this.user_lock_args].ip
    },
    data_server_connected: (state) => state.ckplanet.data_server_connected,
  }),
  methods: {
    ...mapMutations(["dataServerConnect"]),

       validURL : function(url) {
        console.log(url)
      try {
        let a =new URL(url);
        if(a.origin !== null){
          return true}
        else{
          return false;  
        }
      } catch (_) {
        
        return false;  
      }

    },
    UpdateDataServer: async function() {
      if(!this.validURL(this.form.url))
      {
        this.$message("Invalid sever ip and port")
        return
      }

      this.showProgress = true;
      this.btnloading = true;

      let user_ds = new DataServer(this.$store, this.user_lock_args);

      let ip = new URL(this.form.url).origin

      user_ds.setIp(ip);

      try {
        await user_ds.getDataserverAuth();
        

        await user_ds.updateDataServerInfo();
        this.$message({
          message: "Data server Profile updated success",
          type: "success",
        });
        this.dataServerConnect(true);
        this.showProgress = false;
        this.btnloading = false;

        this.$emit("closedialog");
      } catch (error) {
        this.showProgress = false;
        this.btnloading = false;
        this.$message.error(error.message);
      }
    },
  },
  data: function() {
      let isValidURL = function(rule,url,callback) {
        console.log(url)
      try {
        let a =new URL(url);
        if(a.origin !== null){

          callback()}
        else{

          callback(new Error("Invalid ip and port"))}
      } catch (_) {
        callback(new Error("Invalid ip and port"))
        return false;  
      }
      return true;
    }
    return {

      formCheckRules:{
        'url':[
          {validator:isValidURL, trigger:"blur"},
          {required:true, message:"test", trigger:"blur"}
        ]
      },
      showProgress: false,
      btnloading: false,
      data_server_ip: "",
      form: {
        url:''
      },
      formLabelWidth: "100",
      test: null,
      nickname: "",
    };
  },
  props: {},
};
</script>

<style scoped>
#UpdateDataServer {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


.data_server_ip{
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
}


.minbutton {
  min-width: 150px;
  display: inline-block;
}
</style>
