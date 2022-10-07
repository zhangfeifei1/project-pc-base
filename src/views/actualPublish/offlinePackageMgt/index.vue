<template>
  <div class="app-container wrapper">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <!-- 离线包管理 -->
      <el-tab-pane label="离线包管理" name="first" style="background: #ffffff!important;">
        <el-container class="border-1 border-radius-4">
          <!-- 离线包列表 -->
          <el-aside class="package-aside">
            <div class="package-aside_header">
              <font>离线包列表</font>
              <el-button size="mini" @click="handlePackageOpen">新建</el-button>
            </div>
            <div class="package-aside_list">
              <div class="package-aside_input">
                <el-input v-model="searchData" placeholder="请输入名称" clearable @clear="clearInput" @keyup.enter.native="searchResult">
                  <el-button slot="append" icon="el-icon-search" @click="searchResult" />
                </el-input>
              </div>
              <!-- 菜单 -->
              <div class="package-aside_list_menu">
                <div v-if="menuData.length > 0 ">
                  <div v-for="(item , packageId ) in menuData" :key="packageId" class="menu_list_item" :class="{'isactive' : activeIndex == item.packageId ,'active':item.active}" @mouseover="selectStyle(item)" @mouseout="outStyle(item)">
                    <div class="menu_list_item_title" @click="selectItem(item)">{{ item.packageName }} + {{ item.packageId }}</div>
                    <div v-show="item.active" class="menu_list_item_operation">
                      <!-- <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                        <i class="el-icon-info" ></i>
                      </el-tooltip> -->
                      <i class="el-icon-delete" @click="handlePackageDelete(item.packageId)" />
                    </div>
                  </div>
                </div>
                <div v-else class="menu_list_item" style="justify-content:center;">
                  暂无数据
                </div>

              </div>
            </div>
          </el-aside>
          <!-- 离线包版本记录 -->
          <el-main class="package-main">
            <el-row class="package-main_line">
              <el-button type="primary" size="small" @click="handleAddPackage">添加</el-button>
            </el-row>
            <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}" :row-key="getRowKeys" :expand-row-keys="expands" @row-click="rowClick" @expand-change="expandChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-row v-if="releaseHistory.length > 0">
                    <el-row v-for="(item, index ) in releaseHistory" :key="item.id" class="el-table_expand">
                      <div>{{ item.type | releaseTypeFilter }}</div>
                      <div>{{ item.status | releaseStatusFilter }}</div>
                      <div>{{ item.updateTime }}</div>
                      <div>
                        <el-link v-if="item.status != '2'" type="primary" :underline="false" class="link_font" @click="handleCheckReleasePackage(item)">查看</el-link>
                        <el-link v-if="item.status == '0'" type="primary" :underline="false" class="link_font" @click="handleReleaseStop(item)">暂停</el-link>
                        <el-link v-if="item.status == '1'" type="primary" :underline="false" class="link_font" @click="handleReleaseRecovery(item)">恢复</el-link>
                        <el-link v-if="item.status != '2'" type="primary" :underline="false" class="link_font" @click="handleReleaseEnd(item)">结束</el-link>
                      </div>
                    </el-row>
                  </el-row>
                  <el-row v-else>暂无数据</el-row>
                </template>
              </el-table-column>
              <el-table-column label="离线包版本" prop="version" />
              <el-table-column label="平台"> 全平台</el-table-column>
              <el-table-column label="状态">
                <template slot-scope="props">
                  <div class="table_row_status">{{ props.row.status | packageStatusFilter }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="240px">
                <template slot-scope="props">
                  <el-link type="primary" :underline="false" style="margin-left:10px" @click="handleCheckPackageClick(props.row)">查看</el-link>
                  <el-link type="primary" :underline="false" style="margin-left:10px" :disabled="props.row.status=='1'||props.row.status=='3'" @click="handleReleasePackage(props.row)">创建发布</el-link>
                  <el-link type="primary" :underline="false" style="margin-left:10px" @click="handleConfigurationFileDownload(props.row)">下载AMR文件</el-link>
                  <el-link type="primary" :underline="false" @click="handleConfigFileDownload(props.row)">下载配置文件</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-tab-pane>
      <!-- 配置管理 -->
      <el-tab-pane label="配置管理" name="second" style="background: #ffffff!important;">
        <div class="configure-mgt border-1 margin-b25">
          <div class="mgt-main">
            <el-form ref="configureForm" :model="configureForm" label-width="200px">
              <div class="mgt-title">域名管理</div>
              <el-form-item label="虚拟域名：">
                <!-- <font class="el-form-item_label_self">
                  <i class="el-icon-question"></i>:
                </font> -->
                <el-input v-model="configureForm.virtualName" style="width:200px;" clearable />
              </el-form-item>
              <div class="mgt-title">密匙管理</div>
              <el-form-item label="密匙文件：">
                <!-- <font class="el-form-item_label_self">
                  <i class="el-icon-question"></i>:
                </font> -->
                <el-upload
                  ref="upload"
                  :headers="headersToken"
                  :action="configureForm.url"
                  :data="configureUploadData"
                  :auto-upload="false"
                  accept=".pem"
                  :file-list="releaseFileList"
                  :on-change="handleReleaseUploadChange"
                  :on-remove="handleReleaseUploadRemove"
                  :on-success="uploadSuccessCallback"
                  :on-error="uploadErrorCallback"
                >
                  <el-button size="small" class="el-icon-upload2">选择文件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item style="text-align:right;">
                <el-button v-if="configureForm.type == '0'" type="primary" size="small" @click="submitUpload(configureForm)">提交</el-button>
                <el-button v-if="configureForm.type == '1'" type="primary" size="small" @click="submitUpload(configureForm)">更新</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 新建包 -->
    <el-dialog title="新增H5App" :visible.sync="newPackageDialogVisiable" width="30%" top="220px" :before-close="handlePackgeClose" class="add-white-wrapper">
      <el-form ref="packageForm" :model="packageForm" :rules="packageFormRules" label-width="130px" size="small">
        <el-form-item label="H5App ID：" prop="packageId">
          <el-input v-model="packageForm.packageId" style="width:220px" />
        </el-form-item>
        <el-form-item label="H5App 名称：" prop="packageName">
          <el-input v-model="packageForm.packageName" style="width:220px" />
        </el-form-item>
        <el-form-item label="H5App 描述：" prop="packageDesc">
          <el-input v-model="packageForm.packageDesc" style="width:220px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handlePackgeClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handlePackgeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建发布 -->
    <el-dialog title="发布版本" :visible.sync="releaseDialogVisiable" width="60%" top="220px" :before-close="handleReleasePackgeClose" class="add-white-wrapper">
      <el-form ref="releaseForm" :model="releaseForm" label-width="120px" :rules="releaseFormRules" size="small" style="padding-left:40px">
        <el-form-item label="发布类型：" prop="type">
          <el-radio-group v-model="releaseForm.type" @change="releaseTypeChange">
            <el-radio label="灰度" />
            <el-radio label="正式" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if=" releaseForm.type == '灰度' " label="白名单列表：" prop="whiteList">
          <el-select v-model="releaseForm.whiteList" multiple placeholder="请选择" style="width:500px">
            <el-option
              v-for="item in whiteGroup"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布描述：" prop="releaseDesc">
          <el-input v-model="releaseForm.releaseDesc" type="textarea" style="width:500px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleReleasePackgeClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleReleasePackgeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看发布 -->
    <el-dialog title="查看版本" :visible.sync="checkReleaseDialogVisiable" width="60%" top="100px" :before-close="handleCheckReleaseClose" class="add-white-wrapper">
      <el-form ref="checkReleaseForm" :model="checkReleaseForm" label-width="120px" size="small" style="padding-left:40px">
        <el-form-item label="发布类型：" required>
          <el-radio-group v-model="checkReleaseForm.type" disabled @change="releaseTypeChange">
            <el-radio label="灰度" />
            <el-radio label="正式" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if=" checkReleaseForm.type == '灰度' " label="白名单列表：" required>
          <el-input v-model="checkReleaseForm.whiteList" type="textarea" disabled style="width:500px" />
        </el-form-item>
        <el-form-item label="发布描述：" required>
          <el-input v-model="checkReleaseForm.releaseDesc" type="textarea" disabled style="width:500px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCheckReleaseClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加包内容 -->
    <add-package :package-data="packageData" @fatherMethod="getRefresh" />
    <!-- 查看包内容 -->
    <check-package :package-data="checkPackageData" />
  </div>
</template>>

<script>
import { addNewPackage, getPackageList, deletePackage, getConfiguration, updateConfiguration, getHistoryPackage, releasePackage, releasePackageHistory, releasePackageStop, releasePackageRecovery, releasePackageEnd, downloadPackageFile } from '@/api/offlinePackageMgt'
import { getWhiteGroup } from '@/api/whiteListMgt'
import addPackage from '@/views/actualPublish/offlinePackageMgt/addPackage'
import checkPackage from '@/views/actualPublish/offlinePackageMgt/checkPackage'
import { getToken } from '@/utils/util'
import axios from 'axios'
import $config from '@/settings/defaultSetting'
import qs from 'qs'
import {
  Loading
} from 'element-ui'
var loadingInstance = ''
export default {
  components: {
    addPackage,
    checkPackage
  },
  filters: {
    packageStatusFilter(data) {
      if (data === '0') {
        return '未发布'
      } else if (data === '1') {
        return '正在发布中'
      } else if (data === '2') {
        return '已结束发布'
      } else if (data === '3') {
        return '文件差分中'
      }
    },
    releaseTypeFilter(data) {
      if (data === '0') {
        return '灰度发布'
      } else if (data === '1') {
        return '正式发布'
      }
    },
    releaseStatusFilter(data) {
      if (data === '0') {
        return '发布中'
      } else if (data === '1') {
        return '暂停'
      } else if (data === '2') {
        return '已结束'
      }
    }
  },
  data() {
    const validatePackageId = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('H5APP ID值不能为空'))
      } else if (/^[0-9]*$ /.test(value) || value.trim().length !== 8) {
        return callback(new Error('离线包ID为8位数字'))
      } else {
        callback()
      }
    }
    const validatePackageName = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('H5APP名称不能为空'))
      } else if (!/^.{3,20}$/.test(value)) {
        return callback(new Error('离线包名称在3-20字符之间'))
      } else if (!/^[\u4E00-\u9FA5A-Za-z0-9]{3,20}$/.test(value)) {
        return callback(new Error('可输入汉字、数字、字母'))
      } else {
        callback()
      }
    }
    const validatePackageDesc = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('H5APP描述不能为空'))
      } else {
        callback()
      }
    }
    const validateType = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('发布类型不能为空'))
      } else {
        callback()
      }
    }
    const validateWhiteList = (rule, value, callback) => {
      // debugger
      if (value.length === 0) {
        return callback(new Error('白单名列表不能为空'))
      } else {
        callback()
      }
    }
    const validateDesc = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('发布描述不能为空'))
      } else {
        callback()
      }
    }
    return {
      headersToken: {},
      fileList: [],
      searchData: '',
      activeName: 'first',
      packageForm: {
        packageId: '',
        packageName: '',
        packageDesc: ''
      },
      configureForm: {
        virtualName: '',
        type: '',
        url: ''
      },
      configureUploadData: {},
      tableData: [],
      getRowKeys(row) {
        return row.id
      },
      expands: [],
      newPackageDialogVisiable: false,
      activeIndex: 'a',
      menuData: [],
      initMenuData: [],
      packageData: {
        dialogVisible: false,
        packageId: ''
      },
      releaseDialogVisiable: false,
      releaseForm: {
        type: '',
        whiteList: '',
        releaseDesc: ''
      },
      whiteGroup: [],
      releaseHistory: [],
      releaseFileList: [],
      packageFormRules: {
        packageId: [
          { required: true, validator: validatePackageId, trigger: 'blur' }
        ],
        packageName: [
          { required: true, validator: validatePackageName, trigger: 'blur' }
        ],
        packageDesc: [
          { required: true, validator: validatePackageDesc, trigger: 'blur' }
        ]
      },
      releaseFormRules: {
        type: [
          { required: true, validator: validateType, trigger: 'blur' }
        ],
        whiteList: [
          { required: true, validator: validateWhiteList, trigger: 'change' }
        ],
        releaseDesc: [
          { required: true, validator: validateDesc, trigger: 'blur' }
        ]
      },
      checkReleaseDialogVisiable: false,
      checkReleaseForm: {},
      checkPackageData: {
        dialogVisible: false
      }

    }
  },
  mounted() {
    this.getPackageList()
    const token1 = getToken()
    this.headersToken = {
      'Authorization': 'Bearer ' + token1,
      'appid': '1552274783265'
    }
  },
  methods: {
    getPackageList() { // 获取离线包列表
      getPackageList().then(res => {
        this.initMenuData = res.data.records
        this.menuData = res.data.records
        this.activeIndex = res.data.records[0].packageId ? res.data.records[0].packageId : ''
        if (res.data.records[0].packageId) {
          this.getPackageVersionList(res.data.records[0].packageId)
          this.packageData.packageId = res.data.records[0].packageId
        }
      })
        .finally(() => {})
    },
    handlePackageOpen() { // 新建离线包
      this.newPackageDialogVisiable = true
    },
    handlePackgeClose() { // 关闭离线包
      this.newPackageDialogVisiable = false
      this.$refs['packageForm'].resetFields()
    },
    handlePackgeSubmit() { // 新建包 -- 提交
      this.$refs['packageForm'].validate(valid => {
        if (valid) {
          const params = {
            'packageId': this.packageForm.packageId.trim(),
            'packageName': this.packageForm.packageName,
            'packageDesc': this.packageForm.packageDesc
          }
          addNewPackage(params)
            .then(res => {
              this.newPackageDialogVisiable = false
              this.$refs['packageForm'].resetFields()
              this.getPackageList()
            })
            .finally(() => {})
        }
      })
    },
    handlePackageDelete(id) { // 删除包
      console.log('id： ' + id)
      this.$confirm('确认删除此离线包吗？')
        .then(_ => {
          deletePackage(id).then(res => {
            this.getPackageList()
          }).finally({})
        })
        .catch(_ => {})
    },
    queryConfigure() { // 配置查询
      getConfiguration().then(res => {
        if (res.total !== '0') { // 更新配置
          this.configureForm.virtualName = res.data.records[0].virtualName
          this.configureForm.type = '1'
          this.configureForm.id = res.data.records[0].id
          this.configureForm.url = '/pmobile/diffpackage/zipdiffconfiguration/updateById'
        } else { // 上传配置
          this.configureForm.type = '0'
          this.configureForm.url = '/pmobile/diffpackage/zipdiffconfiguration/save'
        }
      }).finally(() => {})
    },
    handleTabClick(tab, event) { // 点击配置管理
      console.log(event.target.getAttribute('id'))
      if (event.target.getAttribute('id') === 'tab-second') {
        this.queryConfigure()
      }
    },
    submitUpload(form) { // 上传or更新
      if (this.configureForm.type === '0') { // 上传配置
        this.configureUploadData.virtualName = this.configureForm.virtualName
        if (form.virtualName.trim() === '') {
          this.$message({
            message: '请输入虚拟域名',
            type: 'error'
          })
        } else if (this.releaseFileList.length === 0) {
          this.$message({
            message: '请选择文件',
            type: 'error'
          })
        } else {
          // 打开遮罩
          // debugger
          loadingInstance = Loading.service({
            text: '数据加载中'
          })
          this.$refs.upload.submit()
        }
      } else { // 更新配置
        if (this.releaseFileList.length === 0) {
          this.configureUploadData.id = this.configureForm.id
          this.configureUploadData.virtualName = this.configureForm.virtualName
          this.uploadConfigurePage()
        } else {
          this.configureUploadData.virtualName = this.configureForm.virtualName
          this.configureUploadData.id = this.configureForm.id
          // 打开遮罩
          loadingInstance = Loading.service({
            text: '数据加载中'
          })
          this.$refs.upload.submit()
        }
      }
    },
    uploadConfigurePage() { // 更新配置-2
      updateConfiguration(this.configureUploadData).then(res => {
        this.$message({
          message: '更新成功！',
          type: 'success'
        })
        this.queryConfigure()
      }).finally({})
    },
    handleReleaseUploadChange(file, fileList) { // 选择文件
      if (fileList.length > 1) {
        fileList.shift()
      }
      // debugger
      if (fileList.length === 0) {
        this.releaseFileList = []
      } else {
        this.releaseFileList = [fileList[fileList.length - 1]]
      }
    },
    handleReleaseUploadRemove(file, fileList) { // 移除文件
      this.releaseFileList = []
    },
    uploadSuccessCallback(response, file, fileList) { // 上传成功回调
      // debugger
      // 关闭遮罩
      loadingInstance.close()
      this.$refs.upload.clearFiles()
      this.releaseFileList = []
      response = JSON.parse(response.response)
      if (response.returnCode === '000000') {
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
        this.queryConfigure()
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
    },
    uploadErrorCallback(err) { // 上传失败回调
      // debugger
      // 关闭遮罩
      loadingInstance.close()
      this.$refs.upload.clearFiles()
      this.releaseFileList = []
      console.log('err:' + err)
      this.$message({
        message: '上传失败！',
        type: 'error'
      })
    },
    getPackageVersionList(id) { // 查询离线包版本
      const params = {
        packageId: id,
        size: '99999'
      }
      getHistoryPackage(params)
        .then(res => {
          this.$nextTick(function() {
            console.log('records:' + JSON.stringify(res.data.records))
            // debugger
            this.tableData = res.data.records
          })
        })
        .finally(() => {})
    },
    handleAddPackage() { // 添加包版本
      if (this.packageData.packageId.trim()) {
        this.packageData.dialogVisible = true
      } else {
        this.$message({
          message: '请优先选择离线包',
          type: 'error'
        })
      }
    },
    getRefresh(id) { // 子组件调用
      this.getPackageVersionList(id)
    },
    handleReleasePackage(row) { // 创建发布
      this.releaseForm.packageId = row.packageId
      this.releaseForm.packageName = row.packageName
      this.releaseForm.version = row.version
      this.releaseDialogVisiable = true
    },
    releaseTypeChange(val) { // 发布类型切换
      if (val === '灰度') {
        this.queryWhiteGroup()
      }
    },
    handleReleasePackgeSubmit() { // 提交发布版本
      this.$refs['releaseForm'].validate(valid => {
        if (valid) {
          console.log('releaseForm:' + JSON.stringify(this.releaseForm))
          const params = {
            packageId: this.releaseForm.packageId,
            packageName: this.releaseForm.packageName,
            releaseDesc: this.releaseForm.releaseDesc,
            version: this.releaseForm.version
          }
          if (this.releaseForm.type === '灰度') {
            params.type = '0'
            params.whiteList = this.releaseForm.whiteList.toString()
          } else {
            params.type = '1'
            params.whiteList = ''
          }
          console.log('params:' + JSON.stringify(params))
          this.$confirm('确认提交吗？')
            .then(_ => {
              releasePackage(params).then(res => {
                this.releaseDialogVisiable = false
                this.$refs['releaseForm'].resetFields()
                this.getPackageVersionList(params.packageId)
              }).finally({})
            })
            .catch(_ => {})
        }
      })
    },
    handleCheckReleasePackage(row) { // 查看版本记录
      this.checkReleaseDialogVisiable = true
      if (row.type === '1') {
        this.checkReleaseForm.type = '正式'
      } else {
        this.checkReleaseForm.type = '灰度'
      }
      this.checkReleaseForm.whiteList = row.whiteList
      this.checkReleaseForm.releaseDesc = row.releaseDesc
    },
    handleCheckReleaseClose() { // 关闭查看版本记录
      this.$refs['checkReleaseForm'].resetFields()
      this.checkReleaseDialogVisiable = false
    },
    handleReleasePackgeClose() { // 关闭发布弹窗
      this.$refs['releaseForm'].resetFields()
      this.releaseDialogVisiable = false
    },
    handleCheckPackageClick(row) { // 查看版本包
      this.checkPackageData.version = row.version
      this.checkPackageData.entryPage = row.entryPage
      this.checkPackageData.virtualName = row.virtualName
      if (row.type === '0') {
        this.checkPackageData.type = '全局资源包'
      } else {
        this.checkPackageData.type = '普通资源包'
      }

      // this.checkPackageData.version = row.version;
      // this.checkPackageData.version = row.version;
      // this.checkPackageData.version = row.version;

      this.checkPackageData.dialogVisible = true
    },
    queryWhiteGroup() { // 白名单组查询
      getWhiteGroup().then(res => {
        this.$nextTick(function() {
          this.whiteGroup = res.data.records
        })
      }).finally(() => {})
    },
    handleConfigurationFileDownload(item) { // 下载AMR文件
      console.log(item)
      // debugger
      // const downloadElement = document.createElement('a')
      // downloadElement.href = '/pmobile/diffpackage/zipdiffversion/package/download?fileName=' + item.packageUrl
      // document.body.appendChild(downloadElement)
      // downloadElement.click()
      // document.body.removeChild(downloadElement)
      const token = getToken()
      // config.headers['Bl'] = '1'
      if (token) {
        $config.apiUrl.headers['Authorization'] = 'Bearer ' + token
      }
      axios({
        method: 'post',
        headers: $config.apiUrl.headers,

        // url: 'pmobile/diffpackage/zipdiffversion/package/download?fileName=' + encodeURIComponent(item.packageUrl),
        responseType: 'blob',
        url: '/pmobile/diffpackage/zipdiffversion/manage/package/download',
        // data: 'request=' + encodeURIComponent(JSON.stringify({ fileName: item.packageUrl }))
        data: qs.stringify({ fileName: item.packageUrl })

      }).then((response) => {
        var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'AMR.zip')
        document.body.appendChild(link)
        link.click()
      })
    },

    handleConfigFileDownload(item) { // 下载配置文件
      const token = getToken()
      // config.headers['Bl'] = '1'
      if (token) {
        $config.apiUrl.headers['Authorization'] = 'Bearer ' + token
      }
      axios({
        method: 'post',
        headers: $config.apiUrl.headers,
        url: '/pmobile/diffpackage/zipdiffversion/manage/package/download',
        // url: 'pmobile/diffpackage/zipdiffversion/package/download?fileName=' + encodeURIComponent(item.packageUrl),
        responseType: 'blob',
        // data: 'request=' + encodeURIComponent(JSON.stringify({ fileName: item.profileUrl }))
        data: qs.stringify({ fileName: item.profileUrl })
      }).then((response) => {
        var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'configFile.zip')
        document.body.appendChild(link)
        link.click()
      })
    },
    expandChange(row, expandedRows) { // 行展开
      if (expandedRows.length > 0) {
        this.expands = []
        this.releaseHistory = []
        if (row) {
          this.expands.push(row.id)// 只展开当前行id
          this.queryReleaseHistory(row)
        }
      } else {
        this.expands = []
      }
      console.log('expands:' + JSON.stringify(this.expands))
    },
    rowClick(row, column) { // 获取当前行id
      this.expandChange(row, column)
    },
    queryReleaseHistory(row) { // 查询包发布记录
      const params = {
        packageId: row.packageId,
        version: row.version,
        size: '99999'
      }
      releasePackageHistory(params).then(res => {
        console.log('res.records:' + JSON.stringify(res.data.records))
        this.tableData[0].records = res.data.records
        console.log('res.records:' + JSON.stringify(this.tableData[0]))
        this.$nextTick(function() {
          debugger
          this.releaseHistory = res.data.records
        })
      }).finally({})
    },
    handleReleaseStop(row) { // 发布暂停
      const params = {
        id: row.id
      }
      releasePackageStop(params).then(res => {
        this.getPackageVersionList(row.packageId)
        this.queryReleaseHistory(row)
      }).finally({})
    },
    handleReleaseRecovery(row) { // 发布恢复
      const params = {
        id: row.id
      }
      releasePackageRecovery(params).then(res => {
        this.getPackageVersionList(row.packageId)
        this.queryReleaseHistory(row)
      }).finally({})
    },
    handleReleaseEnd(row) { // 发布结束
      const params = {
        id: row.id
      }
      releasePackageEnd(params).then(res => {
        this.getPackageVersionList(row.packageId)
        this.queryReleaseHistory(row)
      }).finally({})
    },
    selectStyle(item) { // 离线包划动效果
      const _this = this
      this.$nextTick(function() {
        this.menuData.forEach(function(item) {
          _this.$set(item, 'active', false)
        })
        this.$set(item, 'active', true)
      })
    },
    outStyle(item) { // 离线包划动效果
      this.$set(item, 'active', false)
    },
    selectItem(item) { // 点击列表项
      this.activeIndex = item.packageId
      this.packageData.packageId = item.packageId
      this.getPackageVersionList(item.packageId)
    },
    searchResult() { // 搜索
      if (this.searchData && this.searchData !== 'undefined') {
        const _this = this
        const list = []
        this.initMenuData.map(function(item) {
          if (item.packageName.indexOf(_this.searchData.trim()) > -1) {
            list.push(item)
          }
        })
        if (list.length !== 0) {
          this.menuData = list
        }
      }
    },
    clearInput() { // 清除搜索结果
      this.menuData = this.initMenuData
    }
  }
}
</script>>

<style lang="scss" scoped>
.wrapper {
  // height:90vh;
  // overflow: hidden;
  .border-1 {
    border: solid 1px #ffffff;
  }
  .border-radius-4 {
    border-radius: 4px;
  }
  .margin-b25 {
    margin-bottom: 25px;
  }
  .package-aside {
    border-right: 1px solid #ffffff;
    .package-aside_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 20px;
      background: #ffffff !important;
      margin-bottom: 16px;
    }
    .package-aside_list {
      .package-aside_input {
        padding: 0 20px;
        margin-bottom: 10px;
      }
      .package-aside_list_menu {
        font-size: 14px;
        color: #015252;
        .menu_list_item {
          padding: 0 20px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          div:nth-child(1) {
            flex: 1;
          }
          div{
            line-height: 56px;
          }
          i{
            display: inline-block;
            margin-left: 10px;
          }
        }
        .active {
          background: #ffffff;
          cursor: pointer;
        }
        .isactive {
          color: #409EFF;
          background:#ffffff;
          cursor: pointer;
        }
      }
    }
  }
  .package-main {
    .package-main_line {
      margin-bottom: 20px;
    }
    .table_row_status {
      position: relative;
    }
    .table_row_status:before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: absolute;
      left: -10px;
      top: 50%;
      margin-top: -5px;
      background:  #267878;
      border-color: #267878;
    }
    .el-table_expand {
      padding: 20px;
      display: flex;
      align-items: center;
      div {
        margin-right: 30px;
        .link_font {
          margin-right: 10px;
        }
      }
      > div:nth-child(3) {
        margin-right: 60px;
      }
    }
  }
  .configure-mgt {
    padding-top: 50px;
    padding-left: 25px;
    .el-form-item {
      position: relative;
      .el-form-item_label_self {
        position: absolute;
        left: -10px;
      }
    }
  }
}
.mgt-title{
  font-size: 16px;
  color: #606266;
  font-weight: bold;
}
</style>
