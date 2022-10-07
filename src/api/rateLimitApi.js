import request from '@/utils/request'

/**
 * 获取分页接口列表
 * @param page
 * @param limit
 */
export const getRateLimits = ({ page, limit }) => {
  const params = { page: page, limit: limit }
  return request({
    url: 'base/gateway/limit/rate',
    params,
    method: 'get'
  })
}

export const addRateLimit = ({ policyName, intervalUnit, totalLimitQuota, ipLimitQuota, cookieLimitQuota, headerLimitKvc, paramLimitKvc }) => {
  const data = {
    policyName: policyName,
    intervalUnit: intervalUnit,
    totalLimitQuota: totalLimitQuota,
    ipLimitQuota: ipLimitQuota,
    cookieLimitQuota: cookieLimitQuota,
    headerLimitKvc: headerLimitKvc,
    paramLimitKvc: paramLimitKvc
  }
  return request({
    url: 'base/gateway/limit/rate/add',
    data,
    method: 'post'
  })
}

/**
 * 更新IP限制
 * @param policyName
 * @param ipAddress
 */
export const updateRateLimit = ({ policyId, policyName, intervalUnit, totalLimitQuota, ipLimitQuota, cookieLimitQuota, headerLimitKvc, paramLimitKvc }) => {
  const data = {
    policyId: policyId,
    policyName: policyName,
    intervalUnit: intervalUnit,
    totalLimitQuota: totalLimitQuota,
    ipLimitQuota: ipLimitQuota,
    cookieLimitQuota: cookieLimitQuota,
    headerLimitKvc: headerLimitKvc,
    paramLimitKvc: paramLimitKvc
  }
  return request({
    url: 'base/gateway/limit/rate/update',
    data,
    method: 'post'
  })
}

/**
 * 删除IP限制
 * @param apiId
 */
export const removeRateLimit = (policyId) => {
  const data = {
    policyId: policyId
  }
  return request({
    url: 'base/gateway/limit/rate/remove',
    data,
    method: 'post'
  })
}

/**
 * 查询策略已绑定API列表
 * @param policyId
 */
export const getRateLimitApis = (data) => {
  return request({
    url: 'base/gateway/limit/rate/api/list',
    params: data,
    method: 'get'
  })
}

/**
 * 绑定API
 * @param policyId
 * @param apiIds
 */
export const addRateLimitApis = ({ policyId, apiIds, oldApiIds }) => {
  const data = {
    policyId: policyId,
    apiIds: apiIds.join(','),
    oldApiIds: oldApiIds.join(',')
  }
  return request({
    url: 'base/gateway/limit/rate/api/update',
    data,
    method: 'post'
  })
}
