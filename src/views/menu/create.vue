<template>
  <div class="menu-create">
    <!-- 将添加功能封装到了单独组件 ./components/CreateOrEdit.vue 中 -->
    <create-or-edit></create-or-edit>
  </div>
</template>

<script>

import CreateOrEdit from './components/CreateOrEdit'

export default {
  name: 'MenuCreate',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped></style>
