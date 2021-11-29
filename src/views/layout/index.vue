<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏组件 -->
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 头部组件 -->
        <app-header></app-header>
      </el-header>
      <el-main>
        <!-- 设置子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入侧边栏组件
import AppAside from './components/AppAside'
// 引入头部组件
import AppHeader from './components/AppHeader'
export default {
  name: 'Layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    // vh 视口高度百分比 一个vh就是百分之一
    height: 100vh;
    // 设置最小宽度，防止内容过窄产生堆顶
    // min-width: 980px;
  }

  .el-aside {
    background-color: #d3dce6;
  }

  .el-header {
    background-color: #fff;
  }

  .el-main {
    background-color: #e9eef3;
  }
</style>
