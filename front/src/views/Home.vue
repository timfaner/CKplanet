<template>

<div class="home py-4" >

<div class="container my-4 col-8" style="border-radius: 4px;">
  <div class="container my-4 border" style="border-radius: 30px;background-color: #EBEEF5">
    <div class="row my-3 ml-3">
      <el-avatar   shape="square" :size="100"  :src="url"></el-avatar>
      <div class="mx-4 my-2 profile">
        <h4> 昵称
        </h4>
        <h6>  0xckt121212
        </h6>
        
        
      </div>
      <el-button class="col-2 mx-3 ml-auto minbutton" icon="el-icon-setting" plain style="border-radius: 10px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #EBEEF5" @click="dialogUpdateProfile = true"> 更新个人信息</el-button>
    </div>
    
      <el-dialog title="设置个人信息" :visible.sync="dialogUpdateProfile">
        <UpdateInfoDialog></UpdateInfoDialog>
                <el-button @click="dialogUpdateProfile = false">取 消</el-button>
        <el-button type="primary" @click="dialogUpdateProfile = false">确 定</el-button>
        <div slot="footer" class="dialog-footer">
    </div>
      </el-dialog>
  </div>
<el-divider></el-divider>
  <el-tabs type="card" style="border-radius: 4px">
  <el-tab-pane> <p class="t2" slot="label"> 圈子 </p>
  <div class="container">
    <p class="row ml-2 t2"> 我管理的 </p>
    <div style="border-radius: 20px;background-color: #EBEEF5" class="row py-3 px-3">
      
      <el-button type="primary"  class="col-2 mx-3 minbutton" style="border-radius: 10px;background-color: #4BA0B5;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)"  @click="dialogCycleInfo = true">
      <el-avatar shape="square" :size="80" :src="url" style="border-radius: 5px;"></el-avatar>
      <span class="row justify-content-md-center mt-2">圈子A <el-divider direction="vertical"></el-divider>17人加入</span>
      </el-button>
      <el-button class="col-2 mx-3 minbutton" icon="el-icon-circle-plus" type="info" style="border-radius: 10px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)" @click="dialogNewCycle = true"> 创建新的圈子</el-button>


      <el-dialog title="创建新的圈子" :visible.sync="dialogNewCycle">
        <UpdateInfoDialog></UpdateInfoDialog>
                <el-button @click="dialogNewCycle = false">取 消</el-button>
        <el-button type="primary" @click="dialogNewCycle = false">确 定</el-button>
        <div slot="footer" class="dialog-footer">
      </div>
      </el-dialog>

      <el-dialog  :visible.sync="dialogCycleInfo">
        <el-avatar shape="square" :size="100"  :src="url"></el-avatar>
       <h5> 圈子A <el-divider direction="vertical"></el-divider>88人加入</h5>
       <h6> id: 1232435542</h6>
       <p>这个圈子的简介,,,,,</p>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogCycleInfo = false">确 定</el-button>
        </div>
      </el-dialog>

      
    </div>
  
  </div>
    
  <div class="container my-3">
    <p class="row ml-2 t2"> 我加入的 </p>
    <div style="border-radius: 20px;background-color: #EBEEF5" class="row py-3 px-3">
      
      <el-button type="primary"  class="col-2 mx-3 minbutton" style="border-radius: 10px;background-color: #4BA0B5;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)"  @click="dialogCycleInfo = true">
      <el-avatar shape="square" :size="80" :src="url" style="border-radius: 5px;"></el-avatar>
      <span class="row justify-content-md-center mt-2">圈子B <el-divider direction="vertical"></el-divider>17人加入</span>
      </el-button>
      <el-button class="col-2 mx-3 minbutton" icon="el-icon-circle-plus" type="info" style="border-radius: 10px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)" @click="dialogJoinCycle = true"> 加入新的圈子</el-button>

      <el-dialog title="加入新的圈子" :visible.sync="dialogJoinCycle">

        <el-form :model="form">
          <el-form-item label="圈子id" :label-width="formLabelWidth">
            
            <el-input  autocomplete="off"></el-input>
          </el-form-item>
            <el-avatar shape="square" :size="100"  :src="url"></el-avatar>
            <h5> 圈子B <el-divider direction="vertical"></el-divider>17人加入</h5>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogJoinCycle = false">取 消</el-button>
          <el-button type="primary" @click="dialogJoinCycle = false">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog  :visible.sync="dialogInfoVisible">
        <el-avatar shape="square" :size="100"  :src="url"></el-avatar>
       <h5> 圈子B <el-divider direction="vertical"></el-divider>17人加入</h5>
       <p>这个圈子的简介,,,,,</p>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogInfoVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      
    </div>
  </div>

  </el-tab-pane>
  <el-tab-pane> <p class="t2 my-2 mx-2" slot="label"> <el-badge is-dot class="item">动态</el-badge> </p>

  <div class="container"> 
    <div  class="px-4 py-2 my-2 row" style="border-radius: 10px;background-color: #EBEEF5">
    <span class="px-2 py-2 t1" > xx 申请加入圈子 x </span>
      <el-button class="ml-auto" type="danger">否认</el-button>
      <el-button type=primary>同意</el-button>
    </div>
  </div>
  </el-tab-pane>
</el-tabs>
</div>
</div>
</template>

<script>
// @ is an alias to /src

import UpdateInfoDialog from "../components/UpdateInfoDialog.vue"

export default {
  name: 'Home',
  data() {
    return{
      imageUrl:'',
      form:null,
      textarea:'',
      test:null,
        dialogCycleInfo: false,
        dialogNewCycle: false,
        dialogJoinCycle: false,
        dialogInfoVisible:false,
        cycleInfo: false,
        dialogUpdateProfile:false,
        formLabelWidth: '100px',
        url:'https://placekitten.com/400/400'
    }
  },
  components: {
    UpdateInfoDialog
  },

  methods:{



    }
  
  
}
</script>


<style>

.t1{
  line-height:1.7;
  font-size: 20px;
  margin-top: 4px;
}

.t2{
  line-height:1.5;
  font-size: 18px;
}


.t3{
  line-height:1.5;
  font-size: 16px;
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