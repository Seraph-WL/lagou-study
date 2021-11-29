<template>
  <el-card>
    <div slot="header">
      <el-form
      :inline="true"
      :model="filterParams"
      ref="filter-form">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="filterParams.phone"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="rangeDate">
          <el-date-picker
            v-model="filterParams.rangeDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="isLoading"
            @click="handleReset"
          >重置</el-button>
          <el-button
            type="primary"
            @click="handleQuery"
            :disabled="isLoading"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="users"
      height="470"
      border
      style="width: 100%"
      v-loading="isLoading"
    >
      <el-table-column
        align="center"
        prop="id"
        label="用户ID"
        width="150">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="头像"
        width="100">
        <template slot-scope="scope">
          <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="用户名">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        align="center"
        label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFormat }}</span>
        </template>
        <!-- 用户状态操作（服务端没有开放权限，只能演示） -->
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="状态"
        width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleSelectRole(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置分配角色的 Dialog 组件 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="50%">
      <!-- 下拉菜单组件位置 -->
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'

export default {
  name: 'UserList',
  data () {
    return {
      users: [],
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      isLoading: true,
      // 用于控制分配角色对话框是否显示
      dialogVisible: false,
      // 下拉菜单数据
      roles: [],
      // 选中选项的 ID 组成的数组
      roleIdList: [],
      // 当前要进行角色分配的用户 ID
      currentRoleID: null
    }
  },
  created () {
    this.loadUsers()
  },

  methods: {
    // 提交分配
    async handleAllocRole () {
      // 点击确认，将分配角色信息提交给服务端
      const { data } = await allocateUserRoles({
        userId: this.currentRoleID,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
      }
    },
    // 加载用户
    async loadUsers () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      this.users = data.data.records
      this.isLoading = false
    },
    // 禁用用户 但服务器端没有开放这个权限
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    // 点击查询按钮
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    // 表单重置操作
    handleReset () {
      this.$refs['filter-form'].resetFields()
      this.loadUsers()
    },
    // 点击用户的分配角色按钮
    async handleSelectRole (userInfo) {
      this.currentRoleID = userInfo.id
      // 显示分配角色对话框
      this.dialogVisible = true
      // 请求所有角色列表数据
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
      }

      // 请求当前用户的已分配角色信息
      const { data: data2 } = await getUserRoles(userInfo.id)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
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
