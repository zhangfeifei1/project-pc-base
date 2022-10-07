import request from '@/utils/request'

export const getCity = (data) => {
  return request({
    url: 'base/region/closeChildrenRegion',
    data,
    method: 'post'
  })
}
