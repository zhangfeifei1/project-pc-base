import request from '@/utils/request'

/**
 * 新增包
 */
export const addNewPackage = (params) => {
  return request({
    url: 'diffpackage/zipdiffpackage/save',
    params,
    method: 'post'
  })
}

/**
 * 离线包列表
 */
export const getPackageList = () => {
  return request({
    url: 'diffpackage/zipdiffpackage/page?size=999999',
    method: 'get'
  })
}

/**
 * 离线包管理
 * */
export const deletePackage = (id) => {
  return request({
    url: 'diffpackage/zipdiffpackage/' + id,
    method: 'delete'
  })
}

/**
 * 配置页查询
 */
export const getConfiguration = () => {
  return request({
    url: 'diffpackage/zipdiffconfiguration/page',
    method: 'get'
  })
}

/**
 * 更新配置
 */
export const updateConfiguration = (params) => {
  return request({
    url: 'diffpackage/zipdiffconfiguration/updateById',
    method: 'post',
    params
  })
}

/**
 * 包版本记录查询
 */
export const getHistoryPackage = (params) => {
  return request({
    url: 'diffpackage/zipdiffversion/page',
    method: 'get',
    params
  })
}

/**
 * 创建发布
 */
export const releasePackage = (params) => {
  return request({
    url: 'diffpackage/zipdiffrelease/save',
    data: params,
    method: 'post'
  })
}

/**
 * 查询发布记录
 */
export const releasePackageHistory = (params) => {
  return request({
    url: 'diffpackage/zipdiffrelease/page',
    params,
    method: 'get'
  })
}

/**
 * 发布包记录暂停
 */
export const releasePackageStop = (params) => {
  return request({
    url: 'diffpackage/zipdiffrelease/suspendRelease',
    params,
    method: 'post'
  })
}

/**
 * 发布包记录恢复
 */
export const releasePackageRecovery = (params) => {
  return request({
    url: 'diffpackage/zipdiffrelease/recoverRelease',
    params,
    method: 'post'
  })
}

/**
 * 发布包记录结束
 */
export const releasePackageEnd = (params) => {
  return request({
    url: 'diffpackage/zipdiffrelease/stopRelease',
    params,
    method: 'post'
  })
}
/**
 * 下载AMR文件以及配置文件
 */
export const downloadPackageFile = (params) => {
  return request({
    url: 'diffpackage/zipdiffversion/package/download',
    params,
    method: 'post'
  })
}
