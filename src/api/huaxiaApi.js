import request from '@/utils/request'

export const getHxStandardByStandardCode = (data) => {
  return request({
    url: '/standard/frontEndComponents/getHxStandardByStandardCode',
    data,
    method: 'post',
    headers: {
      contentType: 'json'
    }
  })
}

export const getDictionaryStandardByName = (data) => {
  return request({
    url: '/trans/frontEndComponents/getDictionaryStandardByName',
    data,
    method: 'post',
    headers: {
      contentType: 'json'
    }
  })
}

