import {
  getHomeRoute
} from '@/utils//util'

import routers from '@/router/routers'
import config from '@/settings/defaultSetting'
// import routes from '../../router/routers'

import Cookies from 'js-cookie'

const { homeName } = config

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, // 左侧菜单栏显示状态 true:显示 false:不显示
    withoutAnimation: false // 展开收起菜单是否有动态效果 true:无，false:有
  },
  device: 'desktop', // 获取设备标识 pc：desktop 手机：mobile

  breadCrumbList: [],
  homeRoute: getHomeRoute(routers, homeName),
  // huaxiaDom: '{}',
  huaxiaDom: [],
  huaxiaWatch: '',
  loongeasyDom: [],
  loongeasyWatch: '',
  huaxiaStandard: {}
}
// const getters = {
//   menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
// }
const mutations = {
  // 开启或关闭左侧菜单
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  // 关闭左侧菜单
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  // 获取设备标识 pc：desktop 手机：mobile
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  // 追加所使用的华夏控件code值
  // UPDATE_HUAXIADOM: (state, huaxiaDom) => {
  //   if (state.huaxiaDom === JSON.stringify(huaxiaDom)) {
  //     return
  //   }
  //   state.huaxiaDom = JSON.parse(state.huaxiaDom)
  //   var newObj = {}
  //   Object.assign(newObj, state.huaxiaDom, huaxiaDom) // 拼接
  //   state.huaxiaDom = JSON.stringify(newObj)
  // },
  UPDATE_HUAXIADOM: (state, huaxiaDom) => {
    if (state.huaxiaDom === huaxiaDom) {
      return
    }
    state.huaxiaDom = state.huaxiaDom.concat(huaxiaDom)
  },
  // 监听器多次触发问题
  UPDATE_HUAXIAWATCH: (state, huaxiaWatch) => {
    state.huaxiaWatch = huaxiaWatch
  },
  UPDATE_LOONGEASYDOM: (state, loongeasyDom) => {
    if (state.loongeasyDom === loongeasyDom) {
      return
    }
    state.loongeasyDom = state.loongeasyDom.concat(loongeasyDom)
  },
  UPDATE_LOONGEASYWATCH: (state, loongeasyWatch) => {
    state.loongeasyWatch = loongeasyWatch
  },
  // 追加所使用的华夏控件Standard值
  UPDATE_HUAXIASTANDARD: (state, huaxiaStandard) => {
    var newObj = {}
    Object.assign(newObj, state.huaxiaStandard, huaxiaStandard) // 拼接
    state.huaxiaStandard = newObj
  }
}
const actions = {
  // 开启或关闭左侧菜单
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  // 关闭左侧菜单
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  // 获取设备标识
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  // getters,
  mutations,
  actions
}
