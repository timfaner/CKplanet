<template>
<div class="py-2">
    <div class="row mx-2 my-2">
        
        <div class="content mx-4 border px-3 py-3 col-10" style="border-radius: 5px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #EBEEF5">
        <div class="row">
        <h5 class="ml-3"> {{user_profile.nickname}}
        </h5>
        <el-avatar :src="user_profile.avatar_url" :size="100"></el-avatar>
        </div>
        <div class="ml-auto mr-2">

        <el-popover
            placement="top"
            width="160"
            v-model="visible">

            <p>Are you sure to delete this user?</p>
            <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">NO</el-button>
            <el-button type="primary" size="mini" @click="visible = false">YES</el-button>

            </div>
            <el-button slot="reference"  type="text" icon="el-icon-delete"></el-button>
        </el-popover>
            </div>

    </div>
    </div>
</div>
</template>

<script>

export default {
  name: 'MemberItem',
  created(){
    this.getUser()
  },
  computed :{
    lock_args: function(){return this.lockargs},
    user_profile : function(){
      if (this.lock_args in this.$store.state.ckplanet.user_profiles_pool)
        return this.$store.state.ckplanet.user_profiles_pool[this.lock_args]
      else 
        return { nickname:'',avatar_url:''}
    }
  },
  props: {
    lockargs:String
  },
  data:function(){
    return{
      visible:false
    }
  },
  methods: {
    getUser:function(){
      if(this.lock_args in this.$store.state.ckplanet.user_profiles_pool)
        return
      this.$store.dispatch("getUserProfile",this.lock_args)
      .catch( (e) => console.error("[MemberItem] Got user profile wrong",this.lock_args,e))
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
