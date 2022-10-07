import request from '@/utils/request'
/**
 *
 * @param
 */
export const getAllDateStandardItem = (params) => {
  return request({
    url: 'trans/dataStandard/getAllDataStandardItem',
    params,
    method: 'get'
  })
}
