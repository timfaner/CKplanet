<template>
    <div class="container col-11">


    <el-row type="flex" align="top"   :gutter="0">
      <el-col :span="2">
        <el-avatar
          shape="square"
          :size="100"
          :src="profile.avatar_url"
        ></el-avatar>
      </el-col>

      <el-col style="margin-left: 20px;" :span="17" :offset="0" class="info">
        <el-row type="flex">
          <el-col :span="3" >

            <h5>{{ profile.cycle_name }} </h5>

          </el-col >
          <el-col :span="2">
              <el-tooltip class="item" effect="dark" content="This is a private planet" placement="bottom">
                        <el-button v-if="profile.type==='close'" size="mini" class="el-icon-lock">private</el-button>
                    </el-tooltip>

          </el-col>

        </el-row>

        <el-row
          >
          <el-col :span="3">
          <h6 class="ml-auto"> Planet id: </h6>
          </el-col>
          <el-col :span="2">
          <h6 class="cycle_id">{{ cycle_id }} 
                        <el-tooltip >
            <div slot='content'>
              Using lock_args and Planet id to search Planet
              <br/>
              Tuple like &lt;lock_args:planet_id&gt; is unique
            <br/>
            <span class="cycle_id">
            Tuple is &lt;{{lock_args}}:{{cycle_id}}&gt;
            </span>
            </div>
            <span class="el-icon-question"></span>
          </el-tooltip> </h6>
          </el-col>
          
        </el-row>
        
            <p style=" word-break: break-all; white-space: normal;"> {{profile.introduction}} </p>
        
      </el-col>
        <el-col :span="3"  :offset="0" >
                <el-button type="info" class="grpbtn" v-if="user_lock_args!==lock_args && cycle_joined_statue==='disjointed'" @click="joinCycle">  Join Cycle </el-button>
                <el-button type="success" class="grpbtn" v-if="user_lock_args!==lock_args && cycle_joined_statue==='pending'"   disabled @click="joinCycle">  Pending </el-button>
                <el-button type="success" class="grpbtn" v-if="user_lock_args!==lock_args && cycle_joined_statue==='joined'"   disabled @click="joinCycle">  Joined </el-button>
                <el-button type="info" class="grpbtn" v-if="user_lock_args===lock_args" @click="dialogPublish=true"> Share your thoughts </el-button>
                <el-button type="info" class="grpbtn" v-if="user_lock_args===lock_args" @click="dialogUpdateCycleProfile=true"> Edit Planet </el-button>
        </el-col>
        </el-row>
        <el-dialog title="Share your thoughts" :visible.sync="dialogPublish" :close-on-click-modal='false' width="40%">
            <PublishCycleContent  v-if="dialogPublish" v-on:closedialog="dialogPublish=false" mode="create" :cycleid="cycle_id"></PublishCycleContent>
            <div slot="footer"  class="dialog-footer">
            </div>
        </el-dialog>

        <el-dialog title="Update cycle settings" :visible.sync="dialogUpdateCycleProfile" :close-on-click-modal='false'>
            <UpdateCycleProfile v-if="dialogUpdateCycleProfile" v-on:closedialog="dialogUpdateCycleProfile=false" mode="update" :cycleid="this.cycle_id"></UpdateCycleProfile>
            <div slot="footer"  class="dialog-footer">
            </div>
        </el-dialog>

        <el-tabs>

            <el-tab-pane >
                <span slot="label"><i class="el-icon-orange"></i> Posts</span>
                <ContentItem v-for="content in contents"
                :key="content.time"
                :content_id="content.content_id"
                :cycle_id="cycle_id"
                :lock_args="lock_args"
                ></ContentItem>

            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-s-custom"></i> Members ({{cycle.user_lists.length}}) </span>
                <div>
                    <div v-if="user_lock_args===lock_args">
                <input  v-model="userToAdd" placeholder="Input users' lock args">  
                <el-button @click="addUserAndSendApproval(userToAdd)"> Add user </el-button>
                    </div>
                <MemberItem v-for="user in cycle.user_lists"
                :key="user"
                :lockargs="user"
                ></MemberItem>

                </div>
            </el-tab-pane>
            <el-tab-pane v-if="user_lock_args===lock_args && profile.type==='close'">
                <span slot="label"><i class="el-icon-news"></i> Join requests ({{join_applys.length}}) </span>
                  <div class="container">
                    <div  v-for="apply in join_applys" :key="apply.from" class="px-4 py-2 my-2 row" style="border-radius: 10px;background-color: #EBEEF5">
                        <el-avatar shape="square" :size="50" :src="user_profile(apply.from).avatar_url"></el-avatar>
                        <span class="px-2 py-2 t1" > {{user_profile(apply.from).nickname}} applys to join  planet  </span>
                        <el-button class="ml-auto" @click.prevent="finishiApproval({apply,result:false})" type="danger">refuse</el-button>
                        <el-button type=primary @click.prevent="finishiApproval({apply,result:true})">agree</el-button>
                    </div>
                </div>
            </el-tab-pane>

        </el-tabs>
    </div>

    
</template>

<script>
import { mapActions, mapState } from 'vuex'


import PublishCycleContent from "../components/PublishCycleContent.vue"
import UpdateCycleProfile from "../components/UpdateCycleProfile.vue"
import ContentItem from "../components/ContentItem.vue"
import MemberItem from "../components/MemberItem.vue"
import {getCycleTemplate,getDataID,encryptCycleToken,inTokenList} from "@/ckb/ckplanet.js"

import {DataServer} from "@/ckb/data_server"
import {DataSetter } from "@/ckb/data_handler"
import {  sendApply, sendApproval } from '@/ckb/ws_client'



export default {
    name:"CycleDetail",
    data:function(){
        return{
            data:"1",
            dialogPublish:false,
            dialogUpdateCycleProfile:false,
            userToAdd:'',
            apply_count_tmp:0,
        }
    },
    components:{
        UpdateCycleProfile,
        PublishCycleContent,
        ContentItem,
        MemberItem,
    },
    created (){
        this.fetchData()
        this.$watch(
            function(){
                return this.join_applys.length
            },

            this.process_applys,
        )
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData',
    },
    computed:{
        user_profile :  () => function (lock_args) {
            if (lock_args in this.$store.state.ckplanet.user_profiles_pool)
                return this.$store.state.ckplanet.user_profiles_pool[lock_args]
            else 
                this.$store.dispatch("getUserProfile",lock_args)
            return { nickname:'',avatar_url:''} 
        },
        cycle_id: function(){return this.$route.params.cycle_id},
        lock_args: function(){return this.$route.params.lock_args},
        cycle_joined_statue : function(){return this.$store.getters.cycle_joined_status(this.lock_args,this.cycle_id)},
        
        ...mapState({
            logged_in: state => state.ckplanet.wallet_connected && state.ckplanet.data_server_connected,
            user_lock_args: (state) => state.user_chain_info.lock_args,
            cycle: function(state) {
                let pools = state.ckplanet.cycles_pool
                if(this.lock_args in pools)
                    if(this.cycle_id in pools[this.lock_args])
                        return state.ckplanet.cycles_pool[this.lock_args][this.cycle_id]
                return  getCycleTemplate()
                
                },
            join_applys: function(state){
                let applys = []
                for(let ap of state.ckplanet.join_applys){
                    if(ap.to === this.user_lock_args 
                    && ap.lock_args === this.lock_args
                    && ap.cycle_id === this.cycle_id
                    && this.lock_args !== ""){
                        applys.push(ap)
                    }
                }
                return applys
            }
            }),

            profile: function(){ return this.cycle.cycle_profile},
            contents: function(){ 
                let contents = []
                for(const content_id in this.cycle.contents){
                    
                    contents.push(
                        {...this.cycle.contents[content_id],content_id}
                    )
                }
                return contents},
            
    },
    methods:{
        ...mapActions([
            "getCycle",
            "getCycleContents",
            "getDataServerInfo",
            "getSthFromPool",
            "getJoinCyclesIndex",
            "checkUserExists",
            "getCycleTokenList"



        ]),
        addUserAndSendApproval: async function(user_to_add){
            sendApproval({
                from:this.user_lock_args,
                to:user_to_add,
                result:true,
                lock_args:this.lock_args,
                cycle_id:this.cycle_id
            })
            this.addUser(user_to_add).then(()=> (this.$message("Add user successed")))

        },

        finishiApproval: async function ({apply,result}) {

            sendApproval({
                from:this.user_lock_args,
                to:apply.from,
                result:result,
                lock_args:this.lock_args,
                cycle_id:this.cycle_id
            })
            this.$store.commit(
                "deleteJoinApply",
                apply
            )
            if(result){
                this.addUser(apply.from)
            }
        },

        process_applys : async function(){
            if(this.join_applys.length > this.apply_count_tmp){
                //FIXME maybe trigger recursive watch
                this.apply_count_tmp = this.join_applys.length

                console.debug('[process_applys] Begin process applys')
                if(this.profile.type === "open"){
                    
                    for(let ap of this.join_applys){
                        let user_to_add = ap.from
                        await this.addUser(user_to_add)
                        this.$store.commit(
                            "deleteJoinApply",
                            ap
                        )
                        sendApproval({
                            from:ap.to,
                            to:ap.from,
                            lock_args:this.lock_args,
                            cycle_id:this.cycle_id,
                            result:true
                        })
                        this.$notify({
                        title: 'Notification',
                        message: 'New User Joined Cycle',
                        duration: 3000
                        });
                        
                    }
                }
                else if(this.profile.type === "close"){
                        this.$notify({
                        title: 'Notification',
                        message: `${this.join_applys.length} new applys to join cycle`,
                        duration: 3000
                        });
                }
            }
            else if(this.join_applys.length <= this.apply_count_tmp){
                console.debug('[process_applys] Bypass')
                this.apply_count_tmp = this.join_applys.length
            }

        },
        updateCycle: async function(){
            console.log("Detect join statue change")
                this.getCycle({
                        lock_args:this.lock_args,
                        cycle_id:this.cycle_id})
        },
        addUser: async function(userToAdd){
            try {
                if(this.cycle.user_lists.indexOf(userToAdd) > -1){
                    console.log(`[addUser] ${userToAdd} already in user lists`)
                    return
                }
                let exists = await this.checkUserExists(userToAdd)
                if(!exists){
                    this.$message("User " + userToAdd + " not exists")
                    return
                }

                await this.updateTokenList(userToAdd)
                await this.addUserToUserList(userToAdd)
                //更新圈子信息
                await this.getCycle({
                    lock_args:this.lock_args,
                    cycle_id:this.cycle_id})
            } catch (error) {

                //错误显示
                console.error(error)
            }

            
        },



        addUserToUserList:async function(userToAdd){
            try{

                let user_list  = this.cycle.user_lists

                if(user_list.includes(userToAdd))
                    return

                user_list.push(userToAdd)
                let user_ds = new DataServer(this.$store,this.user_lock_args)
                let data_setter = new DataSetter(user_ds)


                let data_type = "cycle_users_list"
                let data_id = getDataID(data_type,this.cycle_id)

                let access_type = ""
                if(this.profile.type === "open")
                    access_type = "public"
                else if (this.profile.type === "close")
                    access_type = "private"    

                await data_setter.postData(
                    user_list,
                    data_id,
                    access_type,
                    false,
                    ""
                )


            } catch (error) {
                console.error("addUserToUserList failed",error)
                throw(error)
            }
        },
        updateTokenList:async function(userToAdd){
            try {
                
                if(this.cycle.cycle_profile.type==="open"){
                    console.log("current cycle is open")
                    return
                }

                await this.getDataServerInfo(userToAdd)
                let access_token_items = this.$store.getters.getSthFromPool(userToAdd,"access_token")
                let pk = access_token_items.access_token_public_pk
                let sk = this.$store.state.user_id_public.sk

                let token_list = this.cycle.token_list

                if(inTokenList(userToAdd,token_list,pk,sk)){
                    return
                }

                
                let aes_key = this.cycle.aes_key
                let input = {
                    lock_args: this.lock_args,
                    access_token_private:this.$store.state.user_id_private.access_token,
                    aes_key,
                    }
                let token = encryptCycleToken(input,pk,sk)
                
                token_list.push(token)
                let user_ds = new DataServer(this.$store,this.user_lock_args)
                let data_setter = new DataSetter(user_ds)


                let data_type = "cycle_tokens_list"
                let data_id = getDataID(data_type,this.cycle_id)


                await data_setter.postData(
                    token_list,
                    data_id,
                    "public",
                    false,
                    ""
                )


            } catch (error) {
                console.error("updateTokenlist failed",error)
                throw(error)
            }

        },


        joinCycle:async function(){

        let user_ds = new DataServer(this.$store,this.user_lock_args)
        let data_setter = new DataSetter(user_ds)
        
        let joined_cycle = this.$store.state.ckplanet.user_joined_cycles_index

        if(this.lock_args === this.user_lock_args){
            this.$message("Can't join cycles of yourself")
            return
        }
        switch (this.$store.getters.cycle_joined_status(this.lock_args,this.cycle_id)) {
            case 'joined':{
                this.$message("Already joined cycle")
                return
                }
            case 'pending':{
                this.$message("Already sent join request")
                return
                }
                
            default:
                break;
        }


        joined_cycle.push({
            lock_args:this.lock_args,
            cycle_id:this.cycle_id})

        let data_type = "user_joined_cycle_list"
        let data_id = getDataID(data_type)
        await data_setter.postData(
            joined_cycle,
            data_id,
            "public",
            false,
            ""
        )
        //TODO 发送给cycle 拥有者
        sendApply({
            from:this.user_lock_args,
            to:this.lock_args,
            lock_args:this.lock_args,
            cycle_id:this.cycle_id,
        })
    
        this.getJoinCyclesIndex(this.user_lock_args).catch((e) => this.$message("更新用户列表失败",e))
        
        },
        test:function(){
            this.PublishCycleContent
        },

        fetchData:async function(){
            if(this.$route.name !== "CycleDetail"){
                return
            }
            if(!this.logged_in){
                this.$message("未登录")
                return
            }
            console.log("fetch date of " + this.lock_args + " "+ this.cycle_id)
            //添加loading遮罩与错误提醒
            try {
                let pools = this.$store.state.ckplanet.cycles_pool

                let new_cycle = true
                if(this.lock_args in pools){
                    if(this.cycle_id in pools[this.lock_args])
                        new_cycle = false
                }

                if(new_cycle){
                    console.log("[fetchData] New cycle")
                    this.getCycle({
                        lock_args:this.lock_args,
                        cycle_id:this.cycle_id
                    })
                }
                
                if(this.profile.type === "open" ||  this.cycle_joined_statue==="joined" || 
                    this.user_lock_args === this.lock_args){
                        console.log("[fetchData] Get Cycle Contents for "+ this.cycle_id + " of " + this.lock_args)
                        this.getCycleContents({
                        lock_args:this.lock_args,
                        cycle_id:this.cycle_id
                            })
                        .catch((error)=> console.error("Loding contents error",error))
                            return
                        }
                if( this.cycle_joined_statue ==="pending"){
                    console.log("[fetchData] Get Cycle Token lists for "+ this.cycle_id + " of " + this.lock_args)
                    this.getCycleTokenList({
                        lock_args:this.lock_args,
                        cycle_id:this.cycle_id
                    })
                }

            } catch (error) {
                console.log(error)
            }


            
        }
    },

}
</script>

<style scoped>
.cycle_id{
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
}

.grpbtn{
    width: 100%;
    text-align: center;
    margin: 4px;
}
</style>
