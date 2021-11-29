import request from '@/utils/request'

// 按条件分页查询资源接口
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 查询资源分类接口
export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 获取编辑资源页面信息
export const getEditResourceInfo = id => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

// 添加资源接口
export const createOrUpdateResource = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 更新或添加资源分类
export const saveOrderUpdateResource = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

// 获取所有资源
export const getAllResources = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

// 删除资源接口
export const deleteResource = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 删除资源分类
export const deleteCategories = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}

// 给角色分配资源
export const allocateRoleResources = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}

// 获取当前角色拥有的资源列表接口
export const getRoleResources = roleId => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}
