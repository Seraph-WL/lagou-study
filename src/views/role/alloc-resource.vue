<template>
  <div class="alloc-resource">
    <el-card class="form-container">
      <el-table style="width: 100%">
        <div
          class="top-line"
          v-for="item in resourceRoals"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <div class="table-layout el-row" style="background: rgb(242, 246, 252);">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="item.id"
              @change="handleCheckAllChange"
              label="item.name">{{ item.name }}</el-checkbox>
          </div>
          <div class="table-layout el-row">
            <div
              class="el-col el-col-8"
              style="padding: 4px 0px;"
              v-for="ite in item.resourceList"
              :key="ite.id"
              :label="ite.name"
              :value="ite.id">
              <el-checkbox
                v-model="ite.id"
                @change="handleCheckedChange"
                label="ite.name">{{ ite.name }}</el-checkbox>
            </div>
          </div>
        </div>
      </el-table>
      <div style="margin: 20px;">
        <el-button
          @click="onReset"
        >清空</el-button>
        <el-button
          type="primary"
          @click="onSave"
        >保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

import { allocateRoleResources, getRoleResources } from '@/services/resource'
export default {
  name: 'AllocResource',
  props: {
    // 组件内需要通过 props 接收路径传递的参数，实现解耦
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    // 加载当前角色已经分配的资源信息
    this.loadRoleResources()
  },
  data () {
    return {
      // 存储资源分类信息
      resourceRoals: [],
      checkAll: false,
      checkedResources: [],
      isIndeterminate: true
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedResources = val
      // console.log(val)
      // this.loadRoleResources()
      this.isIndeterminate = false
    },
    handleCheckedChange (value) {
      const checkedCount = value.length
      // console.log(value)
      // console.log(checkedCount)
      // this.loadRoleResources()
      console.log(this.checkedKeys)
      this.checkAll = checkedCount === this.resourceRoals.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.resourceRoals.length
    },
    onReset () {
    },
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        // console.log(data.data)
        this.resourceRoals = data.data
      }
    },
    async onSave () {
      // 发送请求，传递角色 ID 与 选中的菜单项 ID
      const { data } = await allocateRoleResources({
        roleId: this.roleId
      })
      if (data.code === '000000') {
        this.$message.success('分配资源成功')
        this.$router.push({
          name: 'role'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 深度选择器 样式穿透操作
::v-deep .el-table .hidden-columns {
  visibility: initial;
  position: relative;
  z-index: 1;
}
::v-deep .top-line {
  border-top: 1px solid #dcdfe6;
}
::v-deep .table-layout {
  padding: 20px;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
}
</style>
