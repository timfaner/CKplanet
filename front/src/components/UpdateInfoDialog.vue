<template>
<div v-loading="loading">
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
        <el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input  autocomplete="off"></el-input>
        </el-form-item>

    </el-form>

</div>
</template>

<script>

import { makeId} from "@/ckb/utils"
import {OSS_CONFIG} from "@/config"

const OSS = require("ali-oss")


const client = new OSS(OSS_CONFIG)


export default {
  name: 'UpdateInfoDialog',
  methods:{
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
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  },
  data: function(){
    return{
      //imageUrl:'https://placekitten.com/400/400',
      imageUrl:'',
      form:null,
      formLabelWidth:'100',
      test:null,
      loading:false,
    }
  },
  props: {
    
  }
}
</script>


<style scoped>
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
</style>
