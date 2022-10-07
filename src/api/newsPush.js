import request from '@/utils/request'

/**
 * 新建推送消息
 */
export const addNewsPush = (params) => {
  return request({
    url: 'mobilepush/mobilePushMsg/add',
    data: params,
    method: 'post'
  })
}
/**
 * 消息列表分页查询1
 */
export const newsListSearch = (params) => {
  return request({
    url: 'mobilepush/mobilePushMsg/pageList',
    method: 'get',
    params
  })
}
/**
 * 消息模板分页查询3
 */
export const mubanPageSearch = (params) => {
  return request({
    url: 'mobilepush/mobilePushTemplate/pageList',
    method: 'get',
    params
  })
}
/**
 * 消息模板添加3
 */
export const addMuban = (params) => {
  return request({
    url: 'mobilepush/mobilePushTemplate/add',
    data: params,
    method: 'post'
  })
}
/**
 * 消息模板删除3
 */
export const deleteMuban = (params) => {
  return request({
    url: 'mobilepush/mobilePushTemplate/removeById',
    data: params,
    method: 'post'
  })
}

/**
 *  查询模板文件
 */
export const searchMubanAll = () => {
  return request({
    url: 'mobilepush/mobilePushTemplate/list',
    method: 'get'
  })
}
/**
 *  查询移动分析人群模板
 */
export const searchGroupMuban = () => {
  return request({
    url: 'mobilepush/mobilePushMsg/userGroupList',
    method: 'get'
  })
}

/**
 *  推送配置查询4
 */
export const pushConfig = (params) => {
  return request({
    url: 'mobilepush/mobilePushConfig/pushList',
    method: 'get',
    params
  })
}
/**
 *  密钥配置查询5
 */
export const keyConfig = (params) => {
  return request({
    url: 'mobilepush/mobilePushConfig/secretList',
    method: 'get',
    params
  })
}
/**
 *  渠道配置查询6
 */
export const channelConfig = (params) => {
  return request({
    url: 'mobilepush/mobilePushConfig/channelList',
    method: 'get',
    params
  })
}

/**
 * 配置统一接口
 */
export const allConfig = (params) => {
  return request({
    url: 'mobilepush/mobilePushConfig/saveOrUpdate',
    data: params,
    method: 'post'
  })
}

/**
 *  查询文件统一接口
 */
export const searchFile = (params) => {
  return request({
    url: 'mobilepush/mobilePushConfig/' + params.id,
    method: 'get'
  })
}
// 下载文件
export const fileDownload = (params) => {
  return request({
    url: '/mobilepush/mobilePushConfig/download',
    method: 'post',
    data: params,
    headers: {
      responseType: 'blob'
    }
  })
}

/**
 *  数量统计图表
 */
export const numEchart = (params) => {
  return request({
    url: 'mobilepush/mpaas/report/mpsNumberRep',
    method: 'get',
    params
  })
}
/**
 *  比例统计图表
 */
export const scaleEchart = (params) => {
  return request({
    url: 'mobilepush/mpaas/report/mpsPercentRep',
    method: 'get',
    params
  })
}
