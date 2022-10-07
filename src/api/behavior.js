import request from '@/utils/request'
/**
 * 运营概览
 */
export const getOperationInfo = (params) => {
  return request({
    url: 'behavior/reportForm/getOperationInfo',
    params,
    method: 'get'
  })
}
/**
 * 版本分布
 */
export const getVersionInfo = (params) => {
  return request({
    url: 'behavior/reportForm/getVersionInfo',
    params,
    method: 'get'
  })
}
