import request from '@/utils/request'

/**
 * 获取加密公钥
 * @param data

 */
export const getEncryptionPublicKey = (data) => {
  return request({
    url: 'base/app/getEncryptionPublicKey',
    data,
    method: 'post'
  })
}
