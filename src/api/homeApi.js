import request from '@/utils/request'
/**

 */
export const getHomeList = (params) => {
  return request({
    url: '/monitor/system/health',
    params,
    method: 'get'
  })
}

export const getVisitList = (params) => {
  return request({
    url: '/base/gateway/count',
    params,
    method: 'post'
  })
}
