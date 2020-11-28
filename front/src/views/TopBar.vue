<template>
  <div >
    <el-row  id="topbar"  type="flex" align="middle" > 
      <el-col :span="4" ><span id="brandtext">CKPlanet</span></el-col>
      <el-col :span="12">
        <el-row type="flex" justify="center">
          <el-col :span="11">
        <el-input placeholder="lock_args" v-model="input_lock_args"> </el-input>
          </el-col>
          <el-col :span="6">
        <el-input placeholder="planet_id" v-model="input_cycle_id"> </el-input>
          </el-col>
          <el-col :span="3" :offset="1">
        <el-button  type="success"  @click="search()">
          Search Planet
        </el-button>
          </el-col>
        </el-row>
      </el-col>
      


      <el-col :span="5" :offset="2">


        <el-row class="infoRow" type="flex" :gutter="5">
          <el-col class="infoRowLabel" :span="7">
           Wallet: 
            </el-col>
          <el-col class="infoRowContent" :span="9">
            {{walletDisPlay}}
          <el-tooltip v-if="wallet_connected">
            <div slot='content'>
               <span class="data_server_ip">address: {{user_address}}</span>
              <br/>
               <span class="data_server_ip">lock_args : {{user_lock_args}}</span>

            </div>
            <span class="el-icon-info" ></span>
          </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-button  type="success" class="toggleBtn" size="mini" v-if="!wallet_connected" @click="dialogSelectWallet = true">
              <span class="toggleBtnFont">Connect</span>
            </el-button>
            <el-button type="success" class="toggleBtn" size="mini" v-if="wallet_connected" @click="logout()">
              <span class="toggleBtnFont">Disconnect</span>
            </el-button>
        
          </el-col>

        </el-row>
 
        <el-row class="infoRow" type="flex"  :gutter="5">
          <el-col class="infoRowLabel" :span="7">
            DataServer: 
          </el-col>
          <el-col class="infoRowContent" :span="dataServerSpan">
              <span>{{dataServerDisPlay}}</span>
            <el-tooltip v-if="wallet_connected">
            <div slot='content'>
               <span class="data_server_ip">DataServer: {{user_dataserver}}</span>


            </div>
            <span class="el-icon-info" ></span>
          </el-tooltip>
          </el-col>
          <el-col :span="8" v-if="data_server_connected">
        <el-button type="success" class="toggleBtn" size="mini" v-if="walletConnect" @click="dialogUpdateDataServer = true">
          <span class="toggleBtnFont">{{dataServerButtonDisPlay}}</span>
        </el-button>
          </el-col>
        </el-row>

      </el-col>


      <el-dialog
        :visible.sync="dialogUpdateDataServer"
        title="Connect to a data server"
        append-to-body
        :close-on-click-modal="false"
        width="40%"
      >
        <UpdateDataServer
          v-on:closedialog="finalizeUpdateDataServer"
        ></UpdateDataServer>
        <div slot="footer" class="dialog-footer"></div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogNewUser"
        title="Create a new user information"
        append-to-body
        :close-on-click-modal="false"
        width="40%"
      >
        <UpdateUserProfile
          v-on:closedialog="finalizeNewUser"
        ></UpdateUserProfile>
        <div slot="footer" class="dialog-footer"></div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogSelectWallet"
        title="Choose a wallet"
        :modal="false"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-button @click="login('ckb')"> Keypering</el-button>
        <el-button @click="login('eth')"> Use ETH Wallet </el-button>

        <div slot="footer" class="dialog-footer"></div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { formatCkb } from "@/ckb/utils";
import { getWalletAuth } from "../ckb/transaction";

import {} from "@/ckb/ckplanet";
import { mapState, mapMutations, mapActions } from "vuex";
import { DataServer } from "@/ckb/data_server";
//import {DataSetter } from "@/ckb/data_handler"

import Vuex_Collector from "@/ckb/vuex-collector";
import UpdateUserProfile from "@/components/UpdateUserProfile.vue";
import UpdateDataServer from "@/components/UpdateDataServer.vue";
import { RICH_NODE_RPC_URL } from "@/ckb/const";

import PWCore, {
  Web3ModalProvider,
  //Amount,
  //AmountUnit,
  //Cell,
  // EthSigner,
} from "@lay2/pw-core";

//import SDCollector from "./sd-collector";
//import SDBuilder from "./sd-builder";
import Web3Modal, {  getInjectedProviderName } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import supportedChains from "@/eth/chains";
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";
import {
  connect_ws_server,
  get_onclose,
  get_onerror,
  get_onmessage,
} from "@/ckb/ws_client";

export default {
  name: "TopBar",
  data: function() {
    return {
      
      pw: {},
      web3Modal: null,
      chainId: 1,
      builder: {},

      input_lock_args: "",
      input_cycle_id: "",
      data_server_ip: "",
      dialogSelectWallet: false,
      dialogUpdateDataServer: false,
      dialogNewUser: false,
      showed: false,
      lockScript: undefined,
      lockHash: "",
      emptyCells: [],
      filledCells: [],
      summary: {
        inuse: 0,
        free: 0,
        capacity: 0,
      },
      showModel: false,
      editData: "",
    };
  },
  computed: 
  {
    dataServerButtonDisPlay(){
      if(this.wallet_connected)
        return "Switch"
      else
        return "Connect"
    },
    dataServerSpan:function(){
      if(this.wallet_connected)
        return 9
      else
        return 15
    },
    walletDisPlay:function(){
      if(!this.wallet_connected)
        return  "Not Connected"
      else
        return this.walletName
    },
    dataServerDisPlay:function(){
      if(!this.data_server_connected)
        return "Please connect Wallet first"
      else return "Connected"
    },
    ...mapState({
    user_address: (state) => state.user_chain_info.address,
    user_lock_args: (state) => state.user_chain_info.lock_args,

    ckplanet: (state) => state.ckplanet,
    user_managed_cycles_index: (state) =>
      state.ckplanet.user_managed_cycles_index,
    user_joined_cycles_index: (state) =>
      state.ckplanet.user_joined_cycles_index,
    wallet_connected: (state) => state.ckplanet.wallet_connected,
    data_server_connected: (state) => state.ckplanet.data_server_connected,
    
    user_dataserver:function (state) {
      try {
        return state.data_server_pool[this.user_lock_args].ip
      } catch (e) {
        e
        return  ''
      }
      
    },
    walletName : function(state){
      switch (state.wallet) {
        case "ckb":
          return "keypering";
        case "eth":
          return getInjectedProviderName()
        default:
          return ""
      }
    },
  })
  },

  async mounted() {
    if (!window.ws) this.connect_ws();
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
    });

    if (this.web3Modal.cachedProvider) {
      const provider = await this.web3Modal.connect();
      this.connectWeb3(provider);
    }
  },
  components: {
    UpdateUserProfile,
    UpdateDataServer,
  },

  methods: {
    ...mapMutations(["walletConnect", "dataServerConnect", "updateWallet"]),
    ...mapActions([
      "getManageCycles",
      "getCycle",
      "getJoinCycles",
      "checkUserExists",
    ]),

    connect_ws: function() {
      let msg_handler = () => {};
      window.ws = connect_ws_server(
        this.user_lock_args,
        get_onmessage(this.$store, msg_handler),
        get_onclose(),
        get_onerror()
      );
    },
    getNetwork: function() {
      return this.getChainData(this.chainId).network;
    },
    getChainData: function(chainId) {
      const chainData = supportedChains.filter(
        (chain) => chain.chain_id === chainId
      )[0];

      if (!chainData) {
        throw new Error("ChainId missing or not supported");
      }
      // const API_KEY = process.env.REACT_APP_INFURA_ID;
      const API_KEY = "89a648e271d54224ba4827d348cbaa54";
      if (
        chainData.rpc_url.includes("infura.io") &&
        chainData.rpc_url.includes("%API_KEY%") &&
        API_KEY
      ) {
        const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);
        return {
          ...chainData,
          rpc_url: rpcUrl,
        };
      }

      return chainData;
    },

    getProviderOptions: function() {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            // infuraId: process.env.REACT_APP_INFURA_ID
            infuraId: "89a648e271d54224ba4827d348cbaa54",
          },
        },
        torus: {
          package: Torus,
        },
      };
      return providerOptions;
    },
    async search() {
      if (await this.checkUserExists(this.input_lock_args))
        this.$router.push({
          name: "CycleDetail",
          params: {
            lock_args: this.input_lock_args,
            cycle_id: this.input_cycle_id,
          },
        });
      else this.$message("User does not exist");
    },
    async test() {},

    notifiy(msg, type) {
      this.$notify({
        title: type,
        message: msg,
        showClose: false,
      });
    },
    logout: async function() {

      if (window._PWCore) {
        this.pw = {};
        // web3Modal: null,
        (this.chainId = 1), (this.builder = {});
        await PWCore.provider.close();
        await this.web3Modal.clearCachedProvider();
      }

      if (window.ws) {
        window.ws.close();
      }

      window.localStorage.setItem("vuex", "");
      this.$store.dispatch("resetAllState");
    },

    connectWeb3: async function(provider) {
      console.debug("Trying to connect web3");
      
      const web3 = new Web3(provider);
      window._web3 = web3;
      this.pw = await new PWCore(RICH_NODE_RPC_URL).init(
        new Web3ModalProvider(web3),
        new Vuex_Collector(this.$store)
      );
      window._PWCore = PWCore;
      window.ppw = this.pw;
    },
    login: async function(wallet) {
      window.localStorage.setItem("vuex", "");
      this.$store.dispatch("resetAllState");
      console.log("clear old status...");

      console.log("getting wallet auth...");

      this.updateWallet(wallet);
      this.dialogSelectWallet = false;
      try {
        if (wallet === "eth") {
          
          
          await this.web3Modal.clearCachedProvider();
          const provider = await this.web3Modal.connect();
          this.$parent.loadings = true;
          await this.connectWeb3(provider);

        } else if (wallet === "ckb") {
          this.$parent.loadings = true;
          await getWalletAuth();

        }

        console.log("logged in");
      } catch (error) {
        console.error("Conncet wallet error", error);

        this.notifiy("Failed to connect to wallet", "Error");
        this.$parent.loadings = false;
        return;
      }

      this.walletConnect(true);
      console.log("getting user  onchain info");

      try {
        await this.$store.dispatch("getUser");

        this.user_ds;
        let user_ds = new DataServer(this.$store, this.user_lock_args);
        //let data_setter = new DataSetter(user_ds)

        //获取用户自己的access_token

        await user_ds.getAccessToken();

        //获取服务器信息
        let res = await user_ds.getDataServer();
        console.log(res);

        if (res === null) {
          console.log("new user to  Data Server");
          this.dialogUpdateDataServer = true;
        } else {
          await user_ds.getDataserverAuth();
          this.$message({
            message: "Successfully connected to the server",

            type: "success",
          });
          this.dataServerConnect(true);

          this.$store
            .dispatch("getUserProfile", this.user_lock_args)
            .then((res) => {
              if (res) {
                console.log(this);
                this.loginToCkplanet();
              } else this.dialogNewUser = true;
              // TODO 开始接受信息的循环
            })
            .catch((e) => {
              throw e;
            });
        }

        this.$parent.loadings = false;

        this.notifiy("Successfully connected to the wallet", "Info");
        this.dialogSelectWallet = false;
      } catch (error) {
        this.$parent.loadings = false;
        this.notifiy("Failed to connect to wallet", "Error");

        console.error(error);
      }
    },

    loginToCkplanet: function() {
      console.log("logged to ckplanet");
      this.getManageCycles(this.user_lock_args).catch((e) =>
        console.error("Failed to get user-managed planets", e)
      );
      this.getJoinCycles(this.user_lock_args)
        .then(() => {
          this.$watch(function() {
            return this.user_joined_cycles_index.length;
          }, this.process_cycles_change);
        })
        .catch((e) =>
          console.error("Failed to get user-joined planets", e)
        );
      this.connect_ws();
    },
    process_cycles_change: function(n, o) {
      let s = n - o;
      if (s > 0) {
        console.debug(`[Watcher] user_joined_cycles_index add detected`);
        for (let i = o - 1; i < n; i++) {
          let cycle = this.user_joined_cycles_index[i];

          this.getCycle({
            lock_args: cycle.lock_args,
            cycle_id: cycle.cycle_id,
          });
        }
      }
    },
    finalizeUpdateDataServer: function() {
      if (this.ckplanet.data_server_connected) {
        this.dialogUpdateDataServer = false;
        if (!this.$store.getters.userProfile(this.user_lock_args))
          this.dialogNewUser = true;
      } else this.loginToCkplanet();
    },

    finalizeNewUser: function() {
      this.dialogNewUser = false;
      this.loginToCkplanet();
    },

    formatCkb: function(value) {
      return formatCkb(value);
    },
  },
};
</script>

<style>

.data_server_ip{
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
}

#topbar {
  background-color:#409d9e;
  min-height: 70px;
  text-align: center;
  color: white;
}

.toggleBtn{
  width:100%;
  
}

.toggleBtnFont{
  font-weight: 600;
}

.infoRow {
padding: 2px;
}

.infoRowLabel {

  text-align: right;
  align-self: flex-end;
}


.infoRowContent {
  font-weight: 700;

}

#brandtext {
  font-size: 30px;
  font-weight: bold;
  color: white;
}
</style>
