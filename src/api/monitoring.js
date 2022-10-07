import request from '@/utils/request'
/**
 * 崩溃日志
 */
export const crashLogs = (data) => {
  return request({
    url: 'behavior/reportForm/getCrashLogs',
    data,
    method: 'post'
  })
}
/**
 * 卡顿分析
 */
export const blockLogsList = (data) => {
  return request({
    url: 'behavior/reportForm/getApmLogs',
    data,
    method: 'post'
  })
}
// 卡顿日志查看
export const blockOneLog = (data) => {
  return request({
    url: 'behavior/reportForm/getOneLogs',
    data,
    method: 'post'
  })
}
/**
 * 错误分析
 */
export const errorLogsList = (data) => {
  return request({
    url: 'behavior/reportForm/getErrorLogs',
    data,
    method: 'post'
  })
}
/**
 * 异常概览
 */
export const getLogsRatio = (params) => {
  return request({
    url: 'behavior/reportForm/getLogsRatio',
    params,
    method: 'get'
  })
}
/**
 * 日志拉取
 */
export const getPageList = (params) => {
  return request({
    url: '/behavior/behaviorLogsPullRule/getPageList',
    params,
    method: 'get'
  })
}
// 上传日志配置
export const getLogConfig = (params) => {
  return request({
    url: '/behavior/mongo/getLogConfig',
    params,
    method: 'get'
  })
}
// 修改日志配置
export const updateLogConfig = (params) => {
  return request({
    url: '/behavior/mongo/updateLogConfig ',
    data: params,
    method: 'post'
  })
}
/**
 * 触发
 */
export const pull = (data) => {
  return request({
    url: '/behavior/behaviorLogsPullRule/pull',
    data,
    method: 'post'
  })
}
// 下载日志
export const downloadPull = (data) => {
  return request({
    url: '/behavior/logsFile/download',
    data,
    method: 'post'
  })
}
/**
 * 删除
 */
export const deleteLog = (data) => {
  return request({
    url: '/behavior/behaviorLogsPullRule/delete',
    data,
    method: 'post'
  })
}
/**
 * 添加日志
 */
export const addLogList = (data) => {
  return request({
    url: '/behavior/behaviorLogsPullRule/add',
    data,
    method: 'post'
  })
}
