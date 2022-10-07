import request from '@/utils/request'
/**
 *
 * @param
 */
export const getSimpleHxItem = (params) => {
  return request({
    url: '/standard/hxStandard/getSimpleHxItem',
    params,
    method: 'get'
  })
}
