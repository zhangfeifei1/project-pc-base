<template>
  <div id="app">
    <!-- 路由 -->
    <router-view />
  </div>
</template>

<script>
import { getAllApis } from '@/api/apiApi'
import { getEncryptionPublicKey } from '@/api/encrptApi'
import store from '@/store'
export default {
  name: 'App',
  data() {
    return {

    }
  },
  created() {
    // 初始化获取接口是否加密列表，存入session中，在request中统一处理是否加密
    getAllApis().then(res => {
      if (res.code === 0) {
        sessionStorage.removeItem('apiList')
        window.sessionStorage.setItem('apiList', JSON.stringify(res.data))
      }
    })
    // 获取加减密模式
    getEncryptionPublicKey().then(res => {
      const data = {
        appAsymmetricEncryptionPublicKey: res.data.appAsymmetricEncryptionPublicKey,
        appAsymmetricEncryptionType: res.data.appAsymmetricEncryptionType,
        appSymmetricEncryptionType: res.data.appSymmetricEncryptionType
      }
      store.state.user.encrptParams = data
    }).catch(() => {
    })
  }
}
</script>
