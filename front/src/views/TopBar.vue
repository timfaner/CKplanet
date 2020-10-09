<template>
    <b-navbar  class="" toggleable="lg"  sticky fixed="top" type="dark" variant="info">
        <b-navbar-brand class="col-md-1 col-lg-2" href="#">CKPlanet</b-navbar-brand>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="col-md-8 col-sm-4">
            <b-form-input size="md" class="mr-2 my-2"  placeholder="Search"></b-form-input>
            <b-button size="md" class="my-2 mr-auto" type="submit">Search</b-button>
        </b-navbar-nav>
        <b-button   @click.prevent="test()" size="md" class="ml-auto">测试</b-button>
        <b-button v-b-modal.modal-1 size="md" class="ml-auto">登陆</b-button>
            
        <el-dialog  :visible.sync="dialogNewUser" append-to-body>
          <NewUserGuide></NewUserGuide>
          <div slot="footer" class="dialog-footer">
          <el-button @click="dialogNewUser = false">取 消</el-button>
          <el-button type="primary" @click="dialogNewUser = false">确 定</el-button>
          </div>
        </el-dialog>

        <b-modal    id="modal-1" title="输入登陆信息" centered>
            <b-container fluid>
            <b-row class="mb-3">
            <b-col>
            <b-dropdown block  menu-class="w-100" id="dropdown-wallet"  :text=walletname class="mx-auto">
                <b-dropdown-item  @click.prevent="connectWallet()" v-model="walletname" >Keypering</b-dropdown-item>
            </b-dropdown>
            </b-col>
            </b-row>
            <b-col>
            <el-link :href="'https://explorer.nervos.org/address/'+address" >{{address}}</el-link>
            </b-col>
            <el-collapse-transition>
            <b-row class="my-3" v-show="showed">
            <b-col>
            <b-dropdown  block menu-class="w-100" id="dropdown-dataserver"  text="选择数据服务器" class="mx-auto">
                <b-dropdown-item href="#">CKdata</b-dropdown-item>
            </b-dropdown>
            </b-col>
            </b-row>
            </el-collapse-transition>
            
            </b-container>
        </b-modal>
    </b-navbar>
</template>


<script>






import { textToHex,formatCkb } from '@/ckb/utils'
import {sha256,generatePrivKey,signData,verifyData,getPubKey} from '@/ckb/crypto'
import { getCellsByTypeScript,getAuth, jointTx,sendTx} from '../ckb/transaction'
import NewUserGuide from "@/components/NewUserGuide.vue"
import {generateAESKey, encryptData_c,decryptData_c} from "@/ckb/ckplanet"
import {DATASERVER_INFO,DATA_INTEGRITY} from "@/ckb/const"


export default {
    name: 'TopBar',
    data: function () {
        return {
        //hashfunction,
        dialogNewUser: false,
        generateAESKey, encryptData_c,decryptData_c,
        sha256,generatePrivKey,signData,verifyData,getPubKey,
        walletname:"选择钱包",
        showed:false,
        lockScript: undefined,
        lockHash: '',
        emptyCells: [],
        filledCells: [],
        summary: {
            inuse: 0,
            free: 0,
            capacity: 0,
        },
        showModel: false,
        editData: '',
        
        }
  },
    computed: {
    address: function (){return this.$store.state.user_chain_info.address}
  },
    components: {
      NewUserGuide,
    },
    methods:{
    
    async test(){


      let cells = getCellsByTypeScript(
        this.$store.state.user_cells.filled_cells,
        DATA_INTEGRITY.script,
        textToHex("app1"))


      let tx =  jointTx(
        this.$store.state.user_cells.empty_cells,
        cells[0],
        "delete",
        textToHex("testtest"),
        this.$store.state.user_chain_info.lock_script,
        DATA_INTEGRITY,
        textToHex("app1")
      )
      
      let res = await sendTx(tx,this.$store.state.user_chain_info.lock_hash)
      console.log(res)
      DATASERVER_INFO,DATA_INTEGRITY
    },

    notifiy(msg,type) {
        this.$notify.success({
          title: type,
          message: msg,
          showClose: false
        });
      },
    

    connectWallet: async function (){
      this.walletname="Keypering"
      try {
        this.$parent.loadings=true 

        console.log("getAuth")
        await getAuth()
        await this.$store.dispatch('getUser')

        this.$parent.loadings=false
        this.notifiy("连接钱包成功","Info")
        this.showed = true

      } catch (error) {
        this.$parent.loadings=false
        console.error(error)
      }
    },

    connectDataserver: function(){

    },

    formatCkb: function (value) {
      return formatCkb(value)
    },
    },

}
</script>