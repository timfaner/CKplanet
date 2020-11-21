<template>
    <div>
        <div v-if="active===0">
            <p>
                Welcome to Ckplanet, you can share your views on this planet without worrying about your data being taken away
            </p>
            <p>
                Next I will guide you how to log in
            </p>
            </div>
        <div v-if="active === 1"> Select server 
            
        </div>


        <UpdateUserProfile v-if="active===2"></UpdateUserProfile>

        <el-button style="margin-top: 12px;" @click="next">Next step</el-button>

        <el-steps :active="active" finish-status="success">
        <el-step title="step 1"></el-step>
        <el-step title="step 2"></el-step>
        <el-step title="step 3"></el-step>
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