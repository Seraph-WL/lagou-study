<template>
  <div class="app-aside">
    <!-- 只有一个子菜单才能展开 unique-opened -->
    <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 router -->
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      router
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/role">
          <i class="el-icon-document"></i>
          <span>角色列表</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <i class="el-icon-document"></i>
          <span>菜单列表</span>
        </el-menu-item>
        <el-menu-item index="/resource">
          <i class="el-icon-document"></i>
          <span>资源列表</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/course">
        <i class="el-icon-menu"></i>
        <span slot="title">课程管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-document"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">广告管理</span>
        </template>
        <el-menu-item index="/advert">
          <i class="el-icon-document"></i>
          <span>广告列表</span>
        </el-menu-item>
        <el-menu-item index="/advert-space">
          <i class="el-icon-document"></i>
          <span>广告位列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AppAside'
}
</script>

<style lang="scss" scoped>
.app-aside {
  height: 100%;
  .el-menu {
    height: 100%;
    border-right: 0 none;
  }
}
</style>
