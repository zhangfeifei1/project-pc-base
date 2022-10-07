/**
 * 权限管理
 */
import request from '@/utils/request'

/**
 * 获取用户已分配权限
 * @param userId
 */
export const getAuthorityUser = (userId) => {
  const params = {
    userId: userId
  }
  return request({
    url: 'base/authority/user',
    params,
    method: 'get'
  })
}

/**
 * 获取角色已分配权限
 * @param roleId
 */
export const getAuthorityRole = (roleId) => {
  const params = {
    roleId: roleId
  }
  return request({
    url: 'base/authority/role',
    params,
    method: 'get'
  })
}

/**
 * 获取应用已分配权限
 * @param roleId
 */
export const getAuthorityApp = (data) => {
  return request({
    url: 'base/authority/app',
    params: data,
    method: 'get'
  })
}
/**
 * 获取应用接口已分配权限
 * @param roleId
 */
// export const getAllAuthorityApp = (appId) => {
//   const data = {
//     appId: appId
//   }
//   return request({
//     url: 'base/api/app/grant',
//     data,
//     method: 'post'
//   })
// }
/**
 * 获取菜单和操作权限列表
 * @param serviceId
 */
export const getAuthorityMenu = () => {
  return request({
    url: 'base/authority/menu',
    method: 'get'
  })
}

/**
 * 获取API权限列表 右侧分页
 * @param serviceId
 */
export const getAuthorityApi = (data) => {
  return request({
    url: 'base/authority/apiPage',
    method: 'get',
    params: data
  })
}
/**
 * 获取所有API接口权限列表 第4栏
 * @param serviceId
 */
export const getAllAuthorityApi = (appId) => {
  const params = {
    appId: appId
  }
  return request({
    url: 'base/api/app/listByAppId',
    method: 'get',
    params
  })
}
/**
 * 获取按钮权限
 * @param serviceId
 */
export const getAuthorityAction = (data) => {
  return request({
    url: 'base/authority/action',
    params: data,
    method: 'get'
  })
}

/**
 * 用户授权
 * @param userId
 */
export const grantAuthorityUser = ({ userId, expireTime, authorityIds }) => {
  const data = {
    userId: userId,
    expireTime: expireTime,
    authorityIds: authorityIds.join(',')
  }
  return request({
    url: 'base/authority/user/grant',
    data,
    method: 'post'
  })
}

/**
 * 角色授权
 * @param userId
 */
export const grantAuthorityRole = ({ roleId, expireTime, authorityIds }) => {
  const data = {
    roleId: roleId,
    expireTime: expireTime,
    authorityIds: authorityIds.join(',')
  }
  return request({
    url: 'base/authority/role/grant',
    data,
    method: 'post'
  })
}

/**
 * 应用授权
 * @param userId
 */
export const grantAuthorityApp = ({ appId, expireTime, authorityIds, oldAuthorityIds }) => {
  const data = {
    appId: appId,
    expireTime: expireTime,
    authorityIds: authorityIds.join(','),
    oldAuthorityIds: oldAuthorityIds.join(',')
  }
  return request({
    url: 'base/authority/app/grantUpdate',
    data,
    method: 'post'
  })
}
/**
 * 应用授权
 * @param userId
 */
export const grantAllAuthorityApp = ({ appId, apiIds, oldApiIds }) => {
  const data = {
    appId: appId,
    apiIds: apiIds.join(','),
    oldApiIds: oldApiIds.join(',')
  }
  return request({
    url: 'base/api/app/grantUpdate',
    data,
    method: 'post'
  })
}

/**
 * 操作功能授权
 * @param actionId
 * @param apiIds
 */
export const grantAuthorityAction = ({ actionId, authorityIds, oldAuthorityIds }) => {
  const data = {
    actionId: actionId,
    authorityIds: authorityIds.join(','),
    oldAuthorityIds: oldAuthorityIds.join(',')
  }
  return request({
    url: 'base/authority/action/grantUpdate',
    data,
    method: 'post'
  })
}
