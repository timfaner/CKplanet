<template>
    <div>

        <div class="container row">
            <el-avatar :src="profile.avatar_url" :size="100"></el-avatar>
            <div class="col">
                <h4> {{profile.cycle_name}} </h4>
                <h6> {{profile.introduction}} </h6>
            </div>

            <i v-if="profile.type==='close'" class="el-icon-lock">Closed </i>
            <i v-if="profile.type==='open'" class="el-icon-unlock">Opened </i>
            
            <div class="col ml-auto">
                <el-button @click="joinCycle">  Join Cycle </el-button>
            <el-button @click="dialogPublish=true"> Share your thoughts </el-button>
            <el-button @click="dialogUpdateCycleProfile=true"> Settings </el-button>

            <input v-model="userToAdd" placeholder="输入想添加的用户的lock args">  
            <el-button @click="addUser"> Add user </el-button>
            </div>
        </div>
        <el-dialog title="Share your thoughts" :visible.sync="dialogPublish">
            <PublishCycleContent v-on:closedialog="dialogPublish=false" mode="create" :cycleid="cycle_id"></PublishCycleContent>
            <div slot="footer"  class="dialog-footer">
            </div>
        </el-dialog>

        <el-dialog title="Update cycle settings" :visible.sync="dialogUpdateCycleProfile">
            <UpdateCycleProfile v-on:closedialog="dialogUpdateCycleProfile=false" mode="update" :cycleid="this.cycle_id"></UpdateCycleProfile>
            <div slot="footer"  class="dialog-footer">
            </div>
        </el-dialog>

        <el-tabs>

            <el-tab-pane label="Posts">
                <ContentItem v-for="content in contents"
                :key="content.time"
                :time="content.time"
                :title="content.title"
                :content="content.content"
                :content_id="content.content_id"
                :cycle_id="cycle_id"
                :lock_args="lock_args"
                ></ContentItem>

            </el-tab-pane>
            <el-tab-pane label="Members">
            </el-tab-pane>
            <el-tab-pane label="Joined requests">
            </el-tab-pane>

        </el-tabs>

    </div>

    
</template>

<script>
import { mapActions, mapState } from 'vuex'


import PublishCycleContent from "../components/PublishCycleContent.vue"
import UpdateCycleProfile from "../components/UpdateCycleProfile.vue"
import ContentItem from "../components/ContentItem.vue"
import {getCycleTemplate,getDataID,encryptCycleToken,inTokenList} from "@/ckb/ckplanet.js"

import {DataServer} from "@/ckb/data_server"
import {DataSetter } from "@/ckb/data_handler"



export default {
    name:"CycleDetail",
    data:function(){
        return{
            data:"1",
            dialogPublish:false,
            dialogUpdateCycleProfile:false,
            userToAdd:'',
        }
    },
    components:{
        UpdateCycleProfile,
        PublishCycleContent,
        ContentItem
    },
    created (){
        this.fetchData()
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData'
    },
    computed:{
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
            "checkUserExists"



        ]),
        addUser: async function(){
            try {
                let exists = await this.checkUserExists(this.userToAdd)
                if(!exists){
                    this.$message("用户" + this.userToAdd + "不存在")
                    return
                }
                await this.updateTokenList()
                await this.addUserToUserList()
                //更新圈子信息
                await this.getCycle({
                    lock_args:this.lock_args,
                    cycle_id:this.cycle_id})
            } catch (error) {

                //错误显示
                console.error(error)
            }

            
        },



        addUserToUserList:async function(){
            try{

                let user_list  = this.cycle.user_lists

                if(user_list.includes(this.userToAdd))
                    return

                user_list.push(this.userToAdd)
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
        updateTokenList:async function(){
            try {
                
                if(this.cycle.cycle_profile.type==="open"){
                    console.log("current cycle is open")
                    return
                }

                await this.getDataServerInfo(this.userToAdd)
                let access_token_items = this.$store.getters.getSthFromPool(this.userToAdd,"access_token")
                let pk = access_token_items.access_token_public_pk
                let sk = this.$store.state.user_id_public.sk

                let token_list = this.cycle.token_list

                if(inTokenList(this.userToAdd,token_list,pk,sk)){
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
        // TODO join\leave\dispend 。。。
        let user_ds = new DataServer(this.$store,this.user_lock_args)
        let data_setter = new DataSetter(user_ds)
        
        let joined_cycle = this.$store.state.ckplanet.user_joined_cycles_index

        if(this.lock_args === this.user_lock_args){
            this.$$message("不能加入自己的圈子")
            return
        }
        if(this.$store.getters.cycle_joined_status(this.lock_args,this.cycle_id) !=="disjointed"){
                this.$message("已经发送过请求/加入圈子啦")
                return
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

            } catch (error) {
                console.log(error)
            }


            
        }
    },

}
</script>

                    let res = await this.getCycle({
                        lock_args:this.lock_args,
                        cycle_id:this.cycle_id
                    })
                    if(res===null){
                        return
                    }