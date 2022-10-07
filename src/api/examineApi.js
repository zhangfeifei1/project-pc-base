import request from '@/utils/request'

export const getAuthorityList = ({ page: page, limit: limit }) => {
  const params = { page: page, limit: limit }
  return request({
    url: 'trans/authorize/tasklist',
    params,
    method: 'get'
  })
}
export const setApprove = (data) => {
  return request({
    url: 'trans/authorize/approve',
    data,
    method: 'post'
  })
}
