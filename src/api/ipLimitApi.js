import request from '@/utils/request'

/**
 * 获取分页接口列表
 * @param page
 * @param limit
 */
export const getIpLimits = ({ page, limit, policyName }) => {
  const params = { page: page, limit: limit, policyName: policyName }
  return request({
    url: 'base/gateway/limit/ip',
    params,
    method: 'get'
  })
}

export const addIpLimit = ({ policyName, policyType, ipAddress, bl, customType, customKv }) => {
  const data = {
    policyName: policyName,
    policyType: policyType,
    ipAddress: ipAddress,
    bl: bl,
    customType: customType,
    customKv: customKv
  }
  return request({
    url: 'base/gateway/limit/ip/add',
    data,
    method: 'post'
  })
}

/**
 * 更新IP限制
 * @param policyName
 * @param policyType
 * @param ipAddress
 */
export const updateIpLimit = ({ policyId, policyName, policyType, ipAddress, bl, customType, customKv }) => {
  const data = {
    policyId: policyId,
    policyName: policyName,
    policyType: policyType,
    ipAddress: ipAddress,
    bl: bl,
    customType: customType,
    customKv: customKv
  }
  return request({
    url: 'base/gateway/limit/ip/update',
    data,
    method: 'post'
  })
}

/**
 * 删除IP限制
 * @param apiId
 */
export const removeIpLimit = (policyId) => {
  const data = {
    policyId: policyId
  }
  return request({
    url: 'base/gateway/limit/ip/remove',
    data,
    method: 'post'
  })
}

/**
 * 查询策略已绑定API列表
 * @param policyId
 */
export const getIpLimitApis = (data) => {
  return request({
    url: 'base/gateway/limit/ip/api/list',
    params: data,
    method: 'get'
  })
}

/**
 * 绑定API
 * @param policyId
 * @param apiIds
 */
export const addIpLimitApis = ({ policyId, apiIds, oldApiIds }) => {
  const data = {
    policyId: policyId,
    apiIds: apiIds.join(','),
    oldApiIds: oldApiIds.join(',')
  }
  return request({
    url: 'base/gateway/limit/ip/api/update',
    data,
    method: 'post'
  })
}
