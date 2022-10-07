import axios from 'axios'
import qs from 'qs'
import $config from '@/settings/defaultSetting'
import {
  getToken,
  setToken
} from '@/utils//util'
import {
  Message
} from 'element-ui'
// import { sign } from '@/utils/sign'
import store from '@/store'
// import { getEncryptionPublicKey } from '@/api/encrptApi'
import {
  guid
} from '@/utils/common' // base64和生成uuid方法
import {
  aesEncrypt,
  aesDecrypt
} from '@/utils/encryption/aes' // aes加解密方法
import {
  rsaEncrypt
} from '@/utils/encryption/rsa' // rsa加解密方法
import {
  sm2Encrypt
} from '@/utils/encryption/sm2' // sm2加密方法
import {
  sm4Encrypt,
  sm4Decrypt
} from '@/utils/encryption/sm4' // sm4加解密方法

import router from '@/router/router.config.js'

let baseUrl = ''
switch (process.env.NODE_ENV) {
  case 'development':
    // 这里是本地的请求url
    baseUrl = $config.apiUrl.dev
    break
  case 'production':
    // 生产环境url
    baseUrl = $config.apiUrl.pro
    break
  case 'plugIn':
    // 插件模式url
    baseUrl = $config.apiUrl.plu
    break
  case 'standard':
    // 标准报文url
    baseUrl = $config.apiUrl.sta
    break
}

/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  // defaultSetting.js中的配置
  baseURL: baseUrl, // 请求根路径
  headers: $config.apiUrl.headers, // 配置公共请求头
  timeout: $config.apiUrl.timeout // 超时时间
})

service.apiUrl = baseUrl
let uuidKey = ''
/**
 * 请求参数处理
 */
service.interceptors.request.use((config) => {
  // 参数签名处理
  // config = sign(config, $config.appId, $config.appSecret, 'SHA256')
  // if (process.env.NODE_ENV !== 'standard') {
  if (sessionStorage.getItem('standardMessage') === 'false') {
    config.method === 'get'
      ? config.params = qs.stringify({ ...config.params }) : config.data = JSON.stringify(config.data)
  }

  const token = getToken()
  // config.headers['Bl'] = '1'
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  config.headers['Accept'] = 'application/json,*/*'
  config.headers['appid'] = window.wxConfig.loongeasyAppid

  if (config.headers.responseType === 'blob') {
    // 如果请求头中含有responseType=blob，需要改返回头类型为blob.接口返回二进制流，需配置此项
    config.responseType = 'blob'
  }
  if (config.url.slice(0, 1) !== '/') {
    // 处理接口未加/的请求路径添加/
    config.url = '/' + config.url
  }
  if (config.url === '/captcha/picture/createCode') {
    config.headers['rev'] = guid()
    window.sessionStorage.setItem('lastRev', config.headers['rev'])
  }
  if (config.url === '/initial/api/list') {
    // 如果是获取api列表接口，无需加密
    config.params = {
      request: config.params
    }
  } else {
    // 获取需要加密的接口列表
    const allApiList = window.sessionStorage.getItem('apiList')
    const allApiList1 = JSON.parse(allApiList)
    if (config.url.indexOf('?') !== -1) {
      config.url = config.url.split('?')[0]
    }
    try {
      if (allApiList1) {
        allApiList1.forEach(v => {
          if (config.url === v.path) {
            // 该接口需要加密
            const key = store.state.user.encrptParams.appAsymmetricEncryptionPublicKey // 获取非对称加密公钥
            const noSymmetryEncrept = store.state.user.encrptParams.appAsymmetricEncryptionType // 获取非对称加密方式
            const symmetryEncrept = store.state.user.encrptParams.appSymmetricEncryptionType // 获取对称加密方式

            uuidKey = guid() // 用uuid生成对称加密公钥

            const rev = isEncryptType(noSymmetryEncrept, uuidKey, key) // 用非对称加密方式对对称加密的公钥进行加密
            config.headers.rev = rev

            if (config.method === 'post') {
              // if (process.env.NODE_ENV === 'standard') {
              if (sessionStorage.getItem('standardMessage') === 'true') {
                if (config.headers.contentType === 'json') {
                  const data1 = isEncryptType(symmetryEncrept, JSON.stringify(config.data), uuidKey)
                  config.data = data1
                  config.headers['Content-Type'] = 'application/json;charset=UTF-8'
                } else {
                  const data1 = isEncryptType(symmetryEncrept, JSON.stringify(config.data), uuidKey)
                  config.data = qs.stringify({ request: data1 })
                }
              } else {
                if (config.headers.contentType === 'json') {
                  const data1 = isEncryptType(symmetryEncrept, config.data, uuidKey)
                  config.data = { request: data1 }
                } else {
                  // post接口加密
                  const data1 = isEncryptType(symmetryEncrept, config.data, uuidKey)
                  config.data = qs.stringify({ request: data1 })
                }
              }
            } else {
              // if (process.env.NODE_ENV === 'standard') {
              if (sessionStorage.getItem('standardMessage') === 'true') {
                // 非post接口加密
                const params = isEncryptType(symmetryEncrept, qs.stringify({ ...config.params }), uuidKey)
                config.params = { request: params }
              } else {
                // 非post接口加密
                const params = isEncryptType(symmetryEncrept, config.params, uuidKey)
                config.params = { request: params }
              }
            }
            throw new Error('ending')
          }
        })
      }

      if (config.method === 'post') {
        // post接口不加密
        const data = config.data
        // if (process.env.NODE_ENV === 'standard') {
        if (sessionStorage.getItem('standardMessage') === 'true') {
          if (config.headers.contentType === 'json') {
            config.data = JSON.parse(data)
          } else {
            config.data = qs.stringify(data)
          }
        } else {
          if (config.headers.contentType === 'json') {
            config.data = { request: data }
          } else {
            config.data = qs.stringify({ request: data })
          }
        }
      } else {
        // 非post接口不加密
        const params = config.params
        // if (process.env.NODE_ENV === 'standard') {
        if (sessionStorage.getItem('standardMessage') === 'true') {
          config.params = params
        } else {
          config.params = { request: params }
        }
      }
    } catch (e) {
      // console.log(e)
    }
  }

  return config
})
/**
 * 响应结果处理
 */
service.interceptors.response.use(
  (response) => {
    if (response.config.url !== '/pmobile/initial/api/list') {
      // 接口不加密
      if (response.headers['content-disposition'] != null && response.headers['content-disposition'].indexOf('attachment') !== -1) {
        // 返回头里含有content-disposition并且有attachment字符串代表是返回的二进制流需要将data直接返回给页面
        return Promise.resolve(response.data)
      } else if (response.config.url === '/pmobile/captcha/picture/createCode') {
        // 如果是图片验证码交易，直接返回
        return Promise.resolve(response.data)
      }
      // if (process.env.NODE_ENV === 'standard') {
      if (sessionStorage.getItem('standardMessage') === 'true') {
        if (response.headers.isencrypt === '1') {
          const symmetryEncrept = store.state.user.encrptParams.appSymmetricEncryptionType// 获取对称加密方式
          response.data = JSON.parse(isDecryptType(symmetryEncrept, response.data, uuidKey))
        } else {
          // 正常常用返回信息
          // eslint-disable-next-line no-self-assign
          response.data = response.data
        }
      } else {
        // 除了获取api列表接口，其他接口返回值都在response对象里{response:{...}}
        if (response.data.isEncrypt === '1') {
        // 接口加密，需解密
        // const key = store.state.user.encrptParams.appAsymmetricEncryptionPublicKey
        // const noSymmetryEncrept = store.state.user.encrptParams.appAsymmetricEncryptionType
        // 获取对称加密方式
          const symmetryEncrept = store.state.user.encrptParams.appSymmetricEncryptionType// 获取对称加密方式
          response.data = JSON.parse(isDecryptType(symmetryEncrept, response.data.response, uuidKey))
        } else {
        // 正常常用返回信息
          response.data = JSON.parse(response.data.response)
        }
      }
    }
    // 响应码逻辑处理
    if (response.data.returnCode === '000000') {
      // 平台设置000000为交易成功成功
      response.data.code = 0
      // 原程序定义服务端定义的响应code码为0时请求成功
      // 使用Promise.resolve 正常响应
      return Promise.resolve(response.data)
    } else {
      // 使用Promise.reject 响应
      Message.error({
        message: response.data.message
      })
      return Promise.reject(response.data)
    }
  }, error => {
    let message = ''
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          // 认证失败，重新刷新页面
          setToken('')
          router.replace({
            path: '/login'
          })
          Message.error({
            message: '认证失败，请重新登录！',
            type: 'error',
            duration: 5 * 1000
          })
          return
        default:
          // eslint-disable-next-line no-case-declarations
          const symmetryEncrept = store.state.user.encrptParams.appSymmetricEncryptionType// 获取对称加密方式
          // if (process.env.NODE_ENV === 'standard') {
          if (sessionStorage.getItem('standardMessage') === 'true') {
            if (error.response.headers.isencrypt === '1') {
              error.response.data = isDecryptType(symmetryEncrept, error.response.data, uuidKey)
              message = JSON.parse(error.response.data).path + ',' + JSON.parse(error.response.data).message
            } else {
              message = error.response.data.path + ',' + error.response.data.message
            }
          } else {
            if (error.response.data.isEncrypt === '0') {
              message = JSON.parse(error.response.data.response).path + ',' + JSON.parse(error.response.data.response).message
            } else if (error.response.data.isEncrypt === '1') {
              error.response.data.response = isDecryptType(symmetryEncrept, error.response.data.response, uuidKey)
              message = JSON.parse(error.response.data.response).path + ',' + JSON.parse(error.response.data.response).message
            } else {
              message = error.response.data.path + ',' + error.response.data.message
            }
          }
          break
      }
      Message.error({
        message: message
      })
      // 请求错误处理
      return Promise.reject(error)
    } else {
      message = '连接服务器失败'
      Message.error({
        message: message
      })
      return Promise.reject(error)
    }
  }
)
/**
 * @description 根据加密类型进行相应加密
 * @param {*} type 加密类型
 * @param {*} data 需要加密的数据
 * @param {*} publickey 公钥
 * @param {*} cipherMode 0：c1c2c3 1:c1c3c2
 */
function isEncryptType(type, data, publickey, cipherMode) {
  if (type === 'AES') {
    return encryptAES(data, publickey)
  } else if (type === 'RSA') {
    return encryptRSA(data, publickey)
  } else if (type === 'SM2') {
    return encryptSM2(data, publickey, cipherMode)
  } else if (type === 'SM4') {
    return encryptSM4(data, publickey)
  }
}

function isDecryptType(type, data, privatekey) {
  if (type === 'AES') {
    return decryptAES(data, privatekey)
  } else if (type === 'SM4') {
    return decryptSM4(data, privatekey)
  }
}

// aes加密
function encryptAES(data, publickey) {
  return aesEncrypt(data, publickey)
}
// aes解密
function decryptAES(data, privatekey) {
  return aesDecrypt(data, privatekey)
}
// rsa加密
function encryptRSA(data, publickey) {
  return rsaEncrypt(data, publickey)
}
// sm2加密
function encryptSM2(data, publickey, cipherMode) {
  return sm2Encrypt(data, publickey, cipherMode)
}

// sm4加密
function encryptSM4(data, publickey) {
  return sm4Encrypt(data, publickey)
}
// sm4解密
function decryptSM4(data, privatekey) {
  return sm4Decrypt(data, privatekey)
}
export default service
