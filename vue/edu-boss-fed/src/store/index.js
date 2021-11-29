import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存储需要在组件间共享的数据
  // 1、容器中的数据可以被任意组件访问
  // 2、容器中的数据为响应式数据
  state: {
    // 用于在登录成功后保存用户信息 (初始值尝试读取本地存储)
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  // 同步
  mutations: {
    // 存储用户数据
    setUser (state, payload) {
      // 将 payload 转换为对象后再进行存储
      state.user = JSON.parse(payload)
      // 将 payload 数据添加到本地存储中进行数据持久化 只能存储字符串，对象不行
      window.localStorage.setItem('user', payload)
    }
  },
  // 异步且Action 提交的是 mutation，⽽不是直接变更状态
  // vm.$store.dispatch ⽅法触发
  // 可以调⽤context.commit 提交⼀个 mutation
  actions: {
  },
  modules: {
  }
})
