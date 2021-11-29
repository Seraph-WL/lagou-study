import axios from 'axios'
// 引入 Vuex 的数据
import store from '@/store'
// 通过局部引入方式引入 Element 的 Message 组件功能
import { Message } from 'element-ui'
// 引入 router
import router from '@/router'
// 引入 qs 用于进行请求参数处理
import qs from 'qs'

// create 创建 axios 实例
// create 内部可以传入一个对象，这个对象用来对axios处理
const request = axios.create({
  // timeout: 2000
  // baseURL:
  // headers:
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 判断 config.url 的前缀，来进行请求 baseURL 的设置
  config.baseURL = getBaseURL(config.url)

  // 统一设置 Token 信息 接⼝鉴权
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin () {
  // 跳转到登录页
  router.push({
    name: 'login',
    query: {
      // currentRoute 就是存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}

// 存储是否正在更新 Token 的状态
let isRefreshing = false
// 问题：虽然刷新 Token 的问题解决了，但之前发送的两个请求只有⼀个成功执⾏，其余的请求被阻⽌了。
// 解决办法：我们声明⼀个数组存储所有被挂起的请求，当 Token 刷新完毕再将这些请求重新发送
// 存储因为等待 Token 刷新而挂起的请求
let requests = []

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码 2xx 会执行这里
  // console.log('响应成功了：', response)
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，响应接收完毕，但状态码为 失败的情况
    // 1、判断失败的状态码情况 (主要处理 401 的情况)
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
      // 401 未授权
    } else if (status === 401) {
      // 2、无token信息
      if (!store.state.user) {
        // 跳转到登录页
        redirectLogin()
        // 阻止后续操作
        return Promise.reject(error)
      }

      // 后端通常会限制每个 refresh_token 只能获取⼀次新 Token
      // 检测是否已经存在了正在刷新 Token 的请求
      if (isRefreshing) {
        // 将当前失败的请求，存储到请求列表中
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }
      isRefreshing = true
      // 3、token 无效 (错误，过期) 处理
      // 发送请求，获取新的 access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // - 刷新 token 失败
        if (res.data.state !== 1) {
          // 清除无效的用户信息
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新 token 成功
        //  - 存储新的 token
        store.commit('setUser', res.data.content)
        //  - 重新发送失败的请求（根据 requests 发送所有失败的请求）
        requests.forEach(callback => callback())
        //  - 发送完毕，清除 requests 内容即可
        requests = []
        //  - 将本次请求发送 error.config 本次失败请求的配置对象
        return request(error.config)
      }).catch(err => {
        // 这⾥⽤于处理 HTTP 报错的情况（我们的服务器使⽤的为响应⾃定义状态 -1 来标识失败）
        console.log(err)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态更改为 false 即可
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但是未收到响应
    Message.error('请求超时，请重试')
  } else {
    // 意料之外的错误
    Message.error(error.message)
  }
  // 将本次请求的错误对象继续向后抛出，让接收响应的处理函数进行操作
  return Promise.reject(error)
})

export default request
