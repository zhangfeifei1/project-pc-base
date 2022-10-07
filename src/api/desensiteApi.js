import request from '@/utils/request'

/**
 * 新增脱敏规则
 * @param
 */
export const saveDesensitizationRule = (params) => {
  return request({
    url: 'trans/desensitizationRule/saveDesensitizationRule',
    params,
    method: 'get'
  })
}
/**
 * 删除脱敏规则
 * @param
 */
export const deleteDesensitizationRuleById = (params) => {
  return request({
    url: 'trans/desensitizationRule/deleteDesensitizationRuleById',
    params,
    method: 'get'
  })
}
/**
 * 修改脱敏规则
 * @param
 */
export const editDesensitizationRule = (params) => {
  return request({
    url: 'trans/desensitizationRule/editDesensitizationRule',
    params,
    method: 'get'
  })
}

/**
 * 查询脱敏规则
 * @param
 */
export const getDesensitizationRule = (params) => {
  return request({
    url: 'trans/desensitizationRule/getDesensitizationRule',
    params,
    method: 'get'
  })
}

/**
 *
 * @param
 */
export const getDesensitizationPage = (params) => {
  return request({
    url: 'trans/desensitizationRule/desensitizationRulePage',
    params,
    method: 'get'
  })
}

/**
 *
 * @param
 */
export const queryAllDesensitizationRule = (params) => {
  return request({
    url: 'trans/desensitizationRule/queryAllDesensitizationRule',
    params,
    method: 'get'
  })
}
