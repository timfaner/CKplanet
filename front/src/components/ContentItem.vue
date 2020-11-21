<template>
<div class="py-2">
    <div class="row mx-2 my-2">
      <el-avatar v-if="show_avatar" shape="square" :size=50  :src="cycle_profile.avatar_url"></el-avatar>
        
        <div class="content mx-4 border px-3 py-3 col-10" style="border-radius: 5px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #EBEEF5">
        <div class="row">
        <h5 class="ml-3"> {{content.title}}  <el-link >posted @ {{cycle_profile.cycle_name}}</el-link>
        </h5>
        <div class="ml-auto mr-2">
        <el-popover
            placement="top"
            width="160"
            v-model="visible">
            <p>Are you sure to delete this post?</p>
            <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">NO</el-button>
            <el-button type="primary" size="mini" @click="visible = false">YES</el-button>
            </div>
            <el-button slot="reference"  type="text" icon="el-icon-delete"></el-button>
        </el-popover>
            </div>
        </div>
        <p>
            {{content.content}}
        </p>
        <i > posted: {{post_time}} </i>
        </div>

    </div>
    </div>
</template>

<script>

export default {
  name: 'ContentItem',
  computed :{
    post_time :function(){return  new Date(this.content.time).toLocaleString()},
    cycle_profile : function(){ 
      return this.$store.state.ckplanet.cycles_pool[this.lock_args][this.cycle_id]["cycle_profile"]
    },
    content : function(){
      return this.$store.state.ckplanet.cycles_pool[this.lock_args][this.cycle_id]["contents"][this.content_id]
    }

  },
  props: {
    content_id:String,
    cycle_id:String,
    lock_args:String,
    show_avatar:Boolean

  },
  data:function(){
    return{
      visible:false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
