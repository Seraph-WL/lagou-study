<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        ref="menu-tree"
        node-key="id"
        :data="menus"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        show-checkbox
        default-expand-all
      ></el-tree>
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
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
export default {
  name: 'AllocMenu',
  props: {
    // 组件内需要通过 props 接收路径传递的参数，实现解耦
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    // 加载所有的菜单信息（用于展示 tree 结构）
    this.loadMenus()
    // 加载当前角色已经分配的菜单信息
    this.loadRoleMenus()
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  methods: {
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    // 自己封装的用于数据筛选的方法（筛选出被选中菜单项的 ID）
    getCheckedKeys (menus) {
      console.log(menus)
      // 遍历数据（将所有存在子节点的 node 排除，对子节点列表进行筛选）
      menus.forEach(menu => {
        // 未选中，结束
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          // 对子节点进行选中状态检测。结束
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 说明为选中的叶子节点（不存在子节点的节点），存储 ID
        // 数据变化次数太多，异步操作 视图可能没变化
        // this.checkedKeys.push(menu.id)
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async onSave () {
      // 发送请求，传递角色 ID 与 选中的菜单项 ID
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
