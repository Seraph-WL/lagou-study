<template>
  <div class="resource-list">
    <el-card shadow="never">
      <!-- 使用 Form 组件：行内表单 -->
      <el-form
        :inline="true"
        :model="form"
        class="demo-form-inline"
        ref="form"
      >
        <el-form-item label="资源名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="资源名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input
            v-model="form.url"
            placeholder="资源路径"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
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
        <el-form-item>
          <el-button
            @click="onReset"
          >重置
          </el-button>
          <el-button
            type="primary"
            :disabled="isLoading"
            @click="onSubmit"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <!-- 显示对话框 -->
      <el-button @click="handleAdd">添加资源</el-button>
      <el-button @click="$router.push({ name: 'resource-classify' })">资源分类</el-button>
    </el-card>
    <el-card shadow="never">
      <!-- 使用 Table 组件 -->
      <el-table
        :data="resources"
        height="440"
        border
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          align="center"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="资源名称">
        </el-table-column>
        <el-table-column
          prop="url"
          align="center"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          align="center"
          label="描述">
        </el-table-column>
        <!-- 设置过滤器需要使用作用域插槽获取数据 -->
        <el-table-column
          align="center"
          label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.row)"
              type="danger"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加资源的对话框结构 -->
      <el-dialog
        :title="isEdit ? '编辑资源' : '添加资源'"
        :visible.sync="dialogVisible"
        width="30%">
        <!-- 将添加与编辑功能单独封装到组件中 -->
        <create-or-edit
          ref="createOrEdit"
          v-if="dialogVisible"
          :resource-categories="resourceCategories"
          :is-edit="isEdit"
          :resource-id="resourceId"
          @success="handleSuccess"
          @cancel="handleCancel"
        ></create-or-edit>
        <!-- 将资源分类功能单独封装到组件中 -->
        <resource-classify></resource-classify>
      </el-dialog>
      <!-- 分页组件结构 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 15, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import CreateOrEdit from './CreateOrEdit'
import ResourceClassify from './resource-classify'
import { getResourcePages, getResourceCategories, deleteResource } from '@/services/resource'
export default {
  name: 'ResourceList',
  components: {
    CreateOrEdit,
    ResourceClassify
  },
  data () {
    return {
      // 用于存储资源列表数据
      resources: [],
      form: {
        // 当前显示的页号
        current: 1,
        // 每页显示的数据条数
        size: 10,
        // 资源名称
        name: '',
        // 资源路径
        url: '',
        // 资源分类 ID
        categoryId: ''
      },
      // 数据总数
      totalCount: 0,
      // 存储资源分类信息
      resourceCategories: [],
      // 用于保存加载状态
      isLoading: false,
      // 控制对话框显示
      dialogVisible: false,
      // 控制对话框的功能状态
      isEdit: false,
      // 存储正在编辑的资源 ID
      resourceId: ''
    }
  },
  created () {
    // 加载资源数据
    this.loadResources()
    // 加载资源列表
    this.loadResourceCategories()
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
      this.loadResources()
    },
    // 重置按钮点击操作
    onReset () {
      this.$refs.form.resetFields()
    },
    // 提交筛选功能
    onSubmit () {
      // 请求数据前，将请求的页数更新为 1
      this.form.current = 1
      this.loadResources()
    },
    // 加载资源列表
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页显示的条数，应当将页数还原为默认值 1
      this.form.current = 1
      this.loadResources()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    },
    async loadResources () {
      // 开始加载数据
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        // 总条数
        this.totalCount = data.data.total
        // 取消加载状态
        this.isLoading = false
      }
    },
    handleEdit (resource) {
      this.dialogVisible = true
      this.isEdit = true
      this.resourceId = resource.id
    },
    handleDelete (resource) {
      // 删除的确认提示
      this.$confirm(`确认删除资源：${resource.name}？`, '删除提示')
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteResource(resource.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 更新数据列表
            this.loadResources()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
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
