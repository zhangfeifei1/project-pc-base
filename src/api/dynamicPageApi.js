import request from '@/utils/request'
/**
 * 获取app列表
 */
export const appList = (data) => {
  return request({
    url: 'dynamic/app/appList',
    data,
    method: 'post'
  })
}
/**
 * 新建App
 */
export const createApp = (data) => {
  return request({
    url: 'dynamic/app/createApp',
    data,
    method: 'post'
  })
}
/**
 * 删除app
 */
export const deleteApp = (data) => {
  return request({
    url: 'dynamic/app/deleteApp',
    data,
    method: 'post'
  })
}
/**
 * 页面编辑——公共组件获取
 */
export const getAllAppComp = (params) => {
  return request({
    url: 'dynamic/comp/getAllAppComp',
    params,
    method: 'get'
  })
}
/**
 * 新建页面
 */
export const createPage = (data) => {
  return request({
    url: 'dynamic/page/createPage',
    data,
    method: 'post'
  })
}
// 编辑页面--获取页面列表
export const editPageApi = (params) => {
  return request({
    url: 'dynamic/page/allPagesOfAppList',
    params,
    method: 'get'
  })
}
// 编辑页面--删除页面
export const deletePage = (data) => {
  return request({
    url: 'dynamic/page/deletePageById',
    data,
    method: 'post'
  })
}
// 编辑页面--获取左边页面组件列表
export const getPageComps = (data) => {
  return request({
    url: 'dynamic/comp/getPageComps',
    data,
    method: 'post'
  })
}
// 编辑页面--编辑修改页面
export const updatePage = (data) => {
  return request({
    url: 'dynamic/page/updatePage',
    data,
    method: 'post'
  })
}
/**
 * app开发——app当前页面列表
 */
export const nowPageList = (params) => {
  return request({
    url: 'dynamic/page/nowPageList',
    params,
    method: 'get'
  })
}
/**
 * app开发——app所有页面列表
 */
export const allPageList = (params) => {
  return request({
    url: 'dynamic/page/allPageList',
    params,
    method: 'get'
  })
}
/**
 * app开发——编辑所用页面
 */
export const editPage = (data) => {
  return request({
    url: 'dynamic/app/editPage',
    data,
    method: 'post'
  })
}
/**
 * 主题管理——皮肤列表查询
 */
export const themeList = (params) => {
  return request({
    url: 'dynamic/theme/themeList',
    params,
    method: 'get'
  })
}
/**
 * 主题管理——皮肤上传
 */
export const uploadTheme = (data) => {
  return request({
    url: 'dynamic/theme/uploadTheme',
    data,
    method: 'post'
  })
}
// 皮肤删除
export const deleteTheme = (data) => {
  return request({
    url: 'dynamic/theme/deleteTheme',
    data,
    method: 'post'
  })
}
// 下载皮肤
export const downloadTheme = (params) => {
  return request({
    url: 'dynamic/theme/downloadTheme',
    method: 'post',
    data: params,
    headers: {
      responseType: 'blob'
    }
  })
}
// 下载app
export const downloadApp = (params) => {
  return request({
    url: 'dynamic/app/downloadApp',
    method: 'get',
    params,
    headers: {
      responseType: 'blob'
    }
  })
}
/**
 * app智能管理——智能规则展示
 */
export const getMagic = (params) => {
  return request({
    url: 'dynamic/app/getMagic',
    params,
    method: 'get'
  })
}
/**
 * 智能规则编辑
 */
export const editMagic = (data) => {
  return request({
    url: 'dynamic/app/editMagic',
    data,
    method: 'post'
  })
}
/**
 * 智能规则——获取节日列表
 */
export const getFestivalList = (params) => {
  return request({
    url: 'dynamic/rule/getFestivalList',
    params,
    method: 'get'
  })
}
/**
 * 智能规则——获取节日列表
 */
export const getSolarTermList = (params) => {
  return request({
    url: 'dynamic/rule/getSolarTermList',
    params,
    method: 'get'
  })
}
/**
 * app发布管理——获取非正式发布皮肤列表
 */
export const notFormalList = (params) => {
  return request({
    url: 'dynamic/theme/notFormalList',
    params,
    method: 'get'
  })
}
/**
 * app发布管理——获取正式发布皮肤列表
 */
export const formalList = (params) => {
  return request({
    url: 'dynamic/theme/formalList',
    params,
    method: 'get'
  })
}
/**
 * app发布管理——获取二维码和下载url
 */
export const getQrCode = (params) => {
  return request({
    url: 'dynamic/publish/getQrCode',
    params,
    method: 'get'
  })
}
/**
 * app发布管理——白名单列表
 */
export const groupList = (params) => {
  return request({
    url: 'dynamic/publish/groupList',
    params,
    method: 'get'
  })
}
/**
 * 主题发布
 */
export const publishTheme = (data) => {
  return request({
    url: 'dynamic/publish/publishTheme',
    data,
    method: 'post'
  })
}
// 启动页发布
export const publishStartPage = (data) => {
  return request({
    url: 'dynamic//publish/publishStartPage',
    data,
    method: 'post'
  })
}
/**
 * 路由配置——获取路由列表
 */
export const routerList = (params) => {
  return request({
    url: 'dynamic/router/routerList',
    params,
    method: 'get'
  })
}
/**
 * 路由配置——新建路由
 */
export const routerSave = (data) => {
  return request({
    url: 'dynamic/router/save',
    data,
    method: 'post'
  })
}
/**
 * 路由配置——删除路由列表
 */
export const deleteRouter = (data) => {
  return request({
    url: 'dynamic/router/deleteRouter',
    data,
    method: 'post'
  })
}
/**
 * 路由配置——路由编辑
 */
export const editRouter = (data) => {
  return request({
    url: 'dynamic/router/editRouter',
    data,
    method: 'post'
  })
}
/**
 * app信息修改
 */
export const editApp = (data) => {
  return request({
    url: 'dynamic/app/editApp',
    data,
    method: 'post'
  })
}
/**
 * 启动页编辑——启动页列表
 */
export const list = (params) => {
  return request({
    url: 'dynamic/startPage/list',
    params,
    method: 'get'
  })
}
// 新建启动页
export const createStartPage = (params) => {
  return request({
    url: 'dynamic/startPage/save',
    data: params,
    method: 'post'
  })
}
// 编辑启动页
export const editStartPageApi = (params) => {
  return request({
    url: 'dynamic/startPage/update',
    data: params,
    method: 'post'
  })
}
/**
 * 删除启动页列表
 */
export const deleteStartPage = (data) => {
  return request({
    url: 'dynamic/startPage/deleteStartPage',
    data,
    method: 'post'
  })
}

/**
 * 启动页中展示的秒数
 */
// export const getConfig = (params) => {
//   return request({
//     url: 'dynamic/startPage/getConfig',
//     params,
//     method: 'get'
//   })
// }
/**
 * 编辑启动页中的秒数
 */
// export const editConfig = (params) => {
//   return request({
//     url: 'dynamic/startPage/editConfig ',
//     data: params,
//     method: 'post'
//   })
// }
/**
 * 节日信息分页列表查询
 */
export const festivalPageList = (params) => {
  return request({
    url: 'dynamic/rule/festivalPageList',
    params,
    method: 'get'
  })
}
/**
 * 删除节日信息记录
 */
export const deleteFestivalInfo = (params) => {
  return request({
    url: 'dynamic/rule/deleteFestivalInfo',
    data: params,
    method: 'post'
  })
}
/**
 * 更新节日信息
 */
export const saveOrUpadteFestival = (params) => {
  return request({
    url: 'dynamic/rule/saveOrUpadteFestival ',
    data: params,
    method: 'post'
  })
}
/**
 * 应用修改
 */
export const changeUse = (params) => {
  return request({
    url: 'dynamic/merge/merge',
    params,
    method: 'get'
  })
}
