import request from '@/utils/request'

/**
 * 获取应用列表
 * @param page
 * @param limit
 */
export const getApps = ({ page, limit, appId, appName, appNameEn }) => {
  const params = { page: page, limit: limit, appId: appId, appName: appName, appNameEn: appNameEn }
  return request({
    url: 'base/app',
    params,
    method: 'get'
  })
}

/**
 * 添加应用信息
 * @param appName
 * @param appNameEn
 * @param appType
 * @param appIcon
 * @param appOs
 * @param appDesc
 * @param status
 * @param website
 * @param userId
 * @param userType
 */
export const addApp = ({ appName, appNameEn, appType, vHost, appIcon, appDesc, status, website, developerId, appSymmetricEncryptionType, appAsymmetricEncryptionType }) => {
  const data = {
    appName: appName,
    appNameEn: appNameEn,
    appType: appType,
    vHost: vHost,
    appIcon: appIcon,
    appDesc: appDesc,
    status: status,
    website: website,
    developerId: developerId,
    appSymmetricEncryptionType: appSymmetricEncryptionType,
    appAsymmetricEncryptionType: appAsymmetricEncryptionType
  }
  return request({
    url: 'base/app/add',
    data,
    method: 'post'
  })
}

/**
 * 更新应用信息
 * @param appId
 * @param appName
 * @param appNameEn
 * @param appType
 * @param appIcon
 * @param appOs
 * @param appDesc
 * @param status
 * @param website
 * @param userId
 * @param userType
 */
export const updateApp = ({ appId, appName, appNameEn, appType, vHost, appIcon, appDesc, status, website, developerId, appSymmetricEncryptionType, appAsymmetricEncryptionType }) => {
  const data = {
    appId: appId,
    appName: appName,
    appNameEn: appNameEn,
    appType: appType,
    vHost: vHost,
    appIcon: appIcon,
    appDesc: appDesc,
    status: status,
    website: website,
    developerId: developerId,
    appSymmetricEncryptionType: appSymmetricEncryptionType,
    appAsymmetricEncryptionType: appAsymmetricEncryptionType
  }
  return request({
    url: 'base/app/update',
    data,
    method: 'post'
  })
}

/**
 * 完善应用开发信息
 * @param appId
 * @param grantTypes
 * @param redirectUrls
 * @param scopes
 * @param accessTokenValidity
 * @param refreshTokenValidity
 * @param autoApproveScopes
 */
export const updateAppClientInfo = ({ appId, grantTypes, redirectUrls, scopes, accessTokenValidity, refreshTokenValidity, autoApproveScopes, userInfoUrl, authorityResourceUrl, userAuthUrl }) => {
  const data = {
    appId: appId,
    grantTypes: grantTypes.join(','),
    redirectUrls: redirectUrls,
    scopes: scopes.join(','),
    accessTokenValidity: accessTokenValidity,
    refreshTokenValidity: refreshTokenValidity,
    autoApproveScopes: autoApproveScopes.join(','),
    userInfoUrl: userInfoUrl,
    authorityResourceUrl: authorityResourceUrl,
    userAuthUrl: userAuthUrl
  }
  return request({
    url: 'base/app/client/update',
    data,
    method: 'post'
  })
}

/**
 * 删除应用
 * @param appId
 */
export const removeApp = ({ appId }) => {
  const data = {
    appId: appId
  }
  return request({
    url: 'base/app/remove',
    data,
    method: 'post'
  })
}

/**
 * 重置秘钥
 * @param appId
 */
export const restApp = ({ appId }) => {
  const data = {
    appId: appId
  }
  return request({
    url: 'base/app/reset',
    data,
    method: 'post'
  })
}
/**
 * 重置非对称加密公钥
 * @param appId
 * @param appAsymmetricEncryptionType
 */
export const restEncreptKeyApp = ({ appId, appAsymmetricEncryptionType }) => {
  const data = {
    appId: appId,
    appAsymmetricEncryptionType: appAsymmetricEncryptionType
  }
  return request({
    url: 'base/app/updateEncryptionKey',
    data,
    method: 'post'
  })
}

/**
 * 获取应用信息
 * @param appId
 */
export const getAppInfo = ({ appId }) => {
  return request({
    url: `base/app/${appId}/info`,
    method: 'get'
  })
}

/**
 * 获取应用开发信息
 * @param clientId
 */
export const getAppClientInfo = ({ clientId }) => {
  return request({
    url: `base/app/client/${clientId}/info`,
    method: 'get'
  })
}
