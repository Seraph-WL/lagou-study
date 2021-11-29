<template>
  <div class="create-or-edit">
    <el-form>
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input
          type="textarea"
          v-model="role.description"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createOrUpdate, getRoleById } from '@/services/role'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  methods: {
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    },
    onCancel () {
      // 设置取消状态，让父组件处理
      this.$emit('cancel')
      this.role = {}
    },
    async onSubmit () {
      const { data } = await createOrUpdate(this.role)
      if (data.code === '000000') {
        // 关闭提示框（需要子组件向父组件传递状态）
        this.$emit('success')
        // 设置成功提示
        this.$message.success(this.isEdit ? '修改成功' : '添加成功')
        // 清除表单内容
        this.role = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
