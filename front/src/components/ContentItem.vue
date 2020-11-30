<template>
  <el-row :gutter="0">
    <el-col :span="1">
      <el-avatar
        v-if="show_avatar"
        shape="square"
        :size="50"
        :src="cycle_profile.avatar_url"
      ></el-avatar>
    </el-col>
    <el-col :span="22">
      <el-row class="cycleItem">
        <el-row class="header">
          <el-col :span="12">
            <h4 class="ml-3 title">
              {{ content.title }}
              <el-link
              @click="routeTo(lock_args,cycle_id)"
              >posted @ {{ cycle_profile.cycle_name }}</el-link>
            </h4>
          </el-col>
          <el-col :span="12" class="post_time">
            <i class="post_time"> {{ post_time }} </i>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <div class="markdown-body content" v-html="compiled_markdown"></div>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "ContentItem",
  methods:{
    routeTo: function(lock_args,cycle_id) {
      this.$router.push({
        name: "CycleDetail",
        params: {
          lock_args,
          cycle_id,
        },
      });
    },
  },
  computed: {
    compiled_markdown: function() {
      return window.marked(this.content.content, { sanitize: true });
    },
    post_time: function() {
      return new Date(this.content.time).toLocaleString();
    },
    cycle_profile: function() {
      return this.$store.state.ckplanet.cycles_pool[this.lock_args][
        this.cycle_id
      ]["cycle_profile"];
    },
    content: function() {
      return this.$store.state.ckplanet.cycles_pool[this.lock_args][
        this.cycle_id
      ]["contents"][this.content_id];
    },
  },
  props: {
    content_id: String,
    cycle_id: String,
    lock_args: String,
    show_avatar: Boolean,
  },
  data: function() {
    return {
      visible: false,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content{
  margin: 15px;
  
}

.post_time{
  justify-self:flex-end;
  text-align: right;
}
.title{
  font-weight: 700;
}

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
