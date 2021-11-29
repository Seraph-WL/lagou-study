<template>
  <div class="course-list">
    <el-card>
      <div slot="header">
        <span>数据筛选</span>
      </div>
      <el-form
        :inline="true"
        ref="form"
        label-position="left"
        :model="filterParams"
      >
        <el-form-item label="课程名称：" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="isLoading"
            @click="handleReset"
          >重置</el-button>
          <el-button
            type="primary"
            :disabled="isLoading"
            @click="handleFilter"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span>查询结果：</span>
        <el-button
          style="float: right; margin-top: -10px"
          type="primary"
          @click="$router.push({
            name: 'course-create'
          })"
        >添加课程</el-button>
      </div>
      <!-- 课程展示区域 -->
      <el-table
        :data="courses"
        height="480"
        border
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="230">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
            >编辑</el-button>
            <el-button
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading"
        :current-page="filterParams.currentPage"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      // 筛选功能参数（表单数据）
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      // 课程信息
      courses: [],
      // 数据总条数
      totalCount: 0,
      // 加载状态
      isLoading: true
    }
  },
  created () {
    // 加载课程
    this.loadCourses()
  },
  methods: {
    // 上下架切换处理
    async onStateChange (course) {
      // 点击开关，开启禁用状态
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 1 ? '上架' : '下架'}成功`)
        // 取消禁用状态
        course.isStatusLoading = false
      }
    },
    // 加载课程
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.code === '000000') {
        data.data.records.forEach(item => {
          // 用于表示更改的状态
          item.isStatusLoading = false
        })
        // 保存课程信息
        this.courses = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    // 分页页码点击操作
    handleCurrentChange (page) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },
    // 筛选操作
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 重置操作
    handleReset () {
      this.$refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
