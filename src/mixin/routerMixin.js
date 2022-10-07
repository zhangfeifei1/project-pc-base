import store from '@/store'
import loongeasyInput from '@/components/loongeasy-components/loongeasy-input.vue'
import loongeasyTextarea from '@/components/loongeasy-components/loongeasy-textarea.vue'
import loongeasyDate from '@/components/loongeasy-components/loongeasy-date.vue'
import loongeasyRadio from '@/components/loongeasy-components/loongeasy-radio.vue'
import loongeasySwitch from '@/components/loongeasy-components/loongeasy-switch.vue'
import loongeasySelect from '@/components/loongeasy-components/loongeasy-select.vue'
import loongeasyCheckbox from '@/components/loongeasy-components/loongeasy-checkbox.vue'
import loongeasyCascader from '@/components/loongeasy-components/loongeasy-cascader.vue'
import loongeasyTree from '@/components/loongeasy-components/loongeasy-tree.vue'
function getArrDifference(arr1, arr2) {
  var newArr
  if (arr1[0] === '') {
    newArr = arr2
  } else {
    newArr = arr1.concat(arr2)
  }
  return newArr.filter(function(v, i, arr) {
    return arr.indexOf(v) === arr.lastIndexOf(v)
  })
}
// 数组去重方法
function getObjDifference(arr1, arr2) {
  var newArr = arr1.concat(arr2)
  for (var i = 0; i < newArr.length; i++) {
    for (var j = i + 1; j < newArr.length; j++) {
      if (JSON.stringify(newArr[i]) === JSON.stringify(newArr[j])) {
        newArr.splice(j, 1)
        j--
      }
    }
  }
  return newArr
}
import { getHxStandardByStandardCode, getDictionaryStandardByName } from '@/api/huaxiaApi'
export default {
  components: {
    'loongeasy-input': loongeasyInput,
    'loongeasy-textarea': loongeasyTextarea,
    'loongeasy-date': loongeasyDate,
    'loongeasy-radio': loongeasyRadio,
    'loongeasy-switch': loongeasySwitch,
    'loongeasy-select': loongeasySelect,
    'loongeasy-checkbox': loongeasyCheckbox,
    'loongeasy-cascader': loongeasyCascader,
    'loongeasy-tree': loongeasyTree
  },
  /**
     * 离开此路由时触发 钩子函数
     * @param to 跳转路由的属性
     * @param from 当前路由的属性
     * @param next 钩子函数
     * @description 修改页面的meta值，false时再次进入页面会重新请求数据。
     */
  beforeRouteLeave(to, from, next) {
    // if (from.path === '/lobby') {
    //   to.meta.keepAlive = false
    //   next()
    // } else if (to.path === '/lobby') {
    //   // 如果是首页菜单，则清除缓存
    //   from.meta.keepAlive = false
    // } else {
    //   from.meta.keepAlive = true
    // }
    next()
  },

  // updated生命周期实质上是用来监听data对象的值改变，这里用作解决HTML渲染时隐藏元素的获取
  updated() {
    var huaxiaDoms = document.querySelectorAll('.hxStandard')
    var updateDOM = []
    huaxiaDoms.forEach(v => {
      var code = v.getAttribute('code')
      var version = v.getAttribute('version')
      if (!version) {
        version = '2.0'
      }
      var item = {}
      item['code'] = code
      item['version'] = version
      if (store.state.app.huaxiaDom.indexOf(item) === -1) {
        if (JSON.stringify(updateDOM).indexOf(JSON.stringify(item)) === -1) {
          updateDOM.push(item)
        }
      }
    })
    if (updateDOM !== []) {
      store.commit('app/UPDATE_HUAXIADOM', updateDOM)
    }
    var loongeasyDoms = document.querySelectorAll('.dictionary')
    var lupdateDOM = []
    loongeasyDoms.forEach(v => {
      var value = v.getAttribute('code')
      if (store.state.app.loongeasyDom.indexOf(value) === -1) {
        if (lupdateDOM.indexOf(value) === -1) {
          lupdateDOM.push(value)
        }
      }
    })
    if (lupdateDOM !== []) {
      store.commit('app/UPDATE_LOONGEASYDOM', lupdateDOM)
    }
  },
  // 使用watch监听
  watch: {
    '$store.state.app.huaxiaDom': {
      handler: function(newVal, oldVal) {
        this.offRepeat(newVal)
        var newOld = JSON.stringify(oldVal) + '=====>' + JSON.stringify(newVal)
        if (store.state.app.huaxiaWatch !== newOld) {
          store.commit('app/UPDATE_HUAXIAWATCH', newOld)
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            const params = getObjDifference(oldVal, newVal)
            console.log(params)
            if (params.length !== 0) {
              this.getHuaxiaCode(params)
            }
          }
        }
      }
    },
    '$store.state.app.loongeasyDom': {
      handler: function(newVal, oldVal) {
        var newOld = oldVal + '=====>' + newVal
        if (store.state.app.loongeasyWatch !== newOld) {
          store.commit('app/UPDATE_LOONGEASYWATCH', newOld)
          var index = store.state.app.loongeasyWatch.indexOf('=====>')
          var oCode = store.state.app.loongeasyWatch.substr(0, index)
          var nCode = store.state.app.loongeasyWatch.substring(index + 6)
          if (oCode !== nCode) {
            const params = getArrDifference(oCode.split(','), nCode.split(','))
            console.log(params)
            if (params.length !== 0) {
              this.getLoongeasyCode(params)
            }
          }
        }
      }
    }
  },
  methods: {
    getHuaxiaCode(val) {
      const params = {
        codes: val
      }
      getHxStandardByStandardCode(params).then(res => {
        store.commit('app/UPDATE_HUAXIASTANDARD', res.data.hxStandards)
      }).finally(() => {
        console.log(store.state.app.huaxiaStandard)
      })
    },
    getLoongeasyCode(val) {
      const params = {
        codes: val
      }
      getDictionaryStandardByName(params).then(res => {
        store.commit('app/UPDATE_HUAXIASTANDARD', res.data.hxStandards)
      }).finally(() => {
        console.log(store.state.app.huaxiaStandard)
      })
    },
    offRepeat(arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (JSON.stringify(arr[i]) === JSON.stringify(arr[j])) {
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    }
  }

}
