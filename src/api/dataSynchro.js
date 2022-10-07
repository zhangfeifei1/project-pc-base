import request from '@/utils/request'
/**
 * 数据同步 配置管理分页查询
 */
export const getDataSynchroConfig = (params) => {
  return request({
    url: 'journal/mobileSyncConfig/pageList',
    method: 'get',
    params
  })
}

/**
 * 配置管理上下线
 */
export const configONOFFline = (params) => {
  return request({
    url: 'journal/mobileSyncConfig/updateStatus',
    data: params,
    method: 'post',
    headers: {
      contentType: 'json'
    }
  })
}

/**
 * 配置管理修改
 */
export const configEdit = (data) => {
  return request({
    url: 'journal/mobileSyncConfig/edit',
    data,
    method: 'post',
    headers: {
      contentType: 'json'
    }
  })
}

/**
 * 配置管理新增
 */
export const configAdd = (data) => {
  return request({
    url: 'journal/mobileSyncConfig/add',
    data,
    method: 'post',
    headers: {
      contentType: 'json'
    }
  })
}
/**
 * 配置管理删除
 */
export const configDelete = (data) => {
  return request({
    url: 'journal/mobileSyncConfig/removeById',
    data,
    method: 'post',
    headers: {
      contentType: 'json'
    }
  })
}
/**
 * 数据同步 服务管理开关查询
 */
export const serviceSearch = () => {
  return request({
    url: 'storage/mpaas/sysConfig/getSignInfo',
    method: 'get'
  })
}

/**
 * 数据同步  服务管理开关切换
 */
export const serviceSwitch = (params) => {
  return request({
    url: 'storage/sysConfig/updateSign',
    data: params,
    method: 'post',
    headers: {
      contentType: 'json'
    }
  })
}

/**
 * 配置管理 新建同步
 */
export const configAddSynchro = (params) => {
  return request({
    url: 'journal/mobileSyncConfig/send',
    data: params,
    method: 'post'
  })
}

/**
 *  数据查询表格
 */
export const dataSearchTable1 = (params) => {
  return request({
    url: 'journal/mobileSyncMsg/getInfo',
    method: 'get',
    params
  })
}
/**
 * 用户/设备状态查询
 */
export const status = (params) => {
  return request({
    url: 'journal/mobileSyncMsg/status',
    method: 'get',
    params
  })
}
