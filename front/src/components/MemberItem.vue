<template>


    <el-row type="flex" align="top"  class="cycleItem" :gutter="0">
      <el-col :span="2">
        <el-avatar
          shape="square"
          :size="80"
          :src="user_profile.avatar_url"
        ></el-avatar>
      </el-col>

      <el-col :span="17" :offset="0" class="info">
        <el-row type="flex">
          <el-col :span="23" >
            <h5>{{ user_profile.nickname }} </h5>
          </el-col >

        </el-row>

        <el-row
          ><span class="ml-auto "> lock_args: <span class="lock_args">{{ lock_args }} </span></span>
        </el-row>
        <el-row
          ><span class="ml-auto "> Data Server: <span class="lock_args">{{ data_server_ip }} </span></span>
        </el-row>
      </el-col>

    </el-row>
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
    },
    data_server_ip:function () {
      if (this.lock_args in this.$store.state.data_server_pool)
        return this.$store.state.data_server_pool[this.lock_args].ip
      else
        return ''
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

.lock_args{
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  word-break: break-all;
  white-space: normal;
}
</style>
