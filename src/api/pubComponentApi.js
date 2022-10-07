import request from '@/utils/request'
/**
 * 获取公共组件列表
 */
export const getAllPublicComp = (params) => {
  return request({
    url: 'dynamic/comp/getAllPublicComp',
    params,
    method: 'get'
  })
}
/**
 * 删除公共组件
 */
export const deletePublicComp = (params) => {
  return request({
    url: 'dynamic/comp/deletePublicComp',
    data: params,
    method: 'post'
  })
}
/**
 * 下载公共组件
 */
// export const downloadPublicComp = (params) => {
//   return request({
//     url: 'dynamic/comp/downloadPublicComp',
//     params,
//     method: 'get'
//   })
// }
// 编辑schema--获取schema json数据
export const publicCompSchemaApi = (params) => {
  return request({
    url: 'dynamic/comp/getPublicCompSchema',
    params,
    method: 'get'
  })
}
// 编辑schema--编辑schema json数据
export const editCompSchemaApi = (params) => {
  return request({
    url: 'dynamic/comp/editPublicCompSchema',
    data: params,
    method: 'post'
  })
}
// 配置--编辑data数据
export const editPublicCompJson = (params) => {
  return request({
    url: 'dynamic/comp/editPublicCompJson',
    data: params,
    method: 'post'
  })
}
/**
 * 获取json文件
 */
// eslint-disable-next-line space-before-function-paren
export const publicCompJson = async (params) => {
  return request({
    url: 'dynamic/comp/getPublicCompJson',
    params,
    method: 'get'
  })
}
// 管理文件--获取组件下的所有的文件和文件夹
export const getFileListApi = (params) => {
  return request({
    url: 'dynamic/virtual/pagefiles',
    params,
    method: 'get'
  })
}
// 管理文件--获取所有的文件夹
export const getAllFoldersApi = (params) => {
  return request({
    url: 'dynamic/virtual/pagedirs',
    data: params,
    method: 'post'
  })
}
// 管理文件--删除文件
export const delFileApi = (params) => {
  return request({
    url: 'dynamic/virtual/deleteFiles',
    data: params,
    method: 'post'
  })
}
// 管理文件--下载文件
export const downloadFileApi = (params) => {
  return request({
    url: 'dynamic/virtual/downloadFiles',
    data: params,
    method: 'post',
    headers: {
      responseType: 'blob',
      accept: 'blob'
    }
  })
}
// 管理文件--新建文件夹
export const addFolder = (params) => {
  return request({
    url: 'dynamic/virtual/adddir',
    data: params,
    method: 'post'
  })
}
// 管理文件--上传文件
export const addfile = (params) => {
  return request({
    url: 'dynamic/virtual/addfile',
    data: params,
    method: 'post'
  })
}
// 管理文件--获取子文件
export const getSonListApi = (params) => {
  return request({
    url: 'dynamic/virtual/getson',
    data: params,
    method: 'post'
  })
}
// 管理文件--移动文件
// export const moveFile = (params) => {
//   return request({
//     url: 'dynamic/virtual/moveDir',
//     data: params,
//     method: 'post'
//   })
// }
