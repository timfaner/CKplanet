<template>
<div id="UpdateCycleProfile">
    <el-upload
        class="avatar-uploader"
        action="''"
        :http-request="upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-progress="handleAvatarProgress"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-form :model="form">
        <el-form-item label="圈子名字" :label-width="formLabelWidth">
          <el-input v-model="cycle_name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="introduction" placeholder="请输入简介"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="close_checked">设为私有圈子</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="Update()">保存</el-button>
        </el-form-item>

    </el-form>

</div>
</template>

<script>

import { makeId} from "@/ckb/utils"
import {OSS_CONFIG} from "@/config"
import {DataServer} from "@/ckb/data_server"
import {DataSetter } from "@/ckb/data_handler"
import { getDataTemplate,getDataHash,getDataID } from "@/ckb/ckplanet"
import {mapState} from "vuex"

const OSS = require("ali-oss")


const client = new OSS(OSS_CONFIG)


export default {
  name: 'UpdateCycleProfile',
    computed: mapState({
        user_address: state=>state.user_chain_info.address,
        user_lock_args : state => state.user_chain_info.lock_args,

      }),
  methods:{

    Update : async function(){
      let user_ds = new DataServer(this.$store,this.user_lock_args)
      let data_setter = new DataSetter(user_ds)

      let data = getDataTemplate('cycle_profile')
      data.cycle_name = this.cycle_name
      data.avatar_url = this.imageUrl
      data.introduction = this.introduction
      if(this.close_checked)
        data.type = "close"
      else
        data.type = "open"

      let cycle_id = ''
      let managed_list = this.$store.state.ckplanet.user_managed_cycles_index
      if(this.mode==="create")
          do{
            cycle_id = makeId(4)
            console.log("Generate cycleid")}
          while( managed_list.includes(cycle_id))
          

      else if(this.mode==="update")
          cycle_id =this.cycleid
      
      let data_type = "cycle_profile"
      let data_id = getDataID(data_type,cycle_id)
      let data_hash = getDataHash(data_type,data)

      try {
        let tx_id = ""
        //FIXME
        await data_setter.updateDataIntegrityOnChain(
        data_id,
        data_hash)

        console.log("DataIntegrity of " + data_type + " updated")
        await data_setter.postData(
          data,
          data_id,
          'public',
          true,
          tx_id
        )

        if(this.mode === "create"){
          //更新管理列表
          managed_list.push(cycle_id)
          data_type = "user_managed_cycle_list"
          data_id = getDataID(data_type)
          data_hash = getDataHash(data_type,managed_list)

          tx_id = ''

          await data_setter.postData(
            managed_list,
            data_id,
            'public',
            true,
            tx_id
          )
        // 新建token_list
          data_type = "cycle_tokens_list"
          data_id = getDataID(data_type,cycle_id)
          tx_id = ''

          await data_setter.postData(
            [],
            data_id,
            'public',
            true,
            tx_id
          )
        // 新建user_list
          data_type = "cycle_users_list"
          data_id = getDataID(data_type,cycle_id)
          tx_id = ''
          let access_type = ''
          if(this.close_checked)
            access_type = "private"
          else
            access_type = "public"
          await data_setter.postData(
            [],
            data_id,
            access_type,
            true,
            tx_id
          )
          data_type = "cycle_contents_list"
          data_id = getDataID(data_type,cycle_id)
          await data_setter.postData(
            [],
            data_id,
            access_type,
            true,
            tx_id
          )
        }
        this.$message({
            message: '成功'+ this.mode +'圈子信息',
            type: 'success'
          })



        if(this.mode==="create"){
            this.$store.dispatch("getManagedCyclesIndex",
          this.user_lock_args
        ).catch((e)=>{throw(e)})
        }

        this.$store.dispatch("getCycle",
          {lock_args:this.user_lock_args,cycle_id:cycle_id}
        ).catch((e)=>{throw(e)})
        this.$emit("closedialog")
      }
       catch (error) {
         console.error(error)
        this.$message.error(error)
      }
      
    },
    upload: async function(item){
        const key= "avatar/" + makeId(10) + '.jpeg'
        try {
        let result = await client.put(key, item.file);
        console.log(result);
        this.imageUrl = result.url
        } catch (e) {
        console.log(e);}
      },
    handleAvatarProgress(){
        this.loading = true
    },
    handleAvatarSuccess(res) {
        console.log("avatar update success")
        this.loading = false
        this.test = res
        },

    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          //this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      }
  },
  data: function(){
    return{
      form:null,
      formLabelWidth:'100',
      test:null,
      introduction:'',
      cycle_name:'',
      close_checked:'',
      imageUrl:'',
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

#UpdateCycleProfile {
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
