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



import { formatCkb } from '@/ckb/utils'
//import {hashfunction,generatePrivKey,signData,verifyData} from '@/ckb/crypto'
import { getAuth, } from '@/ckb/transcation'


export default {
    name: 'TopBar',
    methods:{

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

        console.log(getAuth)
        await getAuth().then(this.$store.dispatch('getUser'))

        this.$parent.loadings=false
        this.notifiy("连接钱包成功","Info")
        this.showed = true

      } catch (error) {
        console.error(error)
      }
    },

    connectDataserver: function(){

    },

    formatCkb: function (value) {
      return formatCkb(value)
    },
    },
    data: function () {
        return {
        //hashfunction,
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
  }
}
</script>