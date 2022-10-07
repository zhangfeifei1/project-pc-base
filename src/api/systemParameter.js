
import request from '@/utils/request'

/**
 * 修改验证
 * @param data 修改上传表单
 */
export const editParameter = (data) => {
  const url = 'trans/parameter/editParameter'
  return request({
    url: url,
    method: 'post',
    data
  })
}

/**
 * 系统参数值正则验证
 * @param data 系统参数值
 */
export const getPattern = ({ parameterKey }) => {
  const params = { parameterKey: parameterKey }
  return request({
    url: 'trans/parameter/getParameterRegular',
    params,
    method: 'get'
  })
}

/**
 * 分页查询
 * @param params 上传参数
 */
export const getParameterPage = ({ limit, page, parameterKey, parameterValue, sortField, sortFieldValue }) => {
  const params = { size: limit, current: page, parameterKey: parameterKey, parameterValue: parameterValue, sortField: sortField, sortFieldValue: sortFieldValue }
  return request({
    url: 'trans/parameter/getParameterPage',
    params,
    method: 'get'
  })
}
