<template>

    <el-row type="flex" align="top"  class="cycleItem" :gutter="0">
      <el-col :span="2">
        <el-avatar
          shape="square"
          :size="80"
          :src="cycle_profile.avatar_url"
        ></el-avatar>
      </el-col>

      <el-col style="margin-left: 20px;" :span="17" :offset="0" class="info">
        <el-row type="flex">
          <el-col :span="23" >

          <el-link :underline="false" @click="routeTo()">
            <h5>{{ cycle_profile.cycle_name }} </h5>
          </el-link>
          </el-col >
          <el-col :span="2" class="memberCnt">
          <i class=" el-icon-user"> {{ cycle_member_num }}</i>
          </el-col>
        </el-row>

        <el-row
          ><i style=" word-break: break-all; white-space: normal;" class="ml-auto"> {{ cycle_profile.introduction }}</i>
        </el-row>
      </el-col>
      <el-col :span="1" class="mngBtn" :offset="1" >
        <el-button @click="routeTo()" type="warning">
          {{btnName}}
        </el-button>
      </el-col>
    </el-row>

</template>

<script>
import { mapState } from "vuex";
export default {
  
  name: "CycleItem",
  props: ["cycle_profile", "lock_args", "cycle_id", "cycle_member_num"],
  computed:{
    btnName:function() {
      if(this.user_lock_args===this.lock_args)
        return "Manage Planet"
      else
        return "Check  Planet"
    },
    ...mapState({
      user_lock_args: (state) => state.user_chain_info.lock_args,
    })
  },
  methods: {
    routeTo: function() {
      this.$router.push({
        name: "CycleDetail",
        params: {
          lock_args: this.lock_args,
          cycle_id: this.cycle_id,
        },
      });
    },
  },
};
</script>

<style >
.cycleItem {
  min-height: 100px;
  margin: 10px;
  padding: 20px;

  border-style: solid;
  border-width: 1px;
  border-color: #e5e6ec;
  border-radius: 20px;
  background-color: #fefefe;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.mngBtn{
  align-self: center;
  justify-self: end;

}

.memberCnt{

justify-self: flex-end;
justify-content: flex-end;
justify-items: flex-end;

}

.info{
  margin-left: 20px;
}
</style>
