<template>

<div class="cycles py-3" >

<div class="container my-2 col-8" style="border-radius: 4px;">


  <el-tabs type="card" style="border-radius: 4px">
  <el-tab-pane> <span class="t2" slot="label"> 我管理的 </span>
  <div class="container">
    <div class="container  border" style="border-radius: 15px;background-color: #EBEEF5">
    <div class="row justify-content-md-center mx-2 my-2 ">
        <el-input
        type="textarea"
        :rows="1"
        placeholder="输入一个标题"
        v-model="textarea"
        class="my-1"
        >
      </el-input>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="向世界分享你的想法！"
        v-model="textarea"
        >
      </el-input>

      </div>
      <div class="row my-1 mx-2">
      <el-button type="primary" class="ml-auto" >发送</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="my-2 container">
      <div class="py-2">
        <div class="row mx-2 my-2">
          <el-avatar   shape="square"  :size=50 :src="url"></el-avatar>
          
          <div class="content mx-4 border px-3 py-3 col-10" style="border-radius: 5px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #EBEEF5">
            <div class="row">
            <h5 class="ml-3"> 中本聪 发表了 比特币白皮书
            </h5>
            <div class="ml-auto mr-2">
            <el-popover
              placement="top"
              width="160"
              v-model="visible">
              <p>确定删除吗这条动态吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
              </div>
              <el-button slot="reference"  type="text" icon="el-icon-delete"></el-button>
            </el-popover>
              </div>
            </div>
            <p>
              一种完全的点对点电子货币应当允许在线支付从一方直接发送到另一方 而不需要通过一个金融机构。数字签名提供了部分解决方案，但如果仍需一个 可信任第三方来防止双重支付，那就失去了电子货币的主要优点。我们提出一 种使用点对点网络解决双重支付问题的方案。该网络通过将交易哈希进一条持 续增长的基于哈希的工作量证明链来给交易打上时间戳，形成一条除非重做工 作量证明否则不能更改的记录。最长的链不仅是被见证事件序列的证据，而且 也是它本身是由最大 CPU 算力池产生的证据。只要多数的 CPU 算力被不打 算联合攻击网络的节点控制，这些节点就将生成最长的链而超过攻击者。这种 网络本身只需极简的架构。信息将被尽力广播，节点可以随时离开和重新加入 网络，只需接受最长的工作量证明链作为它们离开时发生事件的证据。
            </p>
          </div>
          

        </div>
      </div>

    </div>
    
  </div>   
  </el-tab-pane>
  <el-tab-pane> <span class="t2" slot="label"> 我加入的 </span>

  bbbblll
  </el-tab-pane>
</el-tabs>
</div>
</div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  data() {
    return{
      textarea:'',
      dialogCycleInfo: false,
      dialogNewCycle: false,
      dialogJoinCycle: false,
      cycleInfo: false,
      visible:false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          
        },
        formLabelWidth: '100px',
        url:'https://placekitten.com/500/500'
    }
  },
  components: {
    
  },

  methods:{
          handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
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
    }
  
  
}
</script>


<style>

.content {
    text-align: left;
  }

.t1{
  line-height:1.7;
  font-size: 20px;
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


  
</style>