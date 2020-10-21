<template>
    <div style="border-radius: 20px;background-color: #FEFEFE" class="container">
      <div class="row">
        <el-avatar shape="square" :size=50  :src="cycle_profile.avatar_url"></el-avatar>
        <div class="col" >
          <div class="row container">
            <a><h5> <a @click.prevent="routeTo()">{{cycle_profile.cycle_name}} </a></h5></a>
            <i class="ml-autp el-icon-user"> {{cycle_member_num}}</i>
          </div>
          <i class="ml-auto"> {{cycle_profile.introduction}}
          </i>
        </div>
        <el-button @click="routeTo()">
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
        'cycle_id',
        'cycle_member_num',
    ],
    methods:{
        routeTo:function(){
            this.$router.push({
                name:"CycleDetail",
                params:{
                    lock_args:this.lock_args,
                    cycle_id:this.cycle_id
                }
            })
        }
    }
}
</script>