<template>


<div class="home py-4" >

<div v-if="loged_in" class="container my-4 col-8" style="border-radius: 4px;">

  <div class="row">
    <h3> Planets </h3>
    <el-button class="ml-auto" plain @click="dialogNewCycle = true" style="border-radius: 10px;background-color: #FFFFFF;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)">
      create planets
    </el-button>
  </div>


  <el-dialog title="Create new circle" :visible.sync="dialogNewCycle" :close-on-click-modal='false'>

    <UpdateCycleProfile v-on:closedialog="dialogNewCycle=false" mode="create" ></UpdateCycleProfile>
    <div slot="footer"  class="dialog-footer">
    </div>
  </el-dialog>


  <el-tabs style="border-radius: 4px">
  <el-tab-pane> <p  slot="label"> My Planets ({{cycles.ego_cycles.length}}) </p>
  <div class="container">


  <CycleItem
    v-for="cycle in cycles.ego_cycles"
    :key="cycle.cycle_id"
    :cycle_profile="cycle.cycle_profile"
    :lock_args="cycle.lock_args"
    :cycle_id="cycle.cycle_id"
    :cycle_member_num="cycle.user_lists.length"
    
  />


  </div>
    


  </el-tab-pane>
  <el-tab-pane> <p  slot="label">  Joined Planets ({{cycles.autrui_cycles.length}}) </p>

  <div class="container"> 

  <div/>
  <CycleItem
    v-for="cycle in cycles.autrui_cycles"
    :key="cycle.cycle_id"
    :cycle_profile="cycle.cycle_profile"
    :lock_args="cycle.lock_args"
    :cycle_id="cycle.cycle_id"
    :cycle_member_num="cycle.user_lists.length"
    
  />

    

  </div>
  </el-tab-pane>
  <el-tab-pane> <p  slot="label">  Pending ({{pending_cycles_num}}) </p>

  <div class="container">
    <div  class="px-4 py-2 my-2 row" style="border-radius: 10px;background-color: #EBEEF5">
    <span class="px-2 py-2 t1" > xx Apply to join a circle x </span>
      <el-button class="ml-auto" type="danger">refuse</el-button>
      <el-button type=primary>agree</el-button>
    </div>
  </div>
  </el-tab-pane>
  </el-tabs>

</div>

<div v-else>
  <p>
    please setup the wallet and dataserver and go on
  </p>
</div>
</div>

</template>

<script>
// @ is an alias to /src


import UpdateCycleProfile from "../components/UpdateCycleProfile.vue"
import CycleItem from "../components/CycleItem.vue"

import {mapState} from "vuex"

export default {
  name: 'Home',
  computed:{
    localComputed(){return{
       ego_cycles_num: ()=>1,
       autrui_cycles_num : ()=>1,
       
       }
    },
    ...mapState({
      pending_cycles_num : ()=>1,
      loged_in : state => { return state.ckplanet.wallet_connected && state.ckplanet.data_server_connected},
      user_lock_args : state => state.user_chain_info.lock_args,
      cycles : function(state){
        let user_lock_args = state.user_chain_info.lock_args
        let cycles = state.ckplanet.cycles_pool
        let ego_cycles = []
        let autrui_cycles = []
        let tmp = []
        for(const lock_args in cycles){
          for(const cycle_id in cycles[lock_args]){
            let cycle = cycles[lock_args][cycle_id]
            cycle = {...cycle,...{lock_args,cycle_id}}
            tmp.push(cycle)
          }
        }
        ego_cycles = tmp.filter(function(cycle){
          return cycle.lock_args===user_lock_args
        })
        autrui_cycles = tmp.filter(function(cycle){
          return cycle.lock_args!==user_lock_args
        })
        return {ego_cycles,autrui_cycles}
      }
  })
  },
  data() {
    return{
      cycle_name: "Cycle Placeholder",
      cycle_introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut odio velit, cursus et vas lacus efficitur nec.",
      imageUrl:'https://placekitten.com/400/400',
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
    CycleItem,
    UpdateCycleProfile
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