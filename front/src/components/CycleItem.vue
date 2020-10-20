<template>
    <div style="border-radius: 20px;background-color: #FEFEFE" class="container">
      <div class="row">
        <el-avatar shape="square" :size=50  :src="cycle_profile.avatar_url"></el-avatar>
        <div class="col" >
          <div class="row container">
            <h5>{{cycle_profile.cycle_name}} </h5>
            <i class="ml-autp el-icon-user"> {{cycle_member_num}}</i>
          </div>
          <i class="ml-auto"> {{cycle_profile.introduction}}
          </i>
        </div>
        <el-button>
          Manage Planet
        </el-button>
      </div>
    </div>
</template>


<script>
export default {
    name:'CycleItem',
    props:[
        'cycle_profile',
        'lock_args',
        'cycles_id',
        'cycle_member_num',


    ]
}
</script>