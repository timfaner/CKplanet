<template>

  <div
    id="app"
    v-on:click.shift.right="toggleDebug()"
    v-loading="loadings"

    element-loading-text="Please authorize in the wallet"

  >
    <Test v-if="debug"> </Test>
    <TopBar></TopBar>
    <div class="container-fluid">
      <div class="row">
        <SideBar class="col-md-1 col-lg-2 "> </SideBar>
        <main
          role="main"
          class="col-md-9 ml-sm-auto col-lg-10"
          id="main"
        >
          <keep-alive >
            <router-view  />
          </keep-alive>
        </main>
      </div>

    </div>
  </div>
</template>

<script>
import TopBar from "@/views/TopBar.vue";
import SideBar from "@/views/SideBar.vue";
import Test from "@/views/Test.vue";


export default {
  name: "App",
  computed: {},
  created() {
    //接受连接钱包事件
    window.document.body.addEventListener(
      "waitwallet",
      (e) => (this.wallet_connet_status = e.detail.status)
    );
  },

  data: function() {
    return {
      loadings: false, //负责加载动画
      debug: false,
    };
  },
  methods: {
    toggleDebug() {
      this.debug = !this.debug;
      console.log("Mode debug", this.debug);
    },
  },
  components: {
    TopBar,
    SideBar,
    Test,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: #2c3e50;
}

#main{
  background-color: #F6F7F9;
  padding: 3%;


}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
