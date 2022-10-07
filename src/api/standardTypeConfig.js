import request from '@/utils/request'

/**
 * 新增枚举类型
 * @param data 新增
 */
export const addNewStandard = (data) => {
  const url = '/trans/dataStandard/saveDataStandard'
  return request({
    url: url,
    method: 'post',
    data,
    headers: {
      contentType: 'json'
    }
  })
}

/**
 * 查询枚举
 * @param
 */
export const searchStandard = (params) => {
  return request({
    url: '/trans/dataStandard/getDataStandardItemPage',
    params,
    method: 'get'
  })
}

/**
 * 查询枚举项
 * @param
 */
export const searchStandardTerm = (params) => {
  return request({
    url: '/trans/dataStandard/getDataStandardOptionList',
    params,
    method: 'get'
  })
}

/**
 * 删除枚举类型
 * @param data 删除
 */
export const deleteStandard = (data) => {
  const url = '/trans/dataStandard/deleteDataStandardById'
  return request({
    url: url,
    method: 'post',
    data,
    headers: {
      contentType: 'json'
    }
  })
}

/**
 * 添加枚举项
 * @param data
 */
export const addNewStandardTerm = (data) => {
  const url = '/trans/dataStandard/addDataStandardOption'
  return request({
    url: url,
    method: 'post',
    data,
    headers: {
      contentType: 'json'
    }
  })
}

/**
 * 更新枚举配置加枚举项
 * @param data
 */
export const updateStandard = (data) => {
  const url = '/trans/dataStandard/updateDataStandard'
  return request({
    url: url,
    method: 'post',
    data,
    headers: {
      contentType: 'json'
    }
  })
}
