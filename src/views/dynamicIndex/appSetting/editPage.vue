<template>
  <div class="app-container wrapper">
    <!-- 页面表格区域 -->
    <el-tabs v-model="activeEditPageTable" type="border-card">
      <el-tab-pane label="首页" name="tabPages">
        <!-- 表格1 -->
        <el-table
          :data="homePageTableData"
          style="width:100%"
          border
          :cell-style="cellstyle"
          :header-cell-style="rowClass"
          size="small"
        >
          <el-table-column label="页面ID" prop="pageId" />
          <!-- <el-table-column label="页面名称" prop="pageName" /> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEditTabPage(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDeleteTabPage(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="菜单页" name="menuPages">
        <!-- 表格2 -->
        <el-table
          :data="menuPageTableData"
          style="width:100%"
          border
          :cell-style="cellstyle"
          :header-cell-style="rowClass"
          size="small"
        >
          <el-table-column label="页面ID" prop="pageId" />
          <!-- <el-table-column label="页面名称" prop="pageName" /> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEditMenuPage(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDeleteMenuPage(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 编辑页面弹框 -->
    <el-dialog title="编辑页面" :visible.sync="editPageVisible" width="70%">
      <!-- form表单 -->
      <div>
        <el-form ref="editPageForm" label-width="100px" :model="editPageForm">
          <el-form-item label="页面ID：" prop="pageId">
            <el-input v-model="editPageForm.pageId" style="width:200px" disabled />
          </el-form-item>
          <el-form-item label="页面类型：" prop="pageType">
            <el-select v-model="editPageForm.pageType" disabled>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="页面名称：" prop="pageName">
            <el-input v-model="editPageForm.pageName" style="width:200px" />
          </el-form-item> -->
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
            <draggable v-loading="loading" class="list-group" :list="listLeftTop" group="top" @add="addLeftTop" @change="log">
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
            <draggable v-loading="loading" class="list-group" :list="listLeftMid" group="Mid" @change="log">
              <div
                v-for="(item,index) in listLeftMid"
                :key="index+'midL'"
                class="list-group-ittem"
              >
                <img
                  :src="'data:image/png;base64,'+item.icon"
                  style="width:300px;height:150px"
                >
              </div>
            </draggable>
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
          </div>
        </el-card>
      </div>
      <!-- 按钮区域 -->
      <div style="text-align:center">
        <el-button type="default" size="small" style="margin-bottom:20px;margin-top:20px" @click="goBack">返回</el-button>
        <el-button type="primary" size="small" @click="submitEditPage">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from '@/components/vuedraggable/vuedraggable.js'
import { editPageApi, deletePage, getPageComps, getAllAppComp, updatePage } from '@/api/dynamicPageApi'
export default {
  name: 'TwoLists',
  display: 'Two Lists',
  order: 1,
  components: {
    draggable
  },
  data() {
    return {
      loading: true, // 遮罩层
      homePageTableData: [],
      menuPageTableData: [],
      activeEditPageTable: 'tabPages',
      editPageVisible: false,
      editPageForm: {
        pageType: '',
        pageId: ''
        // pageName: ''
      },
      // editPageFormRules: {
      //   pageName: [
      //     { required: true, message: '页面名称不能为空', trigger: 'bluur' }
      //   ]
      // },
      typeOptions: [
        { value: 'tab', label: '首页' },
        { value: 'menu', label: '菜单页' }
      ],
      listLeftTop: [
        { comID: '', icon: '' }
      ],
      listRightTop: [
        { comID: '', icon: '' }
      ],
      listLeftMid: [
        { comID: '', icon: '' }
      ],
      listRightMid: [
        { comID: '', icon: '' }
      ]
    }
  },
  created() {
    this.getAllPageList()
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

    },
    getAllPageList() { // 获取页面列表
      const params = {
        appId: sessionStorage.getItem('editPageAppId')
      }
      editPageApi(params).then(res => {
        console.log(res, '修改页面')
        this.homePageTableData = []
        res.data.tabpages.forEach(element => {
          const tmpObj = { pageId: element }
          this.homePageTableData.push(tmpObj)
        })
        this.menuPageTableData = []
        res.data.menupages.forEach(element => {
          const tmpObj = { pageId: element }
          this.menuPageTableData.push(tmpObj)
        })
        // this.homePageTableData = res.data.tabpages
        // this.menuPageTableData = res.data.menupages
      })
    },
    handleEditTabPage(row) { // 打开首页编辑页面弹框
      console.log(row, '2222222222222')
      this.editPageVisible = true
      this.editPageForm.pageType = 'tab'
      // this.editPageForm.pageName = row.pageName
      this.editPageForm.pageId = row.pageId
      this.loading = true // 打开遮罩层
      // 获取页面组件列表--左边
      const params = {
        appId: sessionStorage.getItem('editPageAppId'),
        pageId: row.pageId,
        pageType: 'tab'
      }
      getPageComps(params).then(res => {
        console.log(res, '左边列表11111111111')
        if (res.returnCode === '000000') {
          // this.listLeftTop = []
          // this.listLeftTop.push(res.data.navbar)
          this.listLeftTop = res.data.navbar
          this.listLeftMid = res.data.comps
        }
        this.loading = false
      })
      // 获取所有页面组件--右边
      const data = {
        appId: sessionStorage.getItem('editPageAppId')
      }
      getAllAppComp(data).then(res => {
        if (res.returnCode === '000000') {
          this.listRightTop = res.data.navbar
          this.listRightMid = res.data.comps
        }
        this.loading = false
      })
    },
    handleEditMenuPage(row) { // 打开菜单页编辑页面弹框
      this.editPageVisible = true
      this.editPageForm.pageType = 'menu'
      // this.editPageForm.pageName = row.pageName
      this.editPageForm.pageId = row.pageId
      // 获取页面组件列表--左边
      const params = {
        appId: sessionStorage.getItem('editPageAppId'),
        pageId: row.pageId,
        pageType: 'menu'
      }
      getPageComps(params).then(res => {
        console.log(res, '左边列表11111111111')
        if (res.returnCode === '000000') {
          this.listLeftTop = []
          this.listLeftTop.push(res.data.navbar)
          this.listLeftMid = res.data.comps
        }
      })
      // 获取所有页面组件--右边
      const data = {
        appId: sessionStorage.getItem('editPageAppId')
      }
      getAllAppComp(data).then(res => {
        if (res.returnCode === '000000') {
          this.listRightTop = res.data.navbar
          this.listRightMid = res.data.comps
        }
      })
    },
    submitEditPage() { // 提交编辑页面
      if (this.listLeftTop.length < 2) {
        var leftTopObj = this.listLeftTop[0].comID
        var newLeftMidArr = []
        for (let j = 0; j < this.listLeftMid.length; j++) {
          if (this.listLeftMid[j].comID === null || this.listLeftMid[j].comID === '') {
            continue
          }
          newLeftMidArr.push(this.listLeftMid[j].comID)
        }
        const params = {
          appId: sessionStorage.getItem('editPageAppId'),
          pageType: this.editPageForm.pageType,
          pageId: this.editPageForm.pageId,
          pageJson: JSON.stringify({
            'navbar': leftTopObj,
            'comps': newLeftMidArr
          })
        }
        updatePage(params).then(res => {
          if (res.returnCode === '000000') {
            this.$message.success('修改成功')
            this.editPageVisible = false
            this.getAllPageList()
          }
        })
      } else {
        this.$alert('页面导航栏组件数量只能为1')
      }
    },
    goBack() {
      this.editPageVisible = false
    },
    handleDeleteTabPage(row) { // 删除首页页面
      console.log(row, 'shanchuyemian11111111111111')
      const params = {
        appId: sessionStorage.getItem('editPageAppId'),
        pageId: row.pageId,
        pageType: 'tab'
      }
      this.$confirm('确定删除该页面吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePage(params).then(res => {
          console.log(res)
          if (res.returnCode === '000000') {
            this.$message.success('删除成功!')
            this.getAllPageList()
          } else {
            this.$message.error('删除失败')
          }
        }).finally(res => {

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDeleteMenuPage(row) { // 删除菜单页页面
      console.log(row, 'shanchuyemian11111111111111')
      const params = {
        appId: sessionStorage.getItem('editPageAppId'),
        pageId: row.pageId,
        pageType: 'menu'
      }
      this.$confirm('确定删除该页面吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePage(params).then(res => {
          console.log(res)
          if (res.returnCode === '000000') {
            this.$message.success('删除成功!')
            this.getAllPageList()
          } else {
            this.$message.error('删除失败')
          }
        }).finally(res => {

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description 设置el-table内容居中
     */
    cellstyle() {
      return 'text-align:center'
    },
    /**
     * @description 设置el-table表头居中
     */
    rowClass() {
      return 'background:#ffffff;color:#515a6e;text-align:center'
    }
  }
}
</script>
<style lang="scss" scoped>
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

</style>
