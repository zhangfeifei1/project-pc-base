import request from '@/utils/request'

// 查询task列表
export function listTask(query) {
  return request({
    url: 'activiti/task/list',
    method: 'post',
    data: query
  })
}

// 查询表单
export function formDataShow(data) {
  return request({
    url: '/activitidemo/actwf/taskDetail',
    method: 'post',
    data
  })
}

// 任务审核
export function formDataSave(data) {
  return request({
    url: '/activitidemo/actwf/taskAuth',
    method: 'post',
    data,
    headers: {
      contentType: 'json'
    }
  })
}

// 1
export function getDataByBusinessKey(data) {
  return request({
    url: '/activiti/historyDataService/getDataByBusinessKey',
    method: 'post',
    data
  })
}

// 2
export function selectWorkflowLeaveById(query) {
  return request({
    url: '/activitidemo/workflow/selectWorkflowLeaveById',
    method: 'get',
    params: query
  })
}
