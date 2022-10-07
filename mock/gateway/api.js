export default [
  {
    url: '/base/gateway/service/list',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[{"serviceId":"loongeasy-cloud-base-server","serviceName":"平台基础服务器"},{"serviceId":"loongeasy-cloud-uaa-admin-server","serviceName":"平台用户认证服务器"},{"serviceId":"loongeasy-cloud-uaa-portal-server","serviceName":"门户开发者认证服务器"},{"serviceId":"loongeasy-cloud-msg-server","serviceName":"消息服务器"},{"serviceId":"loongeasy-cloud-task-server","serviceName":"工作流服务器"},{"serviceId":"loongeasy-cloud-bpm-server","serviceName":"工作流服务器"},{"serviceId":"loongeasy-cloud-generator-server","serviceName":"在线代码生成服务器"},{"serviceId":"wcb-myaccount","serviceName":"微信银行账户查询服务"},{"serviceId":"wcb-auth","serviceName":"微信OAuth2授权服务"},{"serviceId":"wcb-binding","serviceName":"微信银行绑卡服务"},{"serviceId":"wcb-ereceiptapp","serviceName":"微信银行电子回单申请服务"},{"serviceId":"wcb-reportdemo","serviceName":"微信银行报表DEMO"},{"serviceId":"wcb-msg-log","serviceName":"微信银行异步处理日志查询服务"},{"serviceId":"wcb-msg-pusher","serviceName":"微信银行消息推送服务"},{"serviceId":"loongeasy-cloud-txconfig-server","serviceName":"交易配置服务器"},{"serviceId":"beai-mobilebank","serviceName":"beai手机银行后台服务"},{"serviceId":"beai-intelliroute","serviceName":"智能路由"},{"serviceId":"beai-routemanage","serviceName":"智能路由后管"}],"extra":{},"timestamp":"1595316299118"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2020-06-30 15:45:01","updateTime":"2020-07-08 14:51:44","apiId":"1277870741110411266","apiCode":"api00000000000000000000000000033","apiName":"查询转账交易列表","serviceId":"beai-mobilebank","apiCategory":"default","path":"/queryTransFlow","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:54:14","updateTime":"2020-06-22 08:54:14","apiId":"1274868261132959745","apiCode":"api00000000000000000000000000032","apiName":"动态配置---查询表列","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/queryTableColumns","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:52:57","updateTime":"2020-06-22 08:52:57","apiId":"1274867937936670722","apiCode":"api00000000000000000000000000031","apiName":"动态配置---查询数据库表","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/queryTableList","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:38:06","updateTime":"2020-06-22 08:38:06","apiId":"1274864202380476418","apiCode":"api00000000000000000000000000030","apiName":"动态配置---修改","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/updateConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:36:12","updateTime":"2020-06-22 08:36:12","apiId":"1274863722107502594","apiCode":"api00000000000000000000000000029","apiName":"动态配置---删除","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/deleteConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:33:00","updateTime":"2020-06-22 08:33:00","apiId":"1274862917765824514","apiCode":"api00000000000000000000000000028","apiName":"动态配置---更新","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/renewConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-19 08:38:31","updateTime":"2020-06-19 08:38:31","apiId":"1273777143112794114","apiCode":"api00000000000000000000000000027","apiName":"智能路由后管服务","serviceId":"beai-routemanage","apiCategory":"default","path":"/**","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-17 13:56:15","updateTime":"2020-06-17 13:56:15","apiId":"1273132327098122242","apiCode":"api00000000000000000000000000026","apiName":"重新加载路由模板","serviceId":"beai-intelliroute","apiCategory":"default","path":"/reload","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-17 13:54:39","updateTime":"2020-06-17 13:54:39","apiId":"1273131923538968577","apiCode":"api00000000000000000000000000025","apiName":"跨行转账","serviceId":"beai-mobilebank","apiCategory":"default","path":"/transfer","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-17 10:43:52","updateTime":"2020-06-22 08:33:34","apiId":"1273083912666480641","apiCode":"api00000000000000000000000000024","apiName":"动态配置---发布","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/publishConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0}],"total":"167","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{"NONCE":"qfxefqg8wcp","SIGN":"FC4736DB358F8C2C0B7AE7DCF7FB6F4D0AFFE19E3852729E91CA388704CE4778","SIGN_TYPE":"SHA256","TIMESTAMP":"20200721152350","apiCode":"","apiName":"","path":"","serviceId":""},"orderBy":"","searchCount":true,"pages":"17"},"extra":{},"timestamp":"1595316299440"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595316463335"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api/update',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595316520484"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api/remove',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595316567687"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/journal/mobileSyncConfig/pageList',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[],"total":"0","size":"10","current":"1","searchCount":true,"pages":"0"},"extra":{},"timestamp":"1595316567687"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/mobilepush/mobilePushMsg/pageList',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"action":"webUrl","content":"xiaomi","createTime":"2021-09-06 15:30:20","expDate":"0","expireTime":"2021-09-06 15:30:20","extStatus":"false","id":"1434780992750813186","msgType":"0","notifyType":"defaul","pushTime":"2021-09-06 15:30:20","status":0,"targetId":"userId666","targetType":"0","title":"test","updateTime":"2021-09-06 15:30:20","viewType":"notiMsg"},{"action":"activity","content":"我ios","createTime":"2021-09-02 11:21:39","expireTime":"2021-09-02 11:21:39","id":"1433268856991395842","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 11:21:39","status":0,"targetId":"OFFLINOK","targetType":"0","title":"ios","updateTime":"2021-09-02 11:21:39","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 11:03:01","expireTime":"2021-09-02 11:03:01","id":"1433264166803222530","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 11:03:01","status":0,"targetId":"OFFLINOK","targetType":"0","title":"ios","updateTime":"2021-09-02 11:03:01","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 11:02:16","expireTime":"2021-09-02 11:02:16","id":"1433263980425129986","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 11:02:16","status":0,"targetId":"userId888","targetType":"0","title":"ios","updateTime":"2021-09-02 11:02:16","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 11:00:28","expireTime":"2021-09-02 11:00:28","id":"1433263527629041666","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 11:00:28","status":0,"targetId":"userId888","targetType":"0","title":"ios","updateTime":"2021-09-02 11:00:28","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 10:59:58","expireTime":"2021-09-02 10:59:58","id":"1433263402181603330","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 10:59:58","status":0,"targetId":"userId888","targetType":"0","title":"ios","updateTime":"2021-09-02 10:59:58","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 10:51:13","expireTime":"2021-09-02 10:51:13","id":"1433261198582362113","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 10:51:13","status":0,"targetId":"userId888","targetType":"0","title":"ios","updateTime":"2021-09-02 10:51:13","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 10:48:36","expireTime":"2021-09-02 10:48:36","id":"1433260538226946049","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 10:48:36","status":0,"targetId":"userId888","targetType":"0","title":"ios","updateTime":"2021-09-02 10:48:36","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 10:21:30","expireTime":"2021-09-02 10:21:30","id":"1433253720025083905","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 10:21:30","status":0,"targetId":"userId888","targetType":"0","title":"ios","updateTime":"2021-09-02 10:21:30","viewType":"0"},{"action":"activity","content":"我ios","createTime":"2021-09-02 10:18:10","expireTime":"2021-09-02 10:18:10","id":"1433252881743097858","msgType":"0","notifyType":"defaul","pushTime":"2021-09-02 10:18:10","status":0,"targetId":"userId888","targetType":"0","title":"ios","updateTime":"2021-09-02 10:18:10","viewType":"0"}],"total":"71","size":"10","current":"1","searchCount":true,"pages":"8"},"extra":{},"timestamp":"1595316567687"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/mobilepush/mobilePushTemplate/pageList',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"id":"1427847761455509505","templateName":"cccc","templateDesc":"创建模板","title":"创建模板","content":"测试测试","viewType":0,"action":0,"jumpUrl":"www.baidu.com","status":0,"createTime":"2021-08-18 12:20:09","updateTime":"2021-08-18 12:20:09"}],"total":"1","size":"10","current":"1","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1595316567687"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/diffpackage/zipdiffpackage/page',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2021-07-13 15:45:22","updateTime":"2021-07-13 15:45:22","id":"1414853441975095298","packageId":"00000003","packageName":"aaaa","packageDesc":"aaaa","remark":""},{"createTime":"2021-07-28 15:27:38","updateTime":"2021-07-28 15:27:38","id":"1420284795822592001","packageId":"00000066","packageName":"test","packageDesc":"test-test","remark":""},{"createTime":"2021-07-28 15:41:30","updateTime":"2021-07-28 15:41:30","id":"1420288286976692226","packageId":"00000067","packageName":"qqq","packageDesc":"qqq","remark":""},{"createTime":"2021-07-28 16:38:20","updateTime":"2021-07-28 16:38:20","id":"1420302588731248641","packageId":"00000068","packageName":"www","packageDesc":"www","remark":""},{"createTime":"2021-09-07 16:25:44","updateTime":"2021-09-07 16:25:44","id":"1435157319483998209","packageId":"00000099","packageName":"qwer","packageDesc":"qwer","remark":""},{"createTime":"2021-09-07 16:32:34","updateTime":"2021-09-07 16:32:34","id":"1435159043070312449","packageId":"00000100","packageName":"t100","packageDesc":"t100","remark":""},{"createTime":"2021-09-08 10:24:34","updateTime":"2021-09-08 10:24:34","id":"1435428816605757442","packageId":"00000102","packageName":"102","packageDesc":"102","remark":""}],"total":"7","size":"10","current":"1","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1595316567687"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/diffpackage/zipdiffversion/page',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2021-07-13 15:45:22","updateTime":"2021-07-13 15:45:22","id":"1414853441975095298","packageId":"00000003","packageName":"aaaa","packageDesc":"aaaa","remark":""},{"createTime":"2021-07-28 15:27:38","updateTime":"2021-07-28 15:27:38","id":"1420284795822592001","packageId":"00000066","packageName":"test","packageDesc":"test-test","remark":""},{"createTime":"2021-07-28 15:41:30","updateTime":"2021-07-28 15:41:30","id":"1420288286976692226","packageId":"00000067","packageName":"qqq","packageDesc":"qqq","remark":""},{"createTime":"2021-07-28 16:38:20","updateTime":"2021-07-28 16:38:20","id":"1420302588731248641","packageId":"00000068","packageName":"www","packageDesc":"www","remark":""},{"createTime":"2021-09-07 16:25:44","updateTime":"2021-09-07 16:25:44","id":"1435157319483998209","packageId":"00000099","packageName":"qwer","packageDesc":"qwer","remark":""},{"createTime":"2021-09-07 16:32:34","updateTime":"2021-09-07 16:32:34","id":"1435159043070312449","packageId":"00000100","packageName":"t100","packageDesc":"t100","remark":""},{"createTime":"2021-09-08 10:24:34","updateTime":"2021-09-08 10:24:34","id":"1435428816605757442","packageId":"00000102","packageName":"102","packageDesc":"102","remark":""}],"total":"7","size":"10","current":"1","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1595316567687"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/diffpackage/zipdiffgroup/page',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2021-07-13 16:05:46","updateTime":"2021-07-13 16:05:46","id":"1414858576440725505","groupId":"111111","groupName":"baimingdan","type":"0","regExp":"","userCount":"5","remark":""},{"createTime":"2021-07-14 15:03:21","updateTime":"2021-07-14 15:03:21","id":"1415205258072383490","groupId":"123456","groupName":"测试","type":"0","regExp":"","userCount":"1","remark":""},{"createTime":"2021-07-14 16:07:55","updateTime":"2021-07-14 16:07:55","id":"1415221505237409794","groupId":"222222","groupName":"ceshi","type":"0","regExp":"","userCount":"0","remark":""},{"createTime":"2021-07-28 16:05:11","updateTime":"2021-07-28 16:05:11","id":"1420294248429047809","groupId":"888888","groupName":"即将发版","type":"0","regExp":"","userCount":"4","remark":""}],"total":"4","size":"10","current":"1","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1631095791003"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/diffpackage/zipdiffconfiguration/page',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2021-02-10 14:09:53","updateTime":"2021-02-10 14:09:53","id":"1","virtualName":"http://www.loongeasy.com","keyName":"pkcs8_private_key.pem","remark":""}],"total":"1","size":"10","current":"1","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1631096199007"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/mobilepush/mobilePushTemplate/list',
    type: 'get',
    response: config => {
      return { 'response': '{"data":[{"id":"1427847761455509505","templateName":"cccc","templateDesc":"创建模板","title":"创建模板","content":"测试测试","viewType":0,"action":0,"jumpUrl":"www.baidu.com","status":0,"createTime":"2021-08-18 12:20:09","updateTime":"2021-08-18 12:20:09"}],"message":"操作成功","returnCode":"000000"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/dynamic/rule/festivalPageList',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[],"total":"0","size":"10","current":"1","searchCount":true,"pages":"0"},"extra":{},"timestamp":"1631093714662"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/dynamic/app/appList',
    type: 'post',
    response: config => {
    }
  },
  {
    url: '/dynamic/comp/getAllAppComp',
    type: 'get',
    response: config => {
    }
  }

]
