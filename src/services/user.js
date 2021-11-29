import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export const login = data => {
  return request({
    method: 'POST',
    // header 可省略，qs.stringify() 会⾃动设置
    // headers: { 'content-type': 'application/x-www-form-urlencoded'},
    url: '/front/user/login',
    // urlencoded 格式：名=值&名=值
    data: qs.stringify(data)
  })
}

// 用户基本信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // 接口鉴权 统一在request.js设置
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}

// 分页查询用户信息 - 用户管理
export const getUserPages = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁用户（服务端关闭了权限，无法进行实际操作，如报错忽略即可）
export const forbidUser = userId => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
