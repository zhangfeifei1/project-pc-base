<template>
  <div class="app-container wrapper">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="App应用管理" name="first" style="background: #ffffff!important;">
        <!-- 新建按钮 -->
        <div>
          <el-button type="primary" size="small" style="margin-bottom:20px" @click="getNewApp">新建App</el-button>
          <el-button type="primary" size="small" @click="handleChangeUse">应用修改</el-button>
        </div>
        <!-- APP管理主列表表格 -->
        <el-table
          ref="applicationRef"
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%"
          :cell-style="cellstyle"
          :header-cell-style="rowClass"
          size="small"
        >
          <el-table-column label="App图标" prop="img" width="100px">
            <template slot-scope="scope">
              <img
                :src="'data:image/png;base64,'+scope.row.img"
                height="40px"
                width="40px"
                style="border-radius:20px"
              >
            </template>
          </el-table-column>
          <el-table-column label="AppID" prop="AppID" />
          <el-table-column label="App名称" prop="AppName" />
          <el-table-column label="应用描述" prop="AppDesc" />
          <el-table-column label="应用状态" prop="AppStatus" />
          <el-table-column label="主题" prop="AppTheme" />
          <el-table-column label="操作" prop="operation" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toogleExpand(scope.row)">
                App管理
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-button type="text" size="small" @click="editAppInfo(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="1">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:center;">
                <el-button plain type="primary" size="small" @click="getStartPage(scope.row)">启动页设置</el-button>
                <el-button plain type="primary" size="small" @click="getPage(scope.row)">新建页面</el-button>
                <el-button plain type="primary" size="small" @click="editPage(scope.row)">编辑页面</el-button>
                <el-button plain type="primary" size="small" @click="getAppDev(scope.row)">App开发</el-button>
                <el-button plain type="primary" size="small" @click="showApp(scope.row)">App组件管理</el-button>
                <!-- <el-button plain type="primary" size="small" @click="getNewRouter(scope.row)">新建路由</el-button>
                <el-button plain type="primary" size="small" @click="getRouterPage(scope.row)">路由配置</el-button> -->
                <!-- <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="getInfoPage(scope.row)"
                >App基础信息修改</el-button> -->
                <el-button plain type="primary" size="small" @click="getNewTheme(scope.row)">新建皮肤主题</el-button>
                <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="getThemeManage(scope.row)"
                >皮肤主题管理</el-button>
                <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="getAppManage(scope.row)"
                >App楼层规则管理</el-button>
                <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="getPublicManage(scope.row)"
                >发布管理</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination
            background
            :current-page="pageInfo.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageInfo.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.total"
            @size-change="handlePageSize"
            @current-change="handlePage"
          />
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="节假日信息管理" name="second" style="background: #ffffff!important;">
        <div class="festivalArea">
          <div class="festForm" style="padding-top:20px">
            <el-form ref="configureForm" :model="configureForm" label-width="200px">
              <div class="mgt-title">节假日管理</div>
              <el-form-item label="节假日配置文件：">
                <el-upload
                  ref="upload"
                  :headers="headersToken"
                  action="/pmobile/dynamic/rule/upload"
                  :data="configureUploadData"
                  :auto-upload="false"
                  accept
                  :file-list="releaseFileList"
                  :on-change="handleReleaseUploadChange"
                  :on-remove="handleReleaseUploadRemove"
                  :on-success="uploadSuccessCallback"
                  :on-error="uploadErrorCallback"
                  style="position:relative"
                >
                  <el-button size="small" class="el-icon-upload2">选择文件</el-button>
                  <!-- <el-button type="primary" size="small" @click="submitUpload">提交文件</el-button> -->
                </el-upload>
                <el-button type="primary" size="small" style="position:absolute;left:110px;bottom:4px" @click="submitUpload">提交文件</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align:right;margin-right:20px;margin-bottom:20px">
            <!-- 添加按钮 -->
            <el-button type="primary" size="small" @click="handleAdd">添加节假日信息</el-button>
          </div>
          <div>
            <!-- 节假日表格 -->
            <el-table
              ref="festivalRef"
              :data="festivalTableData"
              border
              style="width: 100%"
              :cell-style="cellstyle"
              :header-cell-style="rowClass"
              size="small"
            >
              <el-table-column label="节日代码" prop="festivalCode" />
              <el-table-column label="节日名称" prop="festivalName" />
              <el-table-column label="日期" prop="onDate" />
              <el-table-column label="操作" prop="operation" width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="handleFestivalInfo(scope.row)">编辑</el-button>
                  <el-button
                    size="small"
                    type="text"
                    @click="handleDeteleFestivalInfo(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
              <el-pagination
                background
                :current-page="festivalInfo.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="festivalInfo.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="festivalInfo.total"
                @size-change="handleFestivalPageSize"
                @current-change="handleFestivalPage"
              />
            </el-col>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 新建App的弹框 -->
    <el-dialog title="新建App" :visible.sync="showNewApp" width="40%">
      <el-form ref="form" :model="newAppForm" label-width="160px" :rules="newAppRules">
        <el-form-item label="AppID:" prop="AppID">
          <el-input v-model="newAppForm.AppID" placeholder="请输入特殊字符之外的AppID" style="width:230px" />
        </el-form-item>
        <el-form-item label="App名称:" prop="AppName">
          <el-input v-model="newAppForm.AppName" placeholder="请输入AppName" style="width:230px" />
        </el-form-item>
        <el-form-item label="App图标:">
          <img
            v-show="AppIcon.fileValue"
            :src="'data:image/png;base64,'+AppIcon.fileValue"
            style="width:50px;hight:50px"
          >
          <fileupload @getFile="getFile" />
        </el-form-item>
        <!-- <el-form-item label="选择离线包关联App:" prop="AppOfflinePackage" required>
        <el-select v-model="newAppForm.AppOfflinePackage" style="width:180px">
          <el-option label="离线包关联的App" value="1" />
          <el-option label="离线包关联的App" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择埋点关联App:" prop="AppMaidian" required>
        <el-select v-model="newAppForm.AppMaidian" style="width:180px">
          <el-option label="选择埋点关联App" value="1" />
          <el-option label="选择埋点关联App" value="2" />
        </el-select>
      </el-form-item>-->
        <el-form-item label="App描述:" prop="AppDesc">
          <el-input
            v-model="newAppForm.AppDesc"
            type="textarea"
            placeholder="请输入AppDesc"
            style="width:230px"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="default" style="margin-bottom:20px" size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="confirm()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑App的弹框 -->
    <el-dialog v-if="showChangeInfo" title="App基础信息修改" :visible.sync="showChangeInfo" width="40%">
      <!-- <change-info :app-change-info-dialog-show.sync="showChangeInfo" /> -->
      <el-form ref="form" :model="changeInfoForm" label-width="160px" :rules="editAppRules">
        <el-form-item label="AppID:" prop="AppID">
          <el-input
            v-model="changeInfoForm.AppID"
            style="width:180px"
            disabled
          />
        </el-form-item>
        <el-form-item label="App名称:" prop="AppName">
          <el-input v-model="changeInfoForm.AppName" placeholder="请输入AppName" style="width:180px" />
        </el-form-item>
        <el-form-item label="App图标:">
          <img
            v-show="editAppIcon.fileValue"
            :src="'data:image/png;base64,'+editAppIcon.fileValue"
            style="width:50px;hight:50px"
          >
          <fileupload @getFile="getEditFile" />
        </el-form-item>
        <el-form-item label="App描述:" prop="AppDesc">
          <el-input
            v-model="changeInfoForm.AppDesc"
            type="textarea"
            placeholder="请输入AppDesc"
            style="width:230px"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button size="small" style="margin-bottom:20px" @click="goBackEditApp">返回</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑节假日的弹框 -->
    <el-dialog :title="festivalTitle" :visible.sync="festivalVisible" width="40%">
      <el-form
        ref="festivalForm"
        :model="formItem"
        :rules="formItemRules"
        label-width="120px"
        size="small"
      >
        <el-form-item label="节日代码" prop="festivalCode" required>
          <el-input v-model="formItem.festivalCode" placeholder="请输入节日代码" style="width:180px" />
        </el-form-item>
        <el-form-item label="节日名称" prop="festivalName" required>
          <el-input v-model="formItem.festivalName" placeholder="请输入节日名称" style="width:180px" />
        </el-form-item>
        <el-form-item label="节日日期" prop="onDate" required>
          <el-input v-model="formItem.onDate" placeholder="请输入节日日期" style="width:180px" />
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button type="default" size="small" style="margin-bottom: 20px" @click="handleReset">取消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!-- 启动页编辑子组件 -->
    <el-dialog
      v-if="showStartPage"
      title="启动页编辑"
      :visible.sync="showStartPage"
      width="70%"
    >
      <start-page />
      <div style="text-align:center;">
        <el-button style="margin-bottom:20px" size="small" @click="goBack">返回</el-button>
      </div>
    </el-dialog>
    <!-- 开发页面子组件 -->
    <el-dialog v-if="showNewPage" title="新建页面" :visible.sync="showNewPage" width="70%">
      <new-page :dialog-show.sync="showNewPage" />
    </el-dialog>
    <!-- 编辑app组件 -->
    <el-dialog v-if="showAppDev" title="编辑App页面" :visible.sync="showAppDev">
      <app-dev :app-dev-dialog-show.sync="showAppDev" />
    </el-dialog>
    <!-- app组件管理子组件 -->
    <el-dialog v-if="showAppComps" title="App组件管理" class="appComps" :visible.sync="showAppComps">
      <app-comps />
    </el-dialog>
    <!-- 路由配置子组件 -->
    <!-- <AppRouter :dialog-app-router.sync="dialogAppRouter" @closeAppRouterDialog="appRouterCloseHandle" /> -->
    <el-dialog v-if="showRouterConfig" title="App路由配置" :visible.sync="showRouterConfig" width="60%">
      <app-router :app-router-dialog-show.sync="showRouterConfig" />
    </el-dialog>
    <!-- 新建路由 -->
    <el-dialog v-if="newRouterVisible" title="新建路由配置" :visible.sync="newRouterVisible" width="40%">
      <new-router :app-new-router-dialog-show.sync="newRouterVisible" />
    </el-dialog>
    <!-- 新建主题皮肤 -->
    <NewTheme :dialog-new-theme.sync="dialogNewTheme" @closeNewThemeDialog="newThemeCloseHandle" />
    <!-- 主题管理组件 -->
    <el-dialog v-if="showThemeManage" title="皮肤主题管理" :visible.sync="showThemeManage" width="50%">
      <theme-manage />
      <!-- 底部按钮 -->
      <div style="text-align:center">
        <el-button size="small" style="margin-bottom:20px" @click="handleCloseAppThem()">返回</el-button>
      </div>
    </el-dialog>
    <!-- app智能管理组件 -->
    <el-dialog v-if="showAppManage" title="App楼层规则管理" :visible.sync="showAppManage" width="70%">
      <app-manage :app-manage-dialog-show.sync="showAppManage" />
    </el-dialog>
    <!-- 发布管理子组件 -->
    <el-dialog v-if="showPublicManage" title="App发布管理" :visible.sync="showPublicManage" width="50%">
      <app-public :app-public-dialog-show.sync="showPublicManage" />
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/util'
import fileupload from '@/components/FileUpload/fileupload.vue'
import {
  appList,
  deleteApp,
  festivalPageList, // 节日列表
  deleteFestivalInfo,
  saveOrUpadteFestival,
  changeUse,
  createApp, // 新建App
  editApp // 编辑App
} from '@/api/dynamicPageApi'
export default {
  components: {
    // AppNew: () => import('@/views/dynamicIndex/appSetting/appNew'),
    // AppComps: () => import('@/views/dynamicIndex/appSetting/appCompsManage'),
    StartPage: () => import('@/views/dynamicIndex/appSetting/appStartPage'),
    NewPage: () => import('@/views/dynamicIndex/appSetting/appNewPage'),
    AppDev: () => import('@/views/dynamicIndex/appSetting/appDevelop'),
    AppRouter: () => import('@/views/dynamicIndex/appSetting/appRouterConfig'),
    NewRouter: () => import('@/views/dynamicIndex/appSetting/appNewRouter'),
    // ChangeInfo: () => import('@/views/dynamicIndex/appSetting/appChangeInfo'),
    NewTheme: () => import('@/views/dynamicIndex/appSetting/appNewTheme'),
    ThemeManage: () => import('@/views/dynamicIndex/appSetting/appTheme'),
    AppManage: () => import('@/views/dynamicIndex/appSetting/appMagicConfig'),
    AppPublic: () => import('@/views/dynamicIndex/appSetting/appPublishConfig'),
    fileupload
  },
  data() {
    const validateAppId = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('AppID不能为空'))
      } else {
        callback()
      }
      // const reg2 = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g
      // if (value === '') {
      //   callback(new Error('请输入AppID'))
      // } else if (value !== '' && !reg2.test(value)) {
      //   callback(new Error('AppID不符合要求，AppID不能包括特殊字符'))
      // }
    }
    // const validatePass = (rule, value, callback) => {
    //   const reg2 = /^.{8,12}$/
    //   const reg3 = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,12}$/
    //   if (value === '') {
    //     callback(new Error('请输入密码'))
    //   } else if (value !== '' && !reg2.test(value)) {
    //     callback(new Error('长度8到12个字符'))
    //   } else if (!reg3.test(value)) {
    //     callback(new Error('密码复杂度不符合要求，必须包含数字和字母'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateAppName = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('App名称不能为空'))
      } else {
        callback()
      }
    }
    // const validateAppOfflinePackage = (rule, value, callback) => {
    //   if (!value || !value.trim()) {
    //     return callback(new Error('离线包关联App不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateAppMaidian = (rule, value, callback) => {
    //   if (!value || !value.trim()) {
    //     return callback(new Error('埋点关联APP不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateAppDesc = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('App描述不能为空'))
      } else {
        callback()
      }
    }
    const validateEditAppName = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('App名称不能为空'))
      } else {
        callback()
      }
    }
    const validateEditAppDesc = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('App描述不能为空'))
      } else {
        callback()
      }
    }

    return {
      loading: true, // 遮罩层
      tableData: [
        {
          img: '',
          AppID: '',
          AppName: '',
          AppDesc: '',
          AppStatus: '',
          AppTheme: ''
        }
      ],
      newAppForm: {
        AppID: '',
        AppName: '',

        // AppOfflinePackage: "",
        // AppMaidian: "",
        AppDesc: ''
      },
      AppIcon: {},
      editAppIcon: {},
      changeInfoForm: {
        AppID: '',
        AppName: '',
        AppDesc: ''
      },
      changeAppInfoId: '', // 编辑APP时获取appId
      headersToken: {},
      EditAppFileList: [],
      EditAppUploadFlag: false,
      editAppRules: {
        AppName: [
          { required: true, validator: validateEditAppName, trigger: 'blur' }
        ],
        AppDesc: [
          { required: true, validator: validateEditAppDesc, trigger: 'blur' }
        ]
      },
      festivalTableData: [
        {
          festivalCode: '',
          festivalName: '',
          onDate: ''
        }
      ],
      festivalTitle: '', // 节日信息弹框标题
      formItem: {
        festivalCode: '',
        festivalName: '',
        onDate: ''
      },
      formItemRules: {
        festivalCode: [
          {
            required: true,
            message: '节日代码不能为空',
            trigger: 'blur'
          }
        ],
        festivalName: [
          {
            required: true,
            message: '节日名称不能为空',
            trigger: 'blur'
          }
        ],
        onDate: [
          {
            required: true,
            message: '节日日期不能为空',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      newAppModel: {
        AppID: '',
        AppName: '',
        AppOfflinePackage: '',
        AppMaiDian: '',
        AppDesc: ''
      },
      formLabelWidth: '160px',
      AppFileList: [],
      AppUploadFlag: false,
      newAppRules: {
        AppID: [{ required: true, validator: validateAppId, trigger: 'blur' }],
        AppName: [
          { required: true, validator: validateAppName, trigger: 'blur' }
        ],
        // AppOfflinePackage: [
        //   {
        //     required: true,
        //     validator: validateAppOfflinePackage,
        //     trigger: 'blur'
        //   }
        // ],
        // AppMaidian: [
        //   { required: true, validator: validateAppMaidian, trigger: 'blur' }
        // ],
        AppDesc: [
          { required: true, validator: validateAppDesc, trigger: 'blur' }
        ]
      },
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      festivalInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      festivalID: '', // 将节日信息查询中的id传值给此id
      configureForm: {
        url: ''
      },
      activeName: 'first',
      configureUploadData: {},
      releaseFileList: [],
      // 是否显示新建app子组件
      showNewApp: false,
      // 是否显示app组件管理子组件弹框
      showAppComps: false,
      showStartPage: false, // 是否显示启动页编辑子组件弹框
      // 新建页面是否显示子组件
      showNewPage: false,
      // 新建app
      showAppDev: false,
      showRouterConfig: false, // 是否显示路由配置子组件弹框
      newRouterVisible: false, // 新建路由弹框
      // 是否显示信息修改子组件弹框
      showChangeInfo: false,
      dialogNewTheme: false, // 新建皮肤主题管理
      // 是否显示皮肤主题管理子组件弹框
      showThemeManage: false,
      // 是否显示app智能管理子组件弹框
      showAppManage: false,
      // 是否显示app发布管理子组件弹框
      showPublicManage: false,
      festivalVisible: false
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      Authorization: 'Bearer ' + token1
    }
    this.getFestivalPageList() // 获取节假日列表
  },
  mounted() {
    this.getAppList() // 获取app列表
    const token1 = getToken()
    this.headersToken = {
      Authorization: 'Bearer ' + token1
    }
  },
  methods: {
    // 获取动态首页app列表
    getAppList() {
      this.loading = true
      const params = {
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      appList(params)
        .then((res) => {
          console.log(res, '%%动态首页入口%%')
          if (res.returnCode === '000000') {
            this.tableData = res.data.records
            this.pageInfo.total = res.data.total * 1
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    // 获取节日信息列表
    getFestivalPageList() {
      const params = {
        current: this.festivalInfo.page,
        size: this.festivalInfo.limit
      }
      festivalPageList(params).then((res) => {
        console.log(res, '***节日列表***')
        if (res.returnCode === '000000') {
          this.festivalTableData = res.data.records
          this.festivalInfo.total = res.data.total * 1
          // this.festivalID = res.data.records.map(item => item.id)
        }
      })
    },
    // App上传文件
    AppUploadChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.AppFileList = []
      } else {
        this.AppFileList = [fileList[fileList.length - 1]]
      }
    },
    // App移除文件
    AppUploadRemove() {
      this.$refs.AppFromUpload.clearFiles()
      this.AppFileList = []
    },
    // App上传成功后回调
    AppSuccessCallback(response) {
      response = JSON.parse(response.response)
      this.form.AppFile = response.data.id
      this.AppUploadFlag = true
      this.$refs.AppFromUpload.clearFiles()
      this.AppFileList = []
      this.$nextTick(() => {
        if (this.AppUploadFlag === false) {
          return
        }
      })
    },
    // App上传失败后回调
    AppErrorCallback() {
      this.AppUploadFlag = false
      this.$refs.AppFromUpload.clearFiles()
      this.AppFileList = []
      this.$message({
        message: 'App证书文件上传失败！',
        type: 'error'
      })
    },
    // 新建App--接收子组件上传文件方法
    getFile(val) {
      console.log(val)
      this.AppIcon = val[0]
    },
    // 新建App的确定
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            // appIcon: "123",
            appIcon: this.AppIcon.fileValue,
            metaData: JSON.stringify(this.newAppForm)
            // metaData:"123",
          }
          // 创建app
          createApp(data).then((res) => {
            if (res.returnCode === '000000') {
              this.$message.success('新建App成功')
              this.getAppList()
              this.showNewApp = false
              // this.$emit('update:newAppDialogShow', false)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 新建App的取消
    cancel() {
      this.showNewApp = false
    },
    // App上传文件
    EditAppUploadChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.EditAppFileList = []
      } else {
        this.EditAppFileList = [fileList[fileList.length - 1]]
      }
    },
    // App移除文件
    EditAppUploadRemove() {
      this.$refs.AppFromUpload.clearFiles()
      this.EditAppFileList = []
    },
    // App上传成功后回调
    EditAppSuccessCallback(response) {
      response = JSON.parse(response.response)
      this.form.AppFile = response.data.id
      this.EditAppUploadFlag = true
      this.$refs.AppFromUpload.clearFiles()
      this.EditAppFileList = []
      this.$nextTick(() => {
        if (this.EditAppUploadFlag === false) {
          return
        }
      })
    },
    // App上传失败后回调
    EditAppErrorCallback() {
      this.EditAppUploadFlag = false
      this.$refs.AppFromUpload.clearFiles()
      this.EditAppFileList = []
      this.$message({
        message: 'App证书文件上传失败！',
        type: 'error'
      })
    },
    goBackEditApp() { // 编辑App的返回
      this.showChangeInfo = false
    },
    // 新建app弹框确定按钮事件
    // handleAppSubmit() {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.dialogFormVisible = false
    //     } else {
    //       this.$message.error('验证不通过！')
    //     }
    //   })
    // },
    // // 新建app弹框关闭按钮事件
    // handleAppClose() {
    //   this.dialogFormVisible = false
    // },
    //
    handleChangeUse() {
      this.$confirm('确定对应用进行修改吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          changeUse().then((res) => {
            if (res.returnCode === '000000') {
              this.$message.success('修改成功!')
            } else {
              this.$message.error('修改失败')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
    },
    // 删除app行
    handleDelete(item) {
      const params = {
        appId: item.AppID
      }
      this.$confirm('确定删除该App吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteApp(params)
            .then((res) => {
              console.log(res)
              if (res.returnCode === '000000') {
                this.$message.success('删除App成功!')
                this.getAppList()
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
    handleTabClick(tab, event) { // 切换tab栏
      // 点击配置管理
      console.log(event.target.getAttribute('id'))
      // if (event.target.getAttribute('id') === 'tab-second') {
      //   this.queryConfigure()
      // }
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleReleaseUploadChange(file, fileList) {
      // 节假日信息管理——选择文件
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.releaseFileList = []
      } else {
        this.releaseFileList = [fileList[fileList.length - 1]]
      }
    },
    handleReleaseUploadRemove(file, fileList) {
      // 节假日信息管理——移除文件
      this.releaseFileList = []
    },
    uploadSuccessCallback(response, file, fileList) {
      // 上传成功回调
      this.$refs.upload.clearFiles()
      this.releaseFileList = []
      this.$message.success('上传成功')
    },
    uploadErrorCallback(err) {
      // 上传失败回调
      this.$refs.upload.clearFiles()
      this.releaseFileList = []
      console.log('err:' + err)
      this.$message({
        message: '上传失败！',
        type: 'error'
      })
    },
    /**
     * @description 展开一列
     * @item 当前对象
     */
    toogleExpand(item) {
      console.log('>>>>>>>>>>>>>>')
      this.$refs.applicationRef.toggleRowExpansion(item)
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
    },
    handlePage(current) {
      this.pageInfo.current = current
      this.getAppList()
    },
    handlePageSize(size) {
      // debugger
      this.pageInfo.size = size
      this.getAppList()
    },

    handleFestivalPageSize(size) {
      this.festivalInfo.limit = size
      this.getFestivalPageList()
    },
    handleFestivalPage(current) {
      this.festivalInfo.page = current
      this.getFestivalPageList()
    },
    // 显示新建app组件按钮事件
    getNewApp() {
      this.showNewApp = true
    },
    // 点击按钮显示app组件管理弹框
    showApp(row) {
      const appId = row.AppID
      // 存储appId
      // this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', appId)
      sessionStorage.setItem('appId', appId)
      this.$router.push('../appComponentMgmt/index')
      // this.showAppComps = true
    },
    // 显示启动页子组件按钮事件
    getStartPage(row) {
      // 获取appId
      console.log(row)
      const appId = row.AppID
      // 存储appId
      // this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      sessionStorage.setItem('startPageId', appId)
      this.$router.push('../appSetting/appStartPage')
      // this.showStartPage = true
    },
    goBack() { // 关闭启动页
      this.showStartPage = false
    },
    // 显示新建页面子组件按钮事件
    getPage(row) {
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.showNewPage = true
    },
    editPage(row) {
      const appId = row.AppID
      sessionStorage.setItem('editPageAppId', appId)
      this.$router.push('../appSetting/editPage')
    },
    // 显示新建app子组件按钮事件
    getAppDev(row) {
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.showAppDev = true
    },
    // 显示路由配置子组件按钮事件
    getRouterPage(row) {
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.showRouterConfig = true
    },
    getNewRouter(row) { // 新建路由
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.newRouterVisible = true
    },
    // 显示基础信息修改子组件按钮事件
    editAppInfo(row) {
      console.log(row, '234567890')
      this.changeAppInfoId = row.AppID
      this.changeInfoForm.AppID = row.AppID
      this.changeInfoForm.AppName = row.AppName
      this.editAppIcon.fileValue = row.img
      this.changeInfoForm.AppDesc = row.AppDesc
      this.showChangeInfo = true
    },
    getEditFile(val) { // 编辑App信息--接收子组件上传文件方法
      console.log(val)
      this.editAppIcon = val[0]
    },
    confirmEdit() { // 确认修改app信息
      this.$refs.form.validate((valid) => {
        if (valid) {
          // for (var i = 0; i < this.tableData.length; i++) {
          //   if (this.changeInfoForm.AppID !== this.tableData[i].AppID) {
          //     const data = {
          //       appId: this.$store.state.dynamic.dynamicPageData.appId,
          //       metaJson: JSON.stringify(this.changeInfoForm)
          //     }
          //     editApp(data).then((res) => {
          //       console.log(res)
          //       if (res.returnCode === '000000') {
          //         this.$message.success('修改成功')
          //         this.getAppList()
          //         this.showChangeInfo = false
          //         // this.$emit('update:appChangeInfoDialogShow', false)
          //       }
          //     })
          //   } else {
          //     this.$message.error('此AppID已经存在')
          //   }
          // }
          const data = {
            appId: this.changeAppInfoId,
            icon: this.editAppIcon.fileValue,
            metaJson: JSON.stringify(this.changeInfoForm)
          }
          editApp(data).then((res) => {
            console.log(res)
            if (res.returnCode === '000000') {
              this.$message.success('修改成功')
              this.getAppList()
              this.showChangeInfo = false
              // this.$emit('update:appChangeInfoDialogShow', false)
            }
          })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 显示新建主题皮肤子组件按钮事件
    getNewTheme(row) {
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.dialogNewTheme = true
      // this.showNewTheme = false
    },
    newThemeCloseHandle() {
      this.dialogNewTheme = false
    },
    // 显示皮肤主题管理子组件按钮事件
    getThemeManage(row) {
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.showThemeManage = true
    },
    handleCloseAppThem() {
      this.showThemeManage = false
    },
    // 显示app智能管理子组件按钮事件
    getAppManage(row) {
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.showAppManage = true
    },
    // 显示app发布管理子组件按钮事件
    getPublicManage(row) {
      // 获取appId
      // const appId = row.AppID
      // 存储appId
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { appId: row.AppID })
      this.showPublicManage = true
    },
    // 删除节日信息
    handleDeteleFestivalInfo(item) {
      console.log(item, '$$$$$$$$$$$$$$$$')
      const params = {
        id: item.id
      }
      this.$confirm('确定删除该节日信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteFestivalInfo(params)
            .then((res) => {
              console.log(res)
              if (res.returnCode === '000000') {
                this.$message.success('删除成功!')
                this.getFestivalPageList()
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
    // 添加节日信息
    handleAdd() {
      this.festivalTitle = '新建节假日信息'
      this.festivalVisible = true
      this.$refs.festivalForm.resetFields()
    },
    // 显示编辑节假日信息弹框
    handleFestivalInfo(data) {
      this.festivalTitle = '编辑节假日信息'
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
        this.festivalID = data.id
      } else {
        data = {}
      }
      this.festivalVisible = true
    },
    handleReset() {
      this.festivalVisible = false
    },
    handleSubmit() {
      this.$refs.festivalForm.validate((valid) => {
        if (valid) {
          console.log('++++++')
          if (this.festivalTitle === '新建节假日信息') {
            // 保存新建节假日信息
            const params = {
              festivalName: this.formItem.festivalName,
              festivalCode: this.formItem.festivalCode,
              onDate: this.formItem.onDate
            }
            // 创建节假日信息
            saveOrUpadteFestival(params)
              .then((res) => {
                console.log(res)
                if (res.returnCode === '000000') {
                  this.$message.success('新建信息成功')
                  this.festivalVisible = false
                }
              })
              .catch((err) => {
                console.log(err)
              })
          }
          if (this.festivalTitle === '编辑节假日信息') {
            // 保存编辑节假日信息
            const params = {
              festivalName: this.formItem.festivalName,
              festivalCode: this.formItem.festivalCode,
              onDate: this.formItem.onDate,
              id: this.festivalID
            }
            // 创建节假日信息
            saveOrUpadteFestival(params)
              .then((res) => {
                console.log(res)
                if (res.returnCode === '000000') {
                  this.$message.success('保存成功')
                  this.festivalVisible = false
                  this.getFestivalPageList()
                }
              })
              .catch((err) => {
                console.log(err)
              })
          }
        } else {
          this.$message.error('验证不通过！')
        }
      })
    }
  }
}
</script>>

<style lang="scss" scoped>
.wrapper {
  .margin-b20 {
    margin-bottom: 20px;
  }
  .add-white-line {
    display: flex;
    margin-bottom: 20px;
    .add-white_label {
      width: 120px;
    }
    .add-white_cont {
      flex: 1;
      font {
        font-size: 10px;
        color: #267878;
        margin-top: 7px;
        display: inline-block;
      }
    }
  }
}
</style>
