<template>
<div id="PublishCycleContent">

    <el-form :model="form">
        <el-form-item label="Planet" :label-width="formLabelWidth">
          <el-select v-model="cycle_id" placeholder="Choose a planets">
            <el-option
              v-for="cycle in cycles.ego_cycles"
              :key="cycle.cycle_id"
              :label="cycle.cycle_profile.cycle_name"
              :value="cycle.cycle_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="!preview" label="Title" :label-width="formLabelWidth">
          <el-input v-model="title" placeholder="Input title" :maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item v-if="!preview" label="Content">
          <el-input type="textarea" :rows="10" v-model="content" placeholder="Wirte down your thougths, support markdown syntax"></el-input>
        </el-form-item>

        <div v-if="preview" v-html="compiled_markdown"> 
        </div>
        <el-form-item >
          <el-button type="info" @click="togglePreview()">{{btn_display}}</el-button>
          <el-button type="primary" @click="Update()">Publish</el-button>
        </el-form-item>
        


    </el-form>



</div>
</template>

<script>

import { makeId} from "@/ckb/utils"

import {DataServer} from "@/ckb/data_server"
import {DataSetter } from "@/ckb/data_handler"
import { getDataTemplate,getDataID,encryptContent } from "@/ckb/ckplanet"
import {mapState} from "vuex"






export default {
  name: 'PublishCycleContent',
    computed: {
      btn_display :function () {
        if (this.preview)
          return "Back"
        else
          return "Preview"
      },
        compiled_markdown :function () {
      return window.marked(this.content,{ sanitize: true })
    },
        cycle_id : {
          get: function(){ 
            if(this.follow)
              return this.cycleid
            else
              return this.cycle_id_tmp},
          set: function(value){
            this.follow = false
            this.cycle_id_tmp = value
          }},  

        ...mapState({
          user_address: state=>state.user_chain_info.address,
          user_lock_args : state => state.user_chain_info.lock_args,
          cycles : function(state){
          let user_lock_args = state.user_chain_info.lock_args
          let cycles = state.ckplanet.cycles_pool
          let ego_cycles = []
          let autrui_cycles = []
          let tmp = []
          for(const lock_args in cycles){
            for(const cycle_id in cycles[lock_args]){
              let cycle = cycles[lock_args][cycle_id]
              cycle = {...cycle,...{lock_args,cycle_id}}
              tmp.push(cycle)
            }
          }
          ego_cycles = tmp.filter(function(cycle){
            return cycle.lock_args===user_lock_args
          })
          autrui_cycles = tmp.filter(function(cycle){
            return cycle.lock_args!==user_lock_args
          })
          return {ego_cycles,autrui_cycles}
        },
          cycle_publish_to:function(state){
          return state.ckplanet.cycles_pool[this.user_lock_args][this.cycle_id]
          }
      })
      
      },
  methods:{
    togglePreview : function(){
      this.preview = !this.preview
    },
    Update : async function(){
      if(this.cycle_id ===""){

        this.$message("Please choose a planet")
        return
      }
      let user_ds = new DataServer(this.$store,this.user_lock_args)
      let data_setter = new DataSetter(user_ds)

      let content_id = ''
      let contents_list = this.cycle_publish_to.contents_list

      if(this.mode==="create")
          do{
            content_id = makeId(8)
            console.log("Generate content_id")}
          while( contents_list.includes(content_id))
          

      else if(this.mode==="update")
          content_id =this.content_id

      let data_type = "cycle_content"
      let content = getDataTemplate(data_type)


      content.content = this.content
      content.title = this.title
      content.time = Date.now()

      contents_list.push(content_id)

      let cycle_id = this.cycle_id
      
      
      let aes_key = this.cycle_publish_to.aes

      let data_content = encryptContent(content,aes_key)
      let data_id_content = getDataID('cycle_content',cycle_id,content_id)
      let data_contents_list = contents_list
      let data_id_contents_list = getDataID('cycle_contents_list',cycle_id)

      
      let access=''
      if(this.cycle_publish_to.cycle_profile.type ==="open" )
          access="public"
      else if (this.cycle_publish_to.cycle_profile.type === "close")
          access="private"
      else
          throw("Unknow cycle type: "+ this.cycle_publish_to.cycle_profile.type)
      


      try {
        
        await data_setter.postData(
          data_contents_list,
          data_id_contents_list,
          access,
          false,
          ''
        )
        await data_setter.postData(
          data_content,
          data_id_content,
          access,
          false,
          ''
        )

        this.$message({
            message: 'success '+ this.mode + this.cycle_publish_to.cycle_profile.cycle_name + ' content',
            type: 'success'
          })



        if(this.mode==="create"){
            this.$store.dispatch("getContentsList",
            {lock_args:this.user_lock_args,
            cycle_id:cycle_id,}

        ).catch((e)=>{throw(e)})
        }

        this.$store.dispatch("getContent",
          {lock_args:this.user_lock_args,
          cycle_id:cycle_id,
          content_id:content_id}
        ).catch((e)=>{throw(e)})
        this.$emit("closedialog")
      }
       catch (error) {
        this.$message.error(error)
      }
      
    },

  },
  data: function(){
    return{
      form:null,
      formLabelWidth:'100',
      cycle_id_tmp : '0x',
      title:'',
      content:'',
      value:'',
      follow:true,
      preview : false
    }
  },
  props: {
    cycleid:{
      type:String,
      default:""
    },
    mode:{
      type:String,
      default:"create",
      required:true
    }
    },
}
</script>


<style scoped>

#PublishCycleContent {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }


  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .profile {
    text-align: left;
  }

    .minbutton {
    min-width: 150px;
    display: inline-block;
  }

</style>
