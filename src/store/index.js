import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import user from './module/user'// 用户信息属性
import app from './module/app' // 应用配置属性
import settings from './module/settings'// 公共配置属性
import tagsView from './module/tagsView' // tag标签导航
import dynamic from './module/dynamic' // 动态首页参数

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    settings,
    tagsView,
    dynamic
  },
  getters
})
