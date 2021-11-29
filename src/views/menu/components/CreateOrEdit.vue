<template>
  <div class="menu-create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <!-- 无上级菜单 -->
            <el-option
              label="无上级菜单"
              :value="-1"
            ></el-option>
            <!-- 选择一级菜单 -->
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <!-- label 的数据会在选择后设置给 v-model 的 shown -->
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderNum" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import { getEditMenuInfo, createOrUpdateMenu } from '@/services/menu'

export default {
  name: 'CreateOrEdit',
  // 通过 props 接收父组件传值，判断当前是哪种功能（添加或编辑）
  props: {
    isEdit: {
      type: Boolean,
      // 默认为添加功能
      default: false
    }
  },
  data () {
    return {
      // 表单数据
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      // 存储上级菜单数据
      parentMenuList: []
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    // 重置按钮点击操作
    onReset () {
      this.$refs.form.resetFields()
      this.form.orderNum = 0
      this.form.shown = false
    },
    async onSubmit () {
      // 1. 表单验证
      // 2. 发送请求
      const { data } = await createOrUpdateMenu(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({
          name: 'menu'
        })
      }
    },
    async loadMenuInfo () {
      // 检测是否存在路由参数 id, 并进行对应处理
      const id = this.$route.params.id || -1
      // 请求菜单数据（上级菜单数据）
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        // 将上级菜单数据保存，进行数据绑定
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据 menuInfo，如果存在，更新给 form 即可
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
