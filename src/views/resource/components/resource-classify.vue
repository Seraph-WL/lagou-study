<template>
  <div class="resource-classify">
    <el-card shadow="never">
      <el-button @click="handleAdd">添加分类</el-button>
    </el-card>
    <el-table
      :data="resourceClassifies"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        align="center"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加资源的对话框结构 -->
    <el-dialog
      :title="isEdit ? '编辑分类' : '添加分类'"
      :visible.sync="dialogVisible"
      width="30%">
      <!-- 将添加与编辑功能单独封装到组件中 -->
      <create-or-edit-categories
        ref="createOrEditCategories"
        v-if="dialogVisible"
        :is-edit="isEdit"
        :categories="categories"
        @success="handleSuccess"
        @cancel="handleCancel"
      ></create-or-edit-categories>
    </el-dialog>
  </div>
</template>

<script>
import CreateOrEditCategories from './CreateOrEditCategories'
import { getResourceCategories, deleteCategories } from '@/services/resource'
export default {
  name: 'ResourceClassify',
  components: {
    CreateOrEditCategories
  },
  data () {
    return {
      resourceClassifies: [],
      // 控制对话框显示
      dialogVisible: false,
      // 控制对话框的功能状态
      isEdit: false,
      categories: {}
    }
  },
  created () {
    // 加载资源列表
    this.loadResourceClassifies()
  },
  methods: {
    // 点击添加按钮触发
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    // 监听子组件取消状态
    handleCancel () {
      this.dialogVisible = false
    },
    // 监听子组件的添加状态，成功时触发
    handleSuccess () {
      // 隐藏对话框
      this.dialogVisible = false
      // 刷新列表
      this.loadResourceClassifies()
    },
    handleEdit (categories) {
      this.dialogVisible = true
      this.isEdit = true
      this.categories = categories
    },
    handleDelete (categories) {
      // 删除的确认提示
      this.$confirm(`确认删除分类：${categories.name}？`, '删除提示')
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteCategories(categories.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 更新数据列表
            this.loadResourceClassifies()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 加载资源列表
    async loadResourceClassifies () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceClassifies = data.data
      }
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} 
        ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped></style>
