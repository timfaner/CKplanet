<template>
    <nav id="sidebarMenu" class="col-md-1 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="sidebar-sticky">
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                router>
                <el-menu-item route="/cycles" index="1">
                <i class="el-icon-connection"></i>
                <span slot="title">我的圈子</span>
                </el-menu-item>
                <el-menu-item route="/" index="2">
                <i class="el-icon-user"></i>
                <span slot="title">我的主页</span>
                </el-menu-item>
                <el-menu-item  route="/more" index="3">
                <i class="el-icon-search"></i>
                <span slot="title">发现更多</span>
                </el-menu-item>
                <el-menu-item route="about" index="4">
                <i class="el-icon-star-on"></i>
                <span slot="title">关于CKplant</span>
                </el-menu-item>
            </el-menu>
        </div>
    </nav>
</template>



<script>
export default {
    name:"SideBar",
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