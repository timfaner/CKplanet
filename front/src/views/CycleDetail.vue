<template>
    <div>

        <div class="container row">
            <el-avatar :src="profile.avatar_url" :size="100"></el-avatar>
            <div class="col">
                <h4> {{profile.cycle_name}} </h4>
                <h6> {{profile.introduction}} </h6>
            </div>
            
            <div class="col ml-auto">
            <el-button @click="dialogPublish=true"> Share your thoughts </el-button>
            <el-button @click="dialogUpdateCycleProfile=true"> Settings </el-button>
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
import {getCycleTemplate,getDataID} from "@/ckb/ckplanet.js"

import {DataServer,DataSetter} from "@/ckb/data_handler"



export default {
    name:"CycleDetail",
    data:function(){
        return{
            data:"1",
            dialogPublish:false,
            dialogUpdateCycleProfile:false
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
        
        ...mapState({
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
            return contents}
    },
    methods:{
        ...mapActions([
            "getCycle",
            "getCycleContents",


        ]),
        joinCycle:function(){
        // TODO join\leave\dispend 。。。
        let user_ds = new DataServer(this.$store,this.user_lock_args)
        let data_setter = new DataSetter(user_ds)
        let joined_cycle = this.$store.ckplanet.user_joined_cycles_index
            if(this.cycle.joined_status==="disjointed"){
                joined_cycle.push({
                    lock_args:this.lock_args,
                    cycle_id:this.cycle_id})
                
                }
        let data_type = "user_joined_cycle_list"
        let data_id = getDataID(data_type)

        data_setter.postData(
            joined_cycle,
            data_id,
            "public",
            false,
            ""
        ).catch((e) => console.error(e))
        //TODO 发送给cycle 拥有者

        //TODO 更新列表，更新cycle状态

        },
        test:function(){
            this.PublishCycleContent
        },
        fetchData:async function(){
            console.log("fetch date of " + this.lock_args + " "+ this.cycle_id)
//添加loading遮罩与错误提醒
            try {
                let pools = this.$store.state.ckplanet.cycles_pool
                if(this.lock_args in pools)
                    if(this.cycle_id in pools[this.lock_args]){
                    let res = await this.getCycle({
                        lock_args:this.lock_args,
                        cycle_id:this.cycle_id
                    })
                    if(res===null){
                        return
                    }
                }
                this.getCycleContents({
                    lock_args:this.lock_args,
                    cycle_id:this.cycle_id
                    }).catch((error)=> console.error("Loding contents error",error))
            } catch (error) {
                console.log(error)
            }


            
        }
    },

}
</script>