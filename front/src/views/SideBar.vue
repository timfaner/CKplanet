<template>
    <nav id="sidebarMenu" class="d-md-block bg-light sidebar collapse">
        <div class="sidebar-sticky">
          <div>
             <el-button :disabled="!logged_in" plain @click.prevent="updateUser()">
            <el-avatar shape="square" :src="user_profile.avatar_url" :size=100>
            </el-avatar>
            
            </el-button>
            <p> {{user_profile.nickname}} </p>
          </div>


          <el-dialog  :visible.sync="dialogNewUser" title="Update user information" append-to-body :close-on-click-modal='false'>

            <UpdateUserProfile v-on:closedialog="finalizeNewUser"></UpdateUserProfile>
            <div  slot="footer" class="dialog-footer">
          </div>
        </el-dialog>
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              router>
              <el-menu-item route="/LiveFeeds" index="1">
              <i class="el-icon-connection"></i>
              <span slot="title">My circle</span>
              </el-menu-item>
              <el-menu-item route="/" index="2">
              <i class="el-icon-user"></i>
              <span slot="title">My home page</span>
              </el-menu-item>
              <el-menu-item  route="/more" index="3">
              <i class="el-icon-search"></i>
              <span slot="title">Discover more</span>
              </el-menu-item>
              <el-menu-item route="about" index="4">
              <i class="el-icon-star-on"></i>
              <span slot="title">About CKplant</span>
              </el-menu-item>
          </el-menu>
        </div>
    </nav>
</template>



<script>
import { mapState } from 'vuex'
import UpdateUserProfile from "@/components/UpdateUserProfile.vue"

export default {
    name:"SideBar",
    data: function(){
      return{
        dialogNewUser:false
      }
    },
    components:{
      UpdateUserProfile
    },
    methods:{
      updateUser: function(){
        this.dialogNewUser = true
      },
      finalizeNewUser: function(){
        this.dialogNewUser = false
      }
      //nickname: function(){return this.user_profile.nickname},
      //avatar_url : function(){return this.user_profile.avatar_url},

    },
    //FIXME user_profile不能实时更新
    computed:mapState({
        logged_in : state => state.ckplanet.data_server_connected && state.ckplanet.wallet_connected,
        user_lock_args : state => state.user_chain_info.lock_args,
        user_profiles_pool: state => state.ckplanet.user_profiles_pool,
        user_profile:function () {
        if(this.user_lock_args in this.user_profiles_pool)
          return this.user_profiles_pool[this.user_lock_args]
        else
          return {
            nickname:"Please fill in nickname",
            avatar_url:"https://hiltonsheartland.com/wp-content/uploads/2013/08/unknown-avatar.jpg"
            }
        
          
          },

    }),

}
</script>


<style>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>