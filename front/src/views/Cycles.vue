<template>

<div class="cycles py-3" >

<div class="container my-2 col-8" style="border-radius: 4px;">
  <div class="row">
    <h4> Livefeed</h4>
    <el-button @click="dialogPublish=true" class="col-2 ml-auto"> share your thoughts </el-button>

    <el-dialog  v-if="dialogPublish" title="Share your thoughts" :visible.sync="dialogPublish">
        <PublishCycleContent v-on:closedialog="dialogPublish=false" mode="create" ></PublishCycleContent>
        <div slot="footer"  class="dialog-footer">
        </div>
    </el-dialog>
  </div>


  <el-tabs >
  <el-tab-pane> <span  slot="label"> All </span>
  <div class="container">
    <ContentItem v-for="content in posts.all_posts"
    :key="content.time"
    :content_id="content.content_id"
    :cycle_id="content.cycle_id"
    :lock_args="content.lock_args"
    :show_avatar = true
    ></ContentItem>
  </div>   
  </el-tab-pane>
  <el-tab-pane> <span slot="label"> My Posts </span>
    <ContentItem v-for="content in posts.my_posts"
    :key="content.time"
    :content_id="content.content_id"
    :cycle_id="content.cycle_id"
    :lock_args="content.lock_args"
    :show_avatar = true
    ></ContentItem>

  </el-tab-pane>
</el-tabs>
</div>
</div>
</template>

<script>
import { mapState } from 'vuex'
// @ is an alias to /src
import PublishCycleContent from "../components/PublishCycleContent.vue" 
import ContentItem from "../components/ContentItem.vue"

export default {
  name: 'Home',
  data() {
    return{
      dialogPublish:false,
    }
  },
  components: {
    PublishCycleContent,
    ContentItem
  },
  computed:{
    ...mapState({
      user_lock_args : (state) => state.user_chain_info.lock_args ,
      posts :function(state){
        let all_posts = []
        let my_posts = []
        for(const lock_args in state.ckplanet.cycles_pool){
          for(const cycle_id in state.ckplanet.cycles_pool[lock_args]){
            for(const content_id in state.ckplanet.cycles_pool[lock_args][cycle_id].contents){
              let tmp = state.ckplanet.cycles_pool[lock_args][cycle_id]['contents'][content_id]
              let post = {lock_args,cycle_id,content_id,time:tmp.time}
                all_posts.push(post)
                if(lock_args===this.user_lock_args)
                  my_posts.push(post)
              }
            }
          }
        return( {all_posts,my_posts})
        }

    })
  },

  methods:{

      
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