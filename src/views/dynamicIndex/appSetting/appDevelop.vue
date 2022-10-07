<template>
  <div class="develop-wrap">
    <!-- 组件拖拽区域 -->
    <div class="row">
      <!-- 左侧区域 -->
      <el-card>
        <div class="col">
          <h3>App当前页面列表</h3>
          <!-- 左上 -->
          <div>
            <h4 style="margin-bottom:10px">底部菜单</h4>
            <draggable class="list-group" :list="listLeftTop" group="top" @change="log">
              <div
                v-for="(item, index) in listLeftTop"
                :key="index+'midL'"
                class="list-group-item"
              >{{ item }}</div>
            </draggable>
          </div>
          <!-- 左中 -->
          <div>
            <h4 style="margin-bottom:10px">首页</h4>
            <draggable class="list-group" :list="listLeftMid" group="Mid" @change="log">
              <div
                v-for="(item, index) in listLeftMid"
                :key="index+'midL'"
                class="list-group-item"
              >{{ item }}</div>
            </draggable>
          </div>
          <!-- 左下 -->
          <div>
            <h4 style="margin-bottom:10px">菜单页</h4>
            <draggable class="list-group" :list="listLeftFoot" group="foot" @change="log">
              <div
                v-for="(item, index) in listLeftFoot"
                :key="index+'footL'"
                class="list-group-item"
              >{{ item }}</div>
            </draggable>
          </div>
        </div>
      </el-card>
      <!-- 右侧区域 -->
      <el-card>
        <div class="col">
          <h3>App所有页面列表</h3>
          <!-- 右上 -->
          <div>
            <h4 style="margin-bottom:10px">底部菜单</h4>
            <draggable class="list-group" :list="listRightTop" group="top" @change="log">
              <div
                v-for="(item, index) in listRightTop"
                :key="index+'topR'"
                class="list-group-item"
              >{{ item }}</div>
            </draggable>
          </div>
          <!-- 右中 -->
          <div>
            <h4 style="margin-bottom:10px">首页</h4>
            <draggable class="list-group" :list="listRightMid" group="Mid" @change="log">
              <div
                v-for="(item, index) in listRightMid"
                :key="index+'midR'"
                class="list-group-item"
              >{{ item }}</div>
            </draggable>
          </div>
          <!-- 右下 -->
          <div>
            <h4 style="margin-bottom:10px">菜单页</h4>
            <draggable class="list-group" :list="listRightFoot" group="foot" @change="log">
              <div
                v-for="(item, index) in listRightFoot"
                :key="index+'footR'"
                class="list-group-item"
              >{{ item }}</div>
            </draggable>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 按钮区域 -->
    <div style="text-align:center">
      <el-button type="default" size="small" style="margin-bottom:20px;margin-top:20px" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import draggable from '@/components/vuedraggable/vuedraggable.js'
import { nowPageList, allPageList, editPage } from '@/api/dynamicPageApi'
export default {
  name: 'TwoLists',
  display: 'Two Lists',
  order: 1,
  components: {
    draggable
  },
  props: {
    appDevDialogShow: {
      type: Boolean
    }
  },
  data() {
    return {
      listLeftTop: [],
      // imgLeftTop: [],
      listRightTop: [],
      listLeftMid: [],
      listRightMid: [],
      listLeftFoot: [],
      listRightFoot: []
    }
  },
  created() {
    // 获取当前页面列表
    this.getNowPageList()
    // 获取所有页面列表
    this.getAllPageList()
  },
  methods: {
    add: function() {
      window.console.log(this.list, 'add11111111111111')
      this.list.push({ name: 'L-启动页面' })
    },
    replace: function() {
      this.list = [{ name: 'R-启动页面' }]
    },
    clone: function(el) {
      return {
        name: el.name + 'cloned'
      }
    },
    // endRight: function(to) {
    //   // window.console.log(JSON.stringify(this.listRightTop, null, 4))
    //   // window.console.log(JSON.stringify(this.listLeftTop, null, 4))
    //   if (this.listLeftTop.length > 1) {
    //     this.listLeftTop.shift()
    //   }
    // },
    log: function(evt) {
      window.console.log(evt)
    },
    getNowPageList() { // 获取当前页面的列表
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId
      }
      nowPageList(params).then((res) => {
        console.log(res, '$左边$$$$$$$$$$$$$$$$$$$$')
        if (res.returnCode === '000000') {
          this.listLeftTop = []
          if (res.data.tabbar) {
            this.listLeftTop.push(res.data.tabbar)
          }
          // this.listLeftTop = res.data.tabbar
          this.listLeftMid = res.data.tabpages
          this.listLeftFoot = res.data.menupages
        }
      })
    },
    getAllPageList() { // 获取所有页面的列表
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId
      }
      allPageList(params).then((res) => {
        console.log(res, '所有列表$$$$$$$$$')
        if (res.returnCode === '000000') {
          this.listRightTop = res.data.tabbar
          // for (let i = 0; i < res.data.tabpages.length; i++) {
          //   var tabObj = res.data.tabpages[i].pageId
          //   this.listRightMid.push(tabObj)
          // }
          // for (let j = 0; j < res.data.menupages.length; j++) {
          //   var menuObj = res.data.menupages[j].pageId
          //   this.listRightFoot.push(menuObj)
          // }
          this.listRightMid = res.data.tabpages
          this.listRightFoot = res.data.menupages
        }
      })
    },
    save() { // 保存按钮事件
      if (this.listLeftTop.length < 3) {
        const data = {
          appId: this.$store.state.dynamic.dynamicPageData.appId,
          appJson: JSON.stringify({
            'tabbar': this.listLeftTop[0],
            'tabpages': this.listLeftMid,
            'menupages': this.listLeftFoot
          })
        }
        console.log(data, '1111111111111111111111111111')
        editPage(data).then((res) => {
          if (res.returnCode === '000000') {
            this.$message.success('保存成功')
            this.$emit('update:appDevDialogShow', false) // 关闭子组件弹框
          }
        })
      } else {
        this.$alert('App当前页面底部菜单数量只能为1')
      }
    },
    goBack() { // 返回
      this.$emit('update:appDevDialogShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.develop-wrap {
  .row {
    display: flex;
    justify-content: space-evenly;
    .col {
      .list-group {
        min-height: 150px;
        max-height: 200px;
        overflow-y: auto;
        min-width: 250px;
        max-width: 300px;
        overflow-x: auto;
        line-height: 24px;
        background: #eeeeee;
        margin-bottom: 20px;
        padding-left: 20px;
        padding-top: 10px;
        .list-group-item {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
