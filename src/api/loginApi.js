
import request from '@/utils/request'
// import {JsonToQueryString} from '@/utils/index'

/**
 * 登录
 * @param params 登录上送参数
 */
export const login = (params) => {
  const url = '/auth/oauth/token'
  return request({
    url: url,
    method: 'post',
    params
  })
}
/**
 * 获取图形验证码
 */
export const getCodepPicture = (params) => {
  const url = '/captcha/picture/createCode'
  return request({
    url: url,
    method: 'post',
    params,
    headers: {
      responseType: 'blob'
    }
  })
}

/**
 * 用户首次登陆修改密码
 */
export const firstChangePassword = (data) => {
  return request({
    url: 'base/user/initial/password',
    data,
    method: 'post'
  })
}

export const adminToken = (loginFlag, wxCode) => {
  const data = {
    loginFlag: loginFlag,
    wxCode: wxCode
  }
  return request({
    url: 'admin/login/token',
    method: 'post',
    data
  })
}
