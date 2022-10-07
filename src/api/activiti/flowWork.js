import request from '@/utils/request'
// 查询请假详细
export function selectHistoryDataPage(data) {
  return request({
    url: '/activiti/historyDataService/selectHistoryDataPage',
    method: 'post',
    data
  })
}

