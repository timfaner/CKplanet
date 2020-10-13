<template>
    <div>
        <div v-if="active===0">
            <p>
                欢迎登陆Ckplanet, 在这个星球上你可以尽情分享你的看法而不必担心自己的数据被拿走
            </p>
            <p>
                接下来将指导你如何登陆
            </p>
            </div>
        <div v-if="active === 1"> 选择服务器 
            
        </div>


        <UpdateUserProfile v-if="active===2"></UpdateUserProfile>

        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

        <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
        </el-steps>
    </div>
</template>


<script>

import UpdateUserProfile from '@/components/UpdateUserProfile.vue'
export default {
    name: "NewUserGuide",
    props:{
        visible: Boolean,
    },

    data:function(){
        return{
            active:0,
        }
    },
    components:{
        UpdateUserProfile,
    },
    methods:{
        next() {
            if (this.active++ > 2) this.active = 0;
        },

    }
}
</script>