<template>
  <div class="create-or-edit-categories">
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="categories.name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="categories.sort"></el-input>
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
import { saveOrderUpdateResource } from '@/services/resource'

export default {
  name: 'CreateOrEditCategories',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    categoriesId: {
      type: [Number, String]
    },
    categories: {
      type: [Object]
    }
  },
  data () {
    return {
    }
  },

  methods: {
    onCancel () {
      // 设置取消状态，让父组件处理
      this.$emit('cancel')
    },
    async onSubmit () {
      const { data } = await saveOrderUpdateResource(this.categories)
      if (data.code === '000000') {
        // 关闭提示框（需要子组件向父组件传递状态）
        this.$emit('success')
        // 设置成功提示
        this.$message.success(this.isEdit ? '修改成功' : '添加成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
