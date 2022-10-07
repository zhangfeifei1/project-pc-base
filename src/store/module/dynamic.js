const state = {
  dynamicPageData: {} // 动态首页入口 接口参数
}
const mutations = {
  UPDATE_DYNAMIC_PAGE: (state, dynamicPage) => {
    console.log(dynamicPage, '************')
    if (Object.keys(dynamicPage).length === 0) {
      state.dynamicPage = {}
    }
    var newObj = {}
    Object.assign(newObj, state.dynamicPageData, dynamicPage)
    state.dynamicPageData = newObj
  }
}
const actions = {
  // 动态首页入口
  updateDynamicPage({ commit }, data) {
    commit('UPDATE_DYNAMIC_PAGE', data)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
