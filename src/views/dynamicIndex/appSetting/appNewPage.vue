<template>
  <div class="page-wrap">
    <!-- 按钮 -->
    <!-- <div>
      <el-button type="primary" size="small" style="width:120px;margin-bottom:20px">扫码实时预览</el-button>
    </div> -->
    <!-- form表单 -->
    <div>
      <el-form ref="pageForm" label-width="100px" :model="pageForm" :rules="pageRules">
        <el-form-item label="页面类型：" prop="pageType">
          <el-select v-model="pageForm.pageType" placeholder="请选择页面类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="页面ID：" prop="pageId">
          <el-input v-model="pageForm.pageId" placeholder="请输入页面ID" style="width:200px" />
        </el-form-item>
        <el-form-item label="页面名称：" prop="pageName">
          <el-input v-model="pageForm.pageName" placeholder="请输入页面名称" style="width:200px" />
        </el-form-item>
      </el-form>
    </div>
    <!-- 组件拖拽区域 -->
    <div class="row">
      <!-- 左侧区域 -->
      <el-card>
        <div class="col">
          <h3>页面组件</h3>
          <h4>导航栏组件</h4>
          <!-- 左上 -->
          <draggable class="list-group" :list="listLeftTop" group="top" @add="addLeftTop" @change="log">
            <div
              v-for="(item,index) in listLeftTop"
              :key="index+'topL'"
              class="list-group-item"
            >
              <img
                v-show="item.icon"
                :src="'data:image/png;base64,'+item.icon"
                style="width:300px;height:40px"
              >
            </div>
          </draggable>
          <!-- 左中 -->
          <h4>页面组件</h4>
          <draggable class="list-group" :list="listLeftMid" group="Mid" @change="log">
            <div
              v-for="(item,index) in listLeftMid"
              :key="index+'midL'"
              class="list-group-item"
            >
              <img
                v-show="item.icon"
                :src="'data:image/png;base64,'+item.icon"
                style="width:300px;height:150px"
              >
            </div>
          </draggable>
        <!-- 左下 -->
        <!-- <draggable class="list-group" :list="listLeftFoot" group="foot" @change="log">
          <div
            v-for="(item,index) in listLeftFoot"
            :key="index+'footL'"
            class="list-group-item"
          >{{ item }}</div>
        </draggable> -->
        </div>
      </el-card>
      <!-- 右侧区域 -->
      <el-card>
        <div class="col">
          <h3>公共组件</h3>
          <!-- 右上 -->
          <h4>导航栏组件</h4>
          <draggable v-loading="loading" class="list-group" :list="listRightTop" group="top" @change="log">
            <div
              v-for="(item,index) in listRightTop"
              :key="index+'topR'"
              class="list-group-item"
            >
              <img
                :src="'data:image/png;base64,'+item.icon"
                style="width:300px;height:40px"
              >
            </div>

          </draggable>
          <!-- 右中 -->
          <h4>页面组件</h4>
          <draggable v-loading="loading" class="list-group" :list="listRightMid" group="Mid" @change="log">
            <div
              v-for="(item,index) in listRightMid"
              :key="index+'midR'"
              class="list-group-item"
            >
              <img
                :src="'data:image/png;base64,'+item.icon"
                style="width:300px;height:150px"
              >
            </div>
          </draggable>
        <!-- 右下 -->
        <!-- <draggable class="list-group" :list="listRightFoot" group="foot" @change="log">
          <div
            v-for="(item,index) in listRightFoot"
            :key="index+'footR'"
            class="list-group-item"
          >{{ item }}</div>
        </draggable> -->
        </div>
      </el-card>
    </div>
    <!-- 按钮区域 -->
    <div style="text-align:center">
      <el-button type="default" size="small" style="margin-bottom:20px;margin-top:20px" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="goCreate">新建</el-button>
    </div>
  </div>
</template>
<script>
import draggable from '@/components/vuedraggable/vuedraggable.js'
import { getAllAppComp, createPage } from '@/api/dynamicPageApi'
export default {
  name: 'TwoLists',
  display: 'Two Lists',
  order: 1,
  components: {
    draggable
  },
  props: {
    // showNewPage: {
    //   type: Boolean
    // },
    dialogShow: {
      type: Boolean
    }
  },
  data() {
    return {
      loading: true, // 遮罩层
      pageForm: {
        pageType: '',
        pageId: '',
        pageName: ''
      },
      pageRules: {
        pageId: [{ required: true, message: '请输入页面ID', trigger: 'blur' }],
        pageName: [
          { required: true, message: '请输入页面名称', trigger: 'blur' }
        ],
        pageType: [
          { required: true, message: '请选择页面类型', trigger: 'blur' }
        ]
      },
      typeOptions: [
        { value: 'tab', label: '首页' },
        { value: 'menu', label: '菜单页' }
      ],
      listLeftTop: [
        { comID: '', icon: '' }
      ],
      listRightTop: [
        { comID: '1', icon: 'aaa' },
        { comID: '2', icon: 'bbb' }
      ],
      listLeftMid: [
        { comID: '', icon: '' }
      ],
      listRightMid: [
        { comID: '1', icon: 'aaa' },
        { comID: '2', icon: 'bbb' }
      ]
    }
  },
  computed: {},
  created() {
    // 获取app公共组件
    this.getAllPubComp()
  },
  methods: {
    add: function() {
      this.list.push({ name: 'navbar公共默认导航栏1' })
    },
    replace: function() {
      this.list = [{ name: 'navbar公共默认导航栏2' }]
    },
    clone: function(el) {
      return {
        name: el.name + 'cloned'
      }
    },
    log: function(evt) {
      window.console.log(evt)
      // if (fileList.length > 1) {
      //   fileList.shift()
      // }
      // if (fileList.length === 0) {
      //   this.listLeftTop = []
      // } else {
      //   this.listLeftTop = [fileList[fileList.length - 1]]
      // }
    },
    addLeftTop: function(evt) {
      // if (fileList.length > 1) {
      //   fileList.shift()
      // }
    },
    // endRight: function(to) {
    //   // window.console.log(JSON.stringify(this.listRightTop, null, 4))
    //   // window.console.log(JSON.stringify(this.listLeftTop, null, 4))
    //   if (this.listLeftTop.length > 1) {
    //     this.listLeftTop.shift()
    //   }
    // },
    // 获取公共组件的方法
    getAllPubComp() {
      // debugger
      this.loading = true
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId
      }
      getAllAppComp(params)
        .then((res) => {
          console.log(res, '%%%%%%')
          if (res.returnCode === '000000') {
            // 将公共组件渲染出来
            this.listRightTop = res.data.navbar
            this.listRightMid = res.data.comps
            // this.listRightFoot = res.data.tabbar
          }
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    // 新建页面
    goCreate() {
      // let pageJson = `{"navbar": ${this.listLeftTop[0]},"comps": [${this.listLeftMid.toString()}]}`;
      this.$refs['pageForm'].validate(valid => {
        if (valid) {
          if (this.listLeftTop.length < 3) {
            var leftTopObj = this.listLeftTop[1].comID
            var newLeftMidArr = []
            for (let j = 0; j < this.listLeftMid.length; j++) {
              if (this.listLeftMid[j].comID === null || this.listLeftMid[j].comID === '') {
                continue
              }
              newLeftMidArr.push(this.listLeftMid[j].comID)
            }
            const data = {
              appId: this.$store.state.dynamic.dynamicPageData.appId,
              pageType: this.pageForm.pageType,
              pageId: this.pageForm.pageId,
              pageName: this.pageForm.pageName,
              pageJson: JSON.stringify({
                'navbar': leftTopObj,
                'comps': newLeftMidArr
              })
            }
            console.log(data, '新建上传数据')
            createPage(data).then((res) => {
              if (res.returnCode === '000000') {
                this.$message.success('新建成功')
                this.$emit('update:dialogShow', false)
              }
            })
          } else {
            this.$alert('页面导航栏组件数量只能为1')
          }
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    goBack() {
      // this.$emit('closeNewPageDialog')
      this.$emit('update:dialogShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.page-wrap {
  .row {
    display: flex;
    justify-content: space-evenly;
    .col {
      width: 350px;
      height: 700px;
      .list-group {
        min-height: 150px;
        max-height: 280px;
        overflow-y: auto;
        min-width: 200px;
        max-width: 650px;
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
/deep/.el-form-item__label {
  text-align: left;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
