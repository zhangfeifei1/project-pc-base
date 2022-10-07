<template>
  <div class="app-container wrapper">
    <!-- 按钮区域 -->
    <div style="margin-bottom:20px">
      <el-button type="primary" size="small" @click="handleCopyCompToApp">拉取组件</el-button>
      <el-button type="primary" size="small" @click="addAppComp">添加App组件</el-button>
    </div>
    <!-- 管理组件信息区域style="margin:0px 50px 40px 50px" -->
    <div class="componentMgmt">
      <el-tabs v-model="activeTable" type="border-card" @tab-click="handleTabsClick">
        <el-tab-pane label="导航栏" name="navbar">
          <!-- 表格1 -->
          <el-table
            :data="navBarTableData"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="max-height:450px;overflow:auto"
          >
            <el-table-column prop="comID" label="组件ID" />
            <!-- <el-table-column prop="comName" label="组件名称" /> -->
            <el-table-column prop="changeStyle" label="设置配置表单样式">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getSchema(scope.row)">编辑schema</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="set" label="配置组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getSchemaConfig(scope.row)">配置</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="share" label="共享组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="shareAppToComp(scope.row)">共享</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="download" label="下载组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDownloadComp(scope.row)">下载组件</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDeletePublicComp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="sourceMg" label="资源管理">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleManageFile">管理</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="内容栏" name="comps">
          <!-- 表格2 -->
          <el-table
            :data="compsTableData"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="max-height:450px;overflow:auto"
          >
            <el-table-column prop="comID" label="组件ID" />
            <!-- <el-table-column prop="comName" label="组件名称" /> -->
            <el-table-column prop="changeStyle" label="设置配置表单样式">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getSchema(scope.row)">编辑schema</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="set" label="配置组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getSchemaConfig(scope.row)">配置</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="share" label="共享组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="shareAppToComp(scope.row)">共享</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="download" label="下载组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDownloadComp(scope.row)">下载组件</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDeletePublicComp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="sourceMg" label="资源管理">
              <template slot-scope="scope">
                <el-button type="text" size="small">管理</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="底部栏" name="tabbar">
          <!-- 表格3 -->
          <el-table
            :data="tabBarTableData"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="max-height:450px;overflow:auto"
          >
            <el-table-column prop="comID" label="组件ID" />
            <!-- <el-table-column prop="comName" label="组件名称" /> -->
            <el-table-column prop="changeStyle" label="设置配置表单样式">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getSchema(scope.row)">编辑schema</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="set" label="配置组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getSchemaConfig(scope.row)">配置</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="share" label="共享组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="shareAppToComp(scope.row)">共享</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="download" label="下载组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDownloadComp(scope.row)">下载组件</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDeletePublicComp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="sourceMg" label="资源管理">
              <template slot-scope="scope">
                <el-button type="text" size="small">管理</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 拉取公共组件弹框 -->
    <el-dialog title="公共组件列表" :visible.sync="showPublicCompList" top="80px" width="70%">
      <el-alert type="info" show-icon :closable="false" style="margin:10px 0px 10px 0px">请点击所要拉取组件的所在行
      </el-alert>
      <el-tabs v-model="activePublicTable" type="card">
        <el-tab-pane label="导航栏" name="navbarPublic">
          <!-- 获取公共组件列表的表格1 -->
          <el-table
            :data="navBarPublicCompTableData"
            highlight-current-row
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="margin-bottom:15px;max-height:350px;overflow:auto"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="index" width="55" />
            <el-table-column prop="comID" label="组件ID" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="内容栏" name="compsPublic">
          <!-- 获取公共组件列表的表格2 -->
          <el-table
            :data="compsPublicCompTableData"
            highlight-current-row
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="margin-bottom:15px;max-height:350px;overflow:auto"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="index" width="55" />
            <el-table-column prop="comID" label="组件ID" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="底部栏" name="tabbarPublic">
          <!-- 获取公共组件列表的表格3 -->
          <el-table
            :data="tabBarPublicCompTableData"
            highlight-current-row
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="margin-bottom:15px;max-height:350px;overflow:auto"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="index" width="55" />
            <el-table-column prop="comID" label="组件ID" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div style="text-align:right">
        <el-button size="small" style="margin-bottom:20px" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="submitCopyComp">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加app组件弹框 -->
    <el-dialog title="添加App组件" top="250px" :visible.sync="addAppCompsVisible">
      <el-form
        ref="addAppCompsForm"
        :model="addAppCompsFormItem"
        :rules="addAppCompsFormRules"
        label-width="120px"
        size="small"
      >
        <el-form-item label="组件文件：" prop="appCompsFile">
          <el-upload
            ref="AppComponentFromUpload"
            v-model="addAppCompsFormItem.appCompsFile"
            class="upload-demo"
            action="/pmobile/dynamic/comp/uploadComp"
            :data="uploadData"
            :headers="headersToken"
            :file-list="AppComponentFileList"
            :auto-upload="false"
            :on-change="AppComponentUploadChange"
            :on-remove="AppComponentUploadRemove"
            :on-success="AppComponentSuccessCallback"
            :on-error="AppComponentErrorCallback"
            style="width:350px"
          >
            <el-button slot="trigger" type="primary" class="el-icon-folder-opened" size="small">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="组件类型：" prop="appCompsType">
          <el-select
            v-model="addAppCompsFormItem.appCompsType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in appCompsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button type="default" size="small" style="margin-top:10px;margin-bottom:20px" @click="goBack">返回</el-button>
        <el-button type="primary" size="small" @click="submitAddAppComp">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑schema子组件 -->
    <el-dialog v-if="appEditSchemaVisible" title="编辑scheam" :visible.sync="appEditSchemaVisible" width="70%">
      <edit-schema :app-edit-schema-dialog.sync="appEditSchemaVisible" />
    </el-dialog>
    <!-- 配置子组件 -->
    <el-dialog v-if="appConfigFileVisible" title="配置" :visible.sync="appConfigFileVisible" width="70%">
      <schema-config :app-config-dialog.sync="appConfigFileVisible" />
    </el-dialog>
    <!-- 管理文件 -->
    <!-- <el-dialog title="管理文件" :visible.sync="showManageFile" width="80%">
      <manage-file />
    </el-dialog> -->
  </div>
</template>

<script>
import { getToken } from '@/utils/util'
import $config from '@/settings/defaultSetting'
import axios from 'axios'
import { allAppCompApi, deleteAppComp, copyCompToApp, copyCompToPublic } from '@/api/appComponentApi'
import { getAllPublicComp } from '@/api/pubComponentApi'
export default {
  components: {
    EditSchema: () => import('@/views/dynamicIndex/appComponentMgmt/appSchemaJson'),
    SchemaConfig: () => import('@/views/dynamicIndex/editor/appConfigFile')
    // ManageFile: () => import('@/views/dynamicIndex/pubComponentMgmt/ManageFile')
  },
  data() {
    return {
      activeTable: 'navbar',
      activePublicTable: 'navbarPublic',
      AppComponentFileList: [],
      AppComponentUploadFlag: false,
      compName: '', // 获取公共组件的ID Name
      navBarTableData: [ // app组件navBardata数据
      ],
      tabBarTableData: [ // app组件tabBar表格数据
      ],
      compsTableData: [ // app组件comps表格数据
      ],
      navBarPublicCompTableData: [{ comID: '' }], // 获取公共组件的navBar表格数据
      tabBarPublicCompTableData: [{ comID: '' }], // 获取公共组件的tabBar表格数据
      compsPublicCompTableData: [{ comID: '' }], // 获取公共组件的comps表格数据
      pubComponent: {
        total: 0,
        page: 1,
        limit: 10
      },
      uploadData: {}, // 上传文件定义的附加参数对象
      addAppCompsFormItem: {
        appCompsFile: '',
        appCompsType: ''
      },
      addAppCompsFormRules: {
        // appCompsFile: [{
        //   required: true,
        //   message: '请选择文件',
        //   trigger: 'change'
        // }],
        appCompsType: [{
          required: true,
          message: '请至少选择一种文件类型',
          trigger: 'change'
        }]
      },
      appCompsOptions: [{
        value: 'navbar',
        label: '导航栏'
      },
      {
        value: 'comps',
        label: '内容栏'
      },
      {
        value: 'tabbar',
        label: '底部栏'
      }
      ],
      appEditSchemaVisible: false, // 是否显示编辑schema子组件
      showManageFile: false, // 是否显示管理文件子组件
      appConfigFileVisible: false, // 是否显示配置子组件
      showPublicCompList: false, // 拉取公共组件弹框
      copyCompName: '', // 拉取公共组件的名称
      copyCompType: '', // 拉取公共组件的类型
      addAppCompsVisible: false, // 添加app组件弹框
      tabName: 'navbar'// 接受tab栏的名字
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      'Authorization': 'Bearer ' + token1,
      'appid': '1552274783265'
    }
    // 获取app组件列表
    this.getAllAppCompList()
  },
  methods: {
    getAllAppCompList() { // 获取app组件列表
      const params = {
        appId: sessionStorage.getItem('appId')
      }
      allAppCompApi(params).then(res => {
        console.log(res, 'app组件列表')
        if (res.returnCode === '000000') {
          // this.navBarTableData = []
          // res.data.navbar.forEach(element => {
          //   const tmpObj = { comID: element, compType: 'navbar' }
          //   this.navBarTableData.push(tmpObj)
          // })
          // this.compsTableData = []
          // res.data.comps.forEach(element => {
          //   const tmpObj = { comID: element, compType: 'comps' }
          //   this.compsTableData.push(tmpObj)
          // })
          // this.tabBarTableData = []
          // res.data.tabbar.forEach(element => {
          //   const tmpObj = { comID: element, compType: 'tabbar' }
          //   this.tabBarTableData.push(tmpObj)
          // })
          this.navBarTableData = res.data.navbar
          this.compsTableData = res.data.comps
          this.tabBarTableData = res.data.tabbar
        }
      })
    },
    handleCurrentChange(val) { // 选中拉取组件所在行
      console.log(val, '组件类型111111111111')
      this.copyCompName = val.comID
      this.copyCompType = val.ids
    },
    handleCopyCompToApp() { // 拉取组件
      this.showPublicCompList = true
      // 获取公共组件列表
      getAllPublicComp().then(res => {
        console.log(res, '**公共组件列表**')
        if (res.returnCode === '000000') {
          this.compsPublicCompTableData = []
          res.data.comps.forEach(element => {
            const tmpObj = { comID: element, ids: 'comps' }
            this.compsPublicCompTableData.push(tmpObj)
          })
          this.navBarPublicCompTableData = []
          res.data.navbar.forEach(element => {
            const tmpObj = { comID: element, ids: 'navbar' }
            this.navBarPublicCompTableData.push(tmpObj)
          })
          this.tabBarPublicCompTableData = []
          res.data.tabbar.forEach(element => {
            const tmpObj = { comID: element, ids: 'tabbar' }
            this.tabBarPublicCompTableData.push(tmpObj)
          })
        }
      })
    },
    submitCopyComp() { // 确认拉取公共组件
      const params = {
        appId: sessionStorage.getItem('appId'),
        compName: this.copyCompName,
        compType: this.copyCompType
      }
      copyCompToApp(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('拉取组件成功')
          this.showPublicCompList = false
          this.getAllAppCompList()
        }
      })
    },
    cancel() { // 取消拉取组件弹框
      this.showPublicCompList = false
    },
    handleTabsClick(tab, event) { // tab栏选中事件
      this.tabName = tab.name
    },
    shareAppToComp(item) { // 共享组件
      const params = {
        appId: sessionStorage.getItem('appId'),
        compName: item.comID,
        compType: this.tabName
      }
      this.$confirm('确定共享该组件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          copyCompToPublic(params).then(res => {
            if (res.returnCode === '000000') {
              this.$message.success('共享组件成功')
            }
          }).finally((res) => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消共享'
          })
        })
    },
    addAppComp() { // 添加app组件
      this.addAppCompsVisible = true
    },
    submitAddAppComp() { // 确定上传app组件
      this.$refs.addAppCompsForm.validate((valid) => {
        if (valid) {
          this.uploadData.compType = this.addAppCompsFormItem.appCompsType
          this.uploadData.appId = sessionStorage.getItem('appId')
          this.$refs.AppComponentFromUpload.submit()
          this.addAppCompsVisible = false
          this.getAllAppCompList()
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // AppComponent上传文件
    AppComponentUploadChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.AppComponentFileList = []
      } else {
        this.AppComponentFileList = [fileList[fileList.length - 1]]
      }
    },
    // app组件移除文件
    AppComponentUploadRemove() {
      this.$refs.AppComponentFromUpload.clearFiles()
      this.AppComponentFileList = []
    },
    // app组件上传成功后回调
    AppComponentSuccessCallback() {
      // response = JSON.parse(response.response)
      this.AppComponentUploadFlag = true
      this.getAllAppCompList()
      // debugger
      this.$refs.AppComponentFromUpload.clearFiles()
      // this.$refs.addAppCompsForm.clearValidate()
      this.$refs.addAppCompsForm.resetFields()
      // debugger
      this.AppComponentFileList = []
      this.$message.success('上传成功')
      this.getAllAppCompList()
      this.$nextTick(() => {
        if (this.AppComponentUploadFlag === false) {
          return
        }
      })
    },
    // PubComponent上传失败后回调
    AppComponentErrorCallback(res) {
      this.AppComponentUploadFlag = false
      this.$refs.AppComponentFromUpload.clearFiles()
      this.AppComponentFileList = []
      this.$message({
        message: res.message,
        type: 'error'
      })
    },
    goBack() {
      this.addAppCompsVisible = false
    },
    handleDownloadComp(item) { // 下载app组件
      const token = getToken()
      // config.headers['Bl'] = '1'
      if (token) {
        $config.apiUrl.headers['Authorization'] = 'Bearer ' + token
      }
      axios({
        method: 'post',
        headers: $config.apiUrl.headers,
        url: '/pmobile/dynamic/comp/downloadAppComp/' + item.comID + '/' + sessionStorage.getItem('appId'),
        responseType: 'blob'
      }).then((response) => {
        var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.comID + '.zip')
        document.body.appendChild(link)
        link.click()
        // if (response.returnCode === '000000') {
        //   this.$message.success('')
        // }
      })
    },
    handleDeletePublicComp(item) { // 删除app组件
      console.log(item, '%%%%%%%%%%%%%%')
      const params = {
        compName: item.comID,
        appId: sessionStorage.getItem('appId')
      }
      this.$confirm('确定删除该组件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAppComp(params)
            .then((res) => {
              console.log(res)
              if (res.returnCode === '000000') {
                this.$message.success('删除成功!')
                this.getAllAppCompList()
              } else {
                this.$message.error('删除失败')
              }
            })
            .finally((res) => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleManageFile() { // 管理文件
      this.showManageFile = true
    },
    getSchema(row) { // 显示编辑schema弹框
      console.log(row, '1111111111111111111111111')
      // const compName = row.comID
      // 存储comID
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { compName: row.comID })
      this.appEditSchemaVisible = true
    },
    getSchemaConfig(row) { // 配置
      // const compName = row.comID
      // 存储comID
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { compName: row.comID })
      this.appConfigFileVisible = true
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
</script>>

<style lang="scss" scoped>
.PubComponentCard {
  float: left;
  width: 170px;
  height: 250px;
  margin-right: 50px;
  margin-bottom: 35px;
}
.PubComponentCard:hover {
  box-shadow: 2px 4px 12px 5px rgba(42, 110, 238, 0.308);
}
.el-form {
  width: 100%;
  margin:0 auto;
}
</style>
