import request from '@/utils/request'
/**
  查询华夏银行数据首页数据
 */
export const getHxStandardItemPage = (params) => {
  return request({
    url: '/standard/hxStandard/getHxStandardItemPage',
    params,
    method: 'get'
  })
}

/**
  查询华夏银行数据普通代码以及多值代码
 */
export const getHxOption = (params) => {
  return request({
    url: '/standard/hxStandard/getHxOption',
    params,
    method: 'get'
  })
}

/**
  查询华夏银行数据多级代码
 */
export const getHxOptionForLevel = (params) => {
  return request({
    url: '/standard/hxStandard/getHxOptionForLevel',
    params,
    method: 'get'
  })
}
