<template>
  <div id="app"   v-loading="loadings" element-loading-text="请在钱包中完成授权">


  <TopBar></TopBar>
  <div class="container-fluid">
    <div class="row">
      <SideBar> </SideBar>
      <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4"  style="background-color: #F2F6FC">
      <router-view/>
      </main>
    </div>
  </div>


  </div>
</template>

<script>


import TopBar from "@/views/TopBar.vue"
import SideBar from "@/views/SideBar.vue"



export default {
  name: 'App',
  computed:{
  },

  data: function () {
    return {
      loadings: false,  //负责加载动画
   
    }
  },
  methods: {
    test(){
      console.log("test")

    },
      },
  components:{
    TopBar,
    SideBar,
  },
}
</script>


<style>



#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}



  .minbar{
    min-width: 1300px;
    display: inline;
  }
</style>
