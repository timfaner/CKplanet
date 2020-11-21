<template>
  <div class="topbar">
    <el-row>
      <el-col class="col-md-1 col-lg-2 ">CKPlanet</el-col>
      <el-col :span="6">
        <el-input placeholder="lock_args" v-model="input_lock_args"> </el-input>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="cycle_id" v-model="input_cycle_id"> </el-input>
      </el-col>
      <el-col :span="6">
        <el-button @click="search()">
          Search
        </el-button>
        <el-button v-if="!wallet_connected" @click="dialogSelectWallet = true">

          Connect wallet
        </el-button>

        <el-button v-if="wallet_connected" @click="dialogSelectWallet = true">
          Switch wallet
        </el-button>

        <el-button v-if="walletConnect" @click="dialogUpdateDataServer = true">
          Switch data server
        </el-button>
        <el-button @click="logout()"> quit</el-button>

        <div>
          <p>{{ user_address }}</p>
        </div>
      </el-col>

      <el-dialog
        :visible.sync="dialogUpdateDataServer"

        title="Connect to data server"

        append-to-body
        :close-on-click-modal="false"
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

import Vuex_Collector from "@/ckb/vuex-collector"
import UpdateUserProfile from "@/components/UpdateUserProfile.vue";
import UpdateDataServer from "@/components/UpdateDataServer.vue";
import {RICH_NODE_RPC_URL} from "@/ckb/const"

import PWCore, {

  Web3ModalProvider,
  //Amount,
  //AmountUnit,
  //Cell,
  // EthSigner,
} from "@lay2/pw-core";

//import SDCollector from "./sd-collector";
//import SDBuilder from "./sd-builder";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import supportedChains from "@/eth/chains";
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";

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
  computed: mapState({
    user_address: (state) => state.user_chain_info.address,
    user_lock_args: (state) => state.user_chain_info.lock_args,
    ckplanet: (state) => state.ckplanet,
    user_managed_cycles_index: (state) =>
      state.ckplanet.user_managed_cycles_index,
    wallet_connected: (state) => state.ckplanet.wallet_connected,
    data_server_connected: (state) => state.ckplanet.data_server_connected,
  }),

  async mounted() {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
    });

    if (this.web3Modal.cachedProvider) {
      this.connectWeb3();
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
      this.pw = {};
      // web3Modal: null,
      (this.chainId = 1), (this.builder = {});
      await PWCore.provider.close();
      await this.web3Modal.clearCachedProvider();

      window.localStorage.setItem("vuex", "");
      this.$store.dispatch("resetAllState");
    },

    connectWeb3 : async function(){
      console.debug("Trying to connect web3")
      const provider = await this.web3Modal.connect();
      const web3 = new Web3(provider);
      window._web3 = web3;
                this.pw = await new PWCore(RICH_NODE_RPC_URL).init(
            new Web3ModalProvider(web3),
            new Vuex_Collector(this.$store)
          );
          window._PWCore = PWCore;
          window.ppw = this.pw
    },
    login: async function(wallet) {
            window.localStorage.setItem("vuex", "");
      this.$store.dispatch("resetAllState");
      console.log("clear old status...");


      console.log("getting wallet auth...");

      

      this.updateWallet(wallet);

      try {
        if (wallet === "eth") {
          this.dialogSelectWallet = false;
          await this.connectWeb3()

        } else if (wallet === "ckb") {
          this.$parent.loadings = true;
          await getWalletAuth();
        }

        console.log("logged in");
      } catch (error) {
        console.error("Conncet wallet error", error);

        this.notifiy("Failed to connect to wallet", "Error");

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

        this.$message.error("Failed to get user-managed circles", e)
      );
      this.getJoinCycles(this.user_lock_args).catch((e) =>
        this.$message.error("Failed to get user-joined circles", e)

      );
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
.topbar {
  background-color: aquamarine;
}
</style>
