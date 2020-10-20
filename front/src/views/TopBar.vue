<template>
    <b-navbar  class="" toggleable="lg"  sticky fixed="top" type="dark" variant="info">
        <b-navbar-brand class="col-md-1 col-lg-2" href="#">CKPlanet</b-navbar-brand>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="col-md-8 col-sm-4">
            <b-form-input  size="md" class="mr-2 my-2"  placeholder="Search"></b-form-input>
            <b-button size="md" class="my-2 mr-auto" type="submit">Search</b-button>
        </b-navbar-nav>
        

        <el-button @click="dialogSelectWallet = true"> 连接钱包 </el-button>
         

        
        <div  >   <p> {{user_address}} </p>
                <el-button @click="dialogUpdateDataServer=true"> 数据服务器 </el-button>
        </div>
            

        <el-dialog  :visible.sync="dialogUpdateDataServer" title="连接数据服务器" append-to-body>
          <UpdateDataServer v-on:closedialog="finalizeUpdateDataServer"></UpdateDataServer>
          <div  slot="footer" class="dialog-footer">
          </div>
        </el-dialog>

        
        <el-dialog  :visible.sync="dialogNewUser" title="新建用户信息" append-to-body>
          <UpdateUserProfile v-on:closedialog="finalizeNewUser"></UpdateUserProfile>
          <div  slot="footer" class="dialog-footer">
          </div>
        </el-dialog>


        <el-dialog :visible.sync="dialogSelectWallet" title="选择钱包" :modal=false >
          <el-button @click="login()">  Keypering</el-button>
          <div slot="footer" class="dialog-footer">
          </div>
        </el-dialog>



    </b-navbar>
</template>


<script>



import { formatCkb } from '@/ckb/utils'
import { getWalletAuth} from '../ckb/transaction'

import {} from "@/ckb/ckplanet"
import {mapState,mapMutations, mapActions} from "vuex"
import {DataServer} from "@/ckb/data_server"
//import {DataSetter } from "@/ckb/data_handler"

import UpdateUserProfile from "@/components/UpdateUserProfile.vue"
import UpdateDataServer from "@/components/UpdateDataServer.vue"




export default {
    name: 'TopBar',
    data: function () {
        return {
        data_server_ip:'',
        dialogSelectWallet : false,
        dialogUpdateDataServer: false,
        dialogNewUser: false,
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
    computed: mapState({
        user_address: state=>state.user_chain_info.address,
        user_lock_args : state => state.user_chain_info.lock_args,
        ckplanet : state => state.ckplanet,
        user_managed_cycles_index: state => state.ckplanet.user_managed_cycles_index
      }),
    components: {
      UpdateUserProfile,
      UpdateDataServer,
    },
    methods:{

      ...mapMutations([
        "walletConnect",
        "dataServerConnect"
      ]),
      ...mapActions([
        "getManageCycles",
        "getCycle"
      ]),
    
    async test(){

    },

    notifiy(msg,type) {
        this.$notify.success({
          title: type,
          message: msg,
          showClose: false
        });
      },
    

    login: async function (){
      this.walletname="Keypering"
      try {
        this.$parent.loadings=true 

        console.log("getting wallet auth...")
        await getWalletAuth()
        this.walletConnect(true)

        console.log("getting user  onchain info")
        await this.$store.dispatch('getUser')
        
        this.user_ds 
        let user_ds = new DataServer(this.$store,this.user_lock_args)
        //let data_setter = new DataSetter(user_ds)

        //获取用户自己的access_token

        await user_ds.getAccessToken()


        //获取服务器信息
        let res = await user_ds.getDataServer()
        console.log(res)

        if(res === null){
          console.log("new user to  Data Server")
          this.dialogUpdateDataServer = true
        }

        else{
          await user_ds.getDataserverAuth()
          this.$message({
            message: "成功连接服务器",
            type:"success"
          })
          this.dataServerConnect(true)


          
          this.$store.dispatch("getUserProfile",this.user_lock_args).then(
            (res) => {
              if(res){
                console.log(this)
                this.loginToCkplanet()}
              else
                this.dialogNewUser = true
              // TODO 开始接受信息的循环
            }).catch( e=> {throw(e)})
          
        }


        this.$parent.loadings=false
        this.notifiy("连接钱包成功","Info")
        this.dialogSelectWallet=false

      } catch (error) {
        this.$parent.loadings=false
        this.notifiy("连接钱包失败","Error")
        console.error(error)
      }
    },

    loginToCkplanet :   function(){
      console.log("logged to ckplanet")
      this.getManageCycles()
      

    },

    finalizeUpdateDataServer: function(){
      if(this.ckplanet.data_server_connected){
        this.dialogUpdateDataServer = false
        if(! this.$store.getters.userProfile(this.user_lock_args))
          this.dialogNewUser = true
        }
        else
          this.loginToCkplanet()
        
    },

    finalizeNewUser: function(){
      this.dialogNewUser = false
      this.loginToCkplanet()
    },

    formatCkb: function (value) {
      return formatCkb(value)
    },
    },

}
</script>