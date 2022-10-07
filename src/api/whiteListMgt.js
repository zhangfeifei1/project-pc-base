import request from '@/utils/request'

/**
 * 白名单查询
 */
export const deleteWhiteGroup = (params) => {
  return request({
    url: 'diffpackage/zipdiffgroup/delete',
    data: params,
    method: 'post'
  })
}

/**
 * 添加白名单组
 */
export const addWhiteGroup = (params) => {
  return request({
    url: 'diffpackage/zipdiffgroup/save',
    data: params,
    method: 'post'
  })
}

/**
 * 白名单查询
 */
export const getWhiteGroup = (params) => {
  return request({
    url: 'diffpackage/zipdiffgroup/page',
    method: 'get',
    params
  })
}

/**
 * 添加白名单用户
 */
export const addWhiteList = (params) => {
  return request({
    url: 'diffpackage/zipdiffwhitelist/save',
    params,
    method: 'post'
  })
}
