<template>
  <div class="create-or-edit">
    <el-form>
      <el-form-item label="资源名称">
        <el-input v-model="resource.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径">
        <el-input v-model="resource.url"></el-input>
      </el-form-item>
      <el-form-item label="资源分类">
        <el-select
          v-model="resource.categoryId"
          placeholder="资源分类"
          clearable
        >
          <!-- 请求接口进行下拉菜单项设置 -->
          <el-option
            v-for="item in resourceCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源描述">
        <el-input
          type="textarea"
          v-model="resource.description"
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

import { getEditResourceInfo, createOrUpdateResource } from '@/services/resource'

export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: [Number, String]
    },
    // 存储资源分类信息
    resourceCategories: {
      type: Array
    }
  },
  created () {
    if (this.isEdit) {
      this.loadResource()
    }
  },
  data () {
    return {
      resource: {
        name: '',
        url: '',
        categoryId: '',
        description: ''
      }
    }
  },
  methods: {
    async loadResource () {
      const { data } = await getEditResourceInfo(this.resourceId)
      if (data.code === '000000') {
        this.resource = data.data
      }
    },
    onCancel () {
      // 设置取消状态，让父组件处理
      this.$emit('cancel')
      this.resource = {}
    },
    async onSubmit () {
      const { data } = await createOrUpdateResource(this.resource)
      if (data.code === '000000') {
        // 关闭提示框（需要子组件向父组件传递状态）
        this.$emit('success')
        // 设置成功提示
        this.$message.success(this.isEdit ? '修改成功' : '添加成功')
        // 清除表单内容
        this.resource = {}
      }
    }
  }
}

</script>

<style lang="scss" scoped></style>
