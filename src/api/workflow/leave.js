import request from '@/utils/request'

// 查询请假列表
export function listLeave(data) {
  return request({
    url: '/activitidemo/actwf/selectInstancePageList',
    method: 'post',
    data
  })
}
// 查询请假列表
export function listLeaveAll(params) {
  return request({
    url: '/activitidemo/workflow/leave/list',
    method: 'get',
    params
  })
}

// 查询请假详细
export function getLeave(data) {
  return request({
    url: '/workflow/leave',
    method: 'post',
    data
  })
}

// 新增请假
export function addLeave(data) {
  return request({
    url: '/activitidemo/workflow/leave',
    method: 'post',
    data
  })
}

// 修改请假
export function updateLeave(data) {
  return request({
    url: '/workflow/leave',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delLeave(id) {
  return request({
    url: '/workflow/leave/' + id,
    method: 'delete'
  })
}

// 导出请假
export function exportLeave(query) {
  return request({
    url: '/workflow/leave/export',
    method: 'get',
    params: query
  })
}
