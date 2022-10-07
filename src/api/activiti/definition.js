import request from '@/utils/request'

// 查询modeler列表
export function listDefinition(data) {
  return request({
    url: 'activiti/processDefinition/selectProcessDefinitionList',
    method: 'post',
    data,
    headers: {
      contentType: 'json'
    }
  })
}

// 查询请假详细
export function getDefinitionsByInstanceId(data) {
  return request({
    url: 'activiti/processDefinition/getDefinitionsByInstanceId',
    method: 'post',
    data
  })
}

// 挂起激活转换
export function suspendOrActiveApply(data) {
  return request({
    url: 'activiti/processDefinition/suspendOrActiveApply',
    method: 'post',
    data
  })
}

// 删除Modeler
export function delDefinition(data) {
  return request({
    url: 'activiti/processDefinition/deleteProcessDefinitionById',
    method: 'post',
    data
  })
}

