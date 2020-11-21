<template>
<div id="UpdateUserProfile">

    <el-form :disabled="btnloading">
      <el-form-item>
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
      </el-form-item>

        <el-form-item label="nickname" :label-width="formLabelWidth">

        <el-input v-model="nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
        <el-collapse-transition>
          <TxStatusDashBoard v-if="showProgress"> </TxStatusDashBoard>
        </el-collapse-transition>
        </el-form-item>
        <el-form-item>

          <el-button type="primary" :loading="btnloading" @click="updateUserProfile()">SAVE</el-button>

        </el-form-item>
    </el-form>

</div>
</template>

<script>



import {DataServer} from "@/ckb/data_server"
import {DataSetter } from "@/ckb/data_handler"
import { getDataTemplate,getDataHash,getDataID } from "@/ckb/ckplanet"
import {mapState} from "vuex"
import TxStatusDashBoard from '@/components/TxStatusDashBoard.vue'

import { fileToBase64, } from "@/ckb/utils";
import imageCompression from 'browser-image-compression';



export default {
  name: 'UpdateUserProfile',
    computed: mapState({
        user_address: state=>state.user_chain_info.address,
        user_lock_args : state => state.user_chain_info.lock_args,

      }),
  components:{
    TxStatusDashBoard,
  },
  methods:{

    updateUserProfile : async function(){
      this.showProgress = true
      this.btnloading = true
      let user_ds = new DataServer(this.$store,this.user_lock_args)
      let data_setter = new DataSetter(user_ds)

      let data = getDataTemplate('user_profile')
      data.nickname = this.nickname
      data.avatar_url = this.imageUrl


      let data_hash = getDataHash('user_profile',data)
      let data_id = getDataID('user_profile')
      try {
        
        let tx_id =""

        tx_id = await data_setter.updateDataIntegrityOnChain(
        data_id,
        data_hash)

        console.log("updateDataIntegrityOnChain")
        await data_setter.postData(
          data,
          data_id,
          'public',
          true,
          tx_id
        )

        this.$message({
            message: 'Successfully updated personal information',
            type: 'success'
          })

        //更新vuex store
        this.$store.dispatch("getUserProfile",this.user_lock_args).catch((e)=>{throw(e)})

        this.showProgress = false
        this.btnloading = false
        this.$emit("closedialog")

        
      }
       catch (error) {
        this.$message.error(error.message)
        this.showProgress = false
        this.btnloading = false
      }
      
    },
    upload: async function(item){
      try {
        const options = { 
          maxSizeMB: 0.1,          // (default: Number.POSITIVE_INFINITY)
          maxWidthOrHeight: 500,   // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
        }
        
        let file = await imageCompression(item.file,options)
        this.imageUrl = await fileToBase64(file)
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
          this.$message.error('The size of the uploaded profile picture cannot exceed 2MB!');
        }
        return isLt2M;
      }
  },
  data: function(){
    return{
      showProgress:false,
      btnloading:false,
      //imageUrl:'https://placekitten.com/400/400',
      imageUrl:'',
      form:null,
      formLabelWidth:'100',
      test:null,
      nickname:'',
    }
  },
  props: {
    
  }
}
</script>


<style scoped>

#UpdateUserProfile {
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
