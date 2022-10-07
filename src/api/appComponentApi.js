import request from '@/utils/request'
/**
 * 获取app组件列表
 */
export const allAppCompApi = (params) => {
  return request({
    url: 'dynamic/comp/getAllAppComp',
    params,
    method: 'get'
  })
}
// 删除app组件
export const deleteAppComp = (params) => {
  return request({
    url: 'dynamic/comp/deleteAppComp',
    data: params,
    method: 'post'
  })
}
// 拉取组件--拷贝公共组件到app组件
export const copyCompToApp = (params) => {
  return request({
    url: 'dynamic/comp/copyCompToApp',
    data: params,
    method: 'post'
  })
}
// 共享组件--拷贝app组件到公共组件
export const copyCompToPublic = (params) => {
  return request({
    url: 'dynamic/comp/copyCompToPublic',
    data: params,
    method: 'post'
  })
}
// app组件编辑schema--获取schema json数据
export const appCompJsonApi = (params) => {
  return request({
    url: 'dynamic/comp/getCompJson',
    data: params,
    method: 'post'
  })
}
// app组件编辑schema--编辑schema json数据
export const editAppCompJsonApi = (params) => {
  return request({
    url: 'dynamic/comp/editCompJson',
    data: params,
    method: 'post'
  })
}
