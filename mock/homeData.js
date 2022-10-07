export default [
  {
    url: '/monitor/system/health',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode": "000000","message": "success","path": "","data": {"components": [{"systemId": "00001", "subGroupName": "web", "healthyDegree": "100.0000%","timestamp": "2020-09-25 10:00:00"},{ "systemId": "00001", "subGroupName": "gateway","healthyDegree": "100.0000%","timestamp": "2020-09-25 10:00:00"},{"systemId": "00001", "subGroupName": "frontend","healthyDegree": "100.0000%","timestamp": "2020-09-25 10:00:00"}],"system": { "systemId": "00001", "healthyDegree": "100.0000%","timestamp": "2020-09-25 10:00:00" }, "performance": {"tradeCount": "16", "businessSuccRate": "68.7500%","appSuccRate": "100.0000%","useTime": "217ms","timestamp": "2020-09-25 10:00:00"}},"extra": {},"timestamp": "1601256741994"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/count',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[{"counts":"1676","days":"2021-09-01"},{"counts":"1180","days":"2021-09-02"},{"counts":"579","days":"2021-09-03"},{"counts":"1","days":"2021-09-04"},{"counts":"0","days":"2021-09-05"},{"counts":"824","days":"2021-09-06"},{"counts":"1751","days":"2021-09-07"}],"extra":{},"timestamp":"1631007249923"}', 'isEncrypt': '0' }
    }
  }
]

