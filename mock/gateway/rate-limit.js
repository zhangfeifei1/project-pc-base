export default [
  {
    url: '/base/gateway/limit/rate',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2020-08-14 15:07:26","updateTime":"2021-07-26 11:06:57","policyId":"1294168737726365698","policyName":"策略0001（示例，可删除）","intervalUnit":"seconds","totalLimitQuota":"10","ipLimitQuota":"34","cookieLimitQuota":"0","headerLimitKvc":"a1,a,4;b1,b,4;c1,,4","paramLimitKvc":"merchantId,1005,20"}],"total":"1","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{},"orderBy":"","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1631087385055"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":"1285480179270946818","extra":{},"timestamp":"1595317332465"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/api/list',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[],"extra":{},"timestamp":"1595317393947"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/api/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595317456745"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/update',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595317496187"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/remove',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595317549927"}', 'isEncrypt': '0' }
    }
  }

]
