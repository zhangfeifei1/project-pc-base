<template>
  <div class="wrapper">
    <el-dialog
      :visible.sync="packageData.dialogVisible"
      title="新增离线包"
      width="60%"
      top="80px"
      @opened="checkConfiguration"
      @close="handlePackgeClose"
    >
      <!-- 头部 -->
      <div class="wrapper-header">
      <!-- <div class="wrapper-header_l">
        <div> 新增离线包 </div>
        <div>H5App : 新增JSAPI {{packageData.packageId}} </div>
      </div> -->
      <!-- <div class="wrapper-header_r">
        当前最高版本：IOS 0.0.0，Android 0.0.0
      </div> -->
      </div>
      <!-- 表单 -->
      <div class="wrapper-cont">
        <el-card class="box-card whiteBac">
          <el-form ref="packageForm" :model="packageForm" label-width="120px" :rules="formRules" size="small">
            <el-divider content-position="left"><span class="fontTitle">基本信息</span></el-divider>
            <el-form-item prop="type" required>
              <span slot="label">
                <span>资源包类型</span>
                <el-tooltip content="全局资源包一般存放全局资源文件，比如公共js库，图片等，能够有效提高性能" placement="top" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <el-radio-group v-model="packageForm.type" @change="chooseAll">
                <el-radio label="全局资源包" />
                <el-radio label="普通资源包" />
              </el-radio-group>
              <div class="packageType-tip">一个H5App只能包含一个包类型，选择之后无法更改。当前全局资源包一级目录名称为：<span>70000001</span>,二级目录名称为：<span>mcube-prod.oss-cn-hangzhou</span>，三级目录名称为：<span>3werwerwerewr</span></div>
            </el-form-item>
            <el-form-item prop="version" required>
              <span slot="label">
                <span>版本</span>
                <el-tooltip content="离线包的版本号，范围为1.0.0.0 ~ 99.99.99.99" placement="top" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <el-input v-model="packageForm.version" style="width:240px" />
            </el-form-item>
            <el-form-item ref="clientTypeRule" label="客户端范围：" prop="clientType">
              <el-checkbox-group v-model="packageForm.clientType" @change="changeClient">
                <div style="width:100%; height:60px; overflow:hidden;">
                  <div style="width:130px; float:left;">
                    <el-checkbox label="IOS" name="clientType" />
                  </div>
                  <div style="float:left;">
                    <el-form-item ref="IOSLowRule" label="最低版本：" style="display:inline-block" label-width="100px" prop="IOSLowVersion">
                      <el-input v-model="packageForm.IOSLowVersion" style="width:140px" :disabled="addios" />
                    </el-form-item>
                    <el-form-item ref="IOSHighRule" label="最高版本：" style="display:inline-block" label-width="100px" prop="IOSHighVersion">
                      <el-input v-model="packageForm.IOSHighVersion" style="width:140px" :disabled="addios" />
                    </el-form-item>
                  </div>
                </div>
                <div style="width:100%; height:60px; overflow:hidden;">
                  <div style="width:130px; float:left;">
                    <el-checkbox label="Android" name="clientType" />
                  </div>
                  <div style="float:left;">
                    <el-form-item ref="AndroidLowRule" label="最低版本：" style="display:inline-block" label-width="100px" prop="AndroidLowVersion">
                      <el-input v-model="packageForm.AndroidLowVersion" style="width:140px" :disabled="addandroid" />
                    </el-form-item>
                    <el-form-item ref="AndroidHighRule" label="最高版本：" style="display:inline-block" label-width="100px" prop="AndroidHighVersion">
                      <el-input v-model="packageForm.AndroidHighVersion" style="width:140px" :disabled="addandroid" />
                    </el-form-item>
                  </div>
                </div>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item required>
              <span slot="label">
                <span>文件</span>
                <el-tooltip content="项目本地www文件夹的zip压缩文件，文件路径中不能包含中文" placement="top" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <el-upload
                ref="upload"
                class="upload-demo"
                action="/pmobile/diffpackage/zipdiffversion/save"
                :data="uploadData"
                :headers="headersToken"
                accept=".zip"
                :file-list="uploadList"
                :auto-upload="false"
                :on-change="handleUploadChange"
                :on-remove="handleUploadRemove"
                :on-success="uploadSuccessCallback"
                :on-error="uploadErrorCallback"
              >
                <el-button size="small" class="el-icon-upload2">选择文件</el-button>
              </el-upload>
            </el-form-item>
            <el-divider content-position="left" style="margin:10px 0;"><span class="fontTitle">配置信息</span></el-divider>
            <el-form-item prop="entryPage" required>
              <span slot="label">
                <span>主入口URL</span>
                <el-tooltip content="可以看做离线包的首页" placement="top" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <el-input v-model="packageForm.entryPage" />
            </el-form-item>
            <el-form-item required>
              <span slot="label">
                <span>虚拟域名</span>
                <el-tooltip content="客户端加载本地离线包文件的时候，给本地文件绑定该域名作为后缀，使本地文件地址看起来跟规范" placement="top" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <el-input v-model="packageForm.virtualName" disabled />
            </el-form-item>
          <!-- <el-form-item label="扩展信息：">
            <el-input type="textarea" v-model="packageForm.configureInfo.desc"></el-input>
          </el-form-item>
          <el-form-item label="下载时机：" required>
            <el-select v-model="packageForm.configureInfo.loadTiming" placeholder="请选择" style="width:100%;">
              <el-option label="仅WIFI（非WIFI需用户使用应用时才会下载）" value="1"></el-option>
              <el-option label="所有网络都下载（会对用户流量造成负面影响，非特殊场景禁用）" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="安装时机：" required>
            <el-select v-model="packageForm.configureInfo.installTiming" placeholder="请选择" style="width:100%;">
              <el-option label="不预加载（只有进入离线包或小程序页面时才安装）" value="1"></el-option>
              <el-option label="预加载（离线包或小程序下载完成后自动安装）" value="2"></el-option>
            </el-select>
          </el-form-item> -->
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handlePackgeClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>>
<script>
import { getConfiguration } from '@/api/offlinePackageMgt'
import { getToken } from '@/utils/util'
import {
  Loading
} from 'element-ui'
var loadingInstance = ''
export default {
  name: 'AddPackage',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    packageData: Object
  },
  data() {
    const validateVersion = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('版本号不能为空'))
      } else if (!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){3}$/.test(value)) {
        callback(new Error('版本号格式参考1.0.0.1'))
      } else {
        callback()
      }
    }
    // const IOSLowRule = (rule, value, callback) => {
    //   if (!value.trim()) {
    //     return callback(new Error('版本号不能为空'))
    //   } else if (!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){3}$/.test(value)) {
    //     callback(new Error('版本号格式参考1.0.0.1'))
    //   } else {
    //     callback()
    //   }
    // }
    // const IOSHighRule = (rule, value, callback) => {
    //   if (!value.trim()) {
    //     return callback(new Error('版本号不能为空'))
    //   } else if (!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){3}$/.test(value)) {
    //     callback(new Error('版本号格式参考1.0.0.1'))
    //   } else {
    //     callback()
    //   }
    // }
    // const AndroidLowRule = (rule, value, callback) => {
    //   if (!value.trim()) {
    //     return callback(new Error('版本号不能为空'))
    //   } else if (!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){3}$/.test(value)) {
    //     callback(new Error('版本号格式参考1.0.0.1'))
    //   } else {
    //     callback()
    //   }
    // }
    // const AndroidHighRule = (rule, value, callback) => {
    //   if (!value.trim()) {
    //     return callback(new Error('版本号不能为空'))
    //   } else if (!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){3}$/.test(value)) {
    //     callback(new Error('版本号格式参考1.0.0.1'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateEntryPage = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('主入口URL不能为空'))
      } else if (!/.html$/.test(value)) {
        return callback(new Error('必须以 .html结尾，参照index.html'))
      } else {
        callback()
      }
    }
    return {
      addios: true,
      addandroid: true,
      initData: {
        IOSLowVersion: '',
        IOSHighVersion: '',
        AndroidLowVersion: '',
        AndroidHighVersion: ''
      },
      headersToken: {},
      uploadList: [],
      packageForm: {
        type: '',
        version: '',
        clientType: [],
        IOSLowVersion: '',
        IOSHighVersion: '',
        AndroidLowVersion: '',
        AndroidHighVersion: '',
        virtualName: 'baidu.com',
        entryPage: ''
      },
      uploadData: {
        clientScope: {}
      },
      formRules: {
        type: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        version: [
          { required: true, validator: validateVersion, trigger: 'blur' }
        ],
        clientType: [
          { type: 'array', required: true, message: '请至少选择一个客户端类型', trigger: 'change' }
        ],
        // IOSLowVersion: [
        //   { required: false, validator: IOSLowRule, trigger: 'blur' }
        // ],
        // IOSHighVersion: [
        //   { required: false, validator: IOSHighRule, trigger: 'blur' }
        // ],
        // AndroidLowVersion: [
        //   { required: false, validator: AndroidLowRule, trigger: 'blur' }
        // ],
        // AndroidHighVersion: [
        //   { required: false, validator: AndroidHighRule, trigger: 'blur' }
        // ],
        entryPage: [
          { required: false, validator: validateEntryPage, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      'Authorization': 'Bearer ' + token1,
      'appid': '1552274783265'
    }
  },
  methods: {
    chooseAll() {
      if (this.packageForm.type === '全局资源包') {
        this.packageForm.clientType.push('IOS')
        this.packageForm.clientType.push('Android')
        this.addios = false
        this.addandroid = false
      } else {
        this.packageForm.clientType = []
        this.addios = true
        this.addandroid = true
        // this.$refs.clientTypeRule.resetField()
        // this.$refs.IOSLowRule.resetField()
        // this.$refs.IOSHighRule.resetField()
        // this.$refs.AndroidLowRule.resetField()
        // this.$refs.AndroidHighRule.resetField()
      }
    },
    changeClient() {
      if (this.packageForm.clientType.indexOf('IOS') !== -1 && this.packageForm.clientType.indexOf('Android') !== -1) {
        this.addios = false
        this.addandroid = false
      } else if (this.packageForm.clientType.indexOf('IOS') === -1 && this.packageForm.clientType.indexOf('Android') !== -1) {
        this.addios = true
        this.addandroid = false
        // this.$refs.IOSLowRule.resetField()
        // this.$refs.IOSHighRule.resetField()
      } else if (this.packageForm.clientType.indexOf('IOS') !== -1 && this.packageForm.clientType.indexOf('Android') === -1) {
        this.addios = false
        this.addandroid = true
        // this.$refs.AndroidLowRule.resetField()
        // this.$refs.AndroidHighRule.resetField()
      } else {
        this.addios = true
        this.addandroid = true
        // this.$refs.IOSLowRule.resetField()
        // this.$refs.IOSHighRule.resetField()
        // this.$refs.AndroidLowRule.resetField()
        // this.$refs.AndroidHighRule.resetField()
      }
    },
    compare(Low, High) {
      var L = Low.split('.')[0] * 1000000 + Low.split('.')[1] * 10000 + Low.split('.')[2] * 100 + Low.split('.')[3]
      var H = High.split('.')[0] * 1000000 + High.split('.')[1] * 10000 + High.split('.')[2] * 100 + High.split('.')[3]
      if (L > H) {
        return false
      } else {
        return true
      }
    },
    checkConfiguration() { // 查询是否配置域名
      getConfiguration().then(res => {
        if (res.total !== '0') {
          this.packageForm.virtualName = res.data.records[0].virtualName
        } else {
          this.$message({
            message: '虚拟域名未未配置，请优先配置！',
            type: 'warning'
          })
        }
      })
    },
    handlePackgeClose() { // 关闭弹窗
      this.packageData.dialogVisible = false
      this.$refs['packageForm'].resetFields()
      this.$refs.upload.clearFiles()
      Object.assign(this.packageForm, this.initData)
    },
    handleSubmit() { // 提交离线包版本
      this.$refs['packageForm'].validate(valid => {
        if (valid) {
          console.log('data:' + JSON.stringify(this.packageForm))
          this.uploadData.packageId = this.packageData.packageId
          this.uploadData.version = this.packageForm.version
          this.uploadData.type = this.packageForm.type
          this.uploadData.entryPage = this.packageForm.entryPage
          this.uploadData.virtualName = this.packageForm.virtualName
          if (this.packageForm.type === '全局资源包') {
            this.uploadData.type = '0'
          } else {
            this.uploadData.type = '1'
          }
          this.packageForm.clientType.forEach(item => {
            if (item === 'IOS') {
              const ios = {
                highVersion: this.packageForm.IOSHighVersion,
                lowVersion: this.packageForm.IOSLowVersion
              }
              this.$set(this.uploadData.clientScope, 'ios', ios)
            } else if (item === 'Android') {
              const android = {
                highVersion: this.packageForm.AndroidHighVersion,
                lowVersion: this.packageForm.AndroidLowVersion
              }
              this.$set(this.uploadData.clientScope, 'android', android)
            }
          })
          if (this.uploadList.length === 0) {
            this.$message({
              message: '请选择上传的文件',
              type: 'error'
            })
          } else if (this.compare(this.packageForm.IOSLowVersion, this.packageForm.IOSHighVersion) === false) {
            this.$message({
              message: 'IOS 最低版本号不应高于最高版本号',
              type: 'error'
            })
          } else if (this.compare(this.packageForm.AndroidLowVersion, this.packageForm.AndroidHighVersion) === false) {
            this.$message({
              message: 'Android 最低版本号不应高于最高版本号',
              type: 'error'
            })
          } else {
            // debugger
            this.uploadData.clientScope = JSON.stringify(this.uploadData.clientScope)
            console.log('uploadData:' + JSON.stringify(this.uploadData))
            this.$confirm('确认提交吗？')
              .then(_ => {
                // 打开遮罩
                // debugger
                loadingInstance = Loading.service({
                  text: '数据加载中'
                })
                this.$refs.upload.submit()
              })
              .catch(_ => {})
          }
        }
      })
    },
    handleUploadChange(file, fileList) { // 上传文件
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.uploadList = []
      } else {
        this.uploadList = [fileList[fileList.length - 1]]
      }
    },
    handleUploadRemove() { // 移除文件
      this.uploadList = []
    },
    uploadSuccessCallback() { // 上传成功后回调
      // 关闭遮罩
      // debugger
      // response = JSON.parse(response.response)
      loadingInstance.close()
      this.$refs.upload.clearFiles()
      this.uploadList = []
      this.$emit('fatherMethod', this.packageData.packageId)
      this.$refs['packageForm'].resetFields()
      this.$refs.upload.clearFiles()
      Object.assign(this.packageForm, this.initData)
      this.packageData.dialogVisible = false
      this.$message.success('上传成功')
      // console.log('response:' + JSON.stringify(response))
      // if (response.returnCode === '000000') {
      //   this.$message({
      //     message: '上传成功！',
      //     type: 'success'
      //   })
      //   this.$emit('fatherMethod', this.packageData.packageId)
      //   this.$refs['packageForm'].resetFields()
      //   this.$refs.upload.clearFiles()
      //   Object.assign(this.packageForm, this.initData)
      //   this.packageData.dialogVisible = false
      // } else {
      //   this.$message({
      //     message: response.message,
      //     type: 'error'
      //   })
      // }
    },
    uploadErrorCallback(err) { // 上传失败后回调
      // 关闭遮罩
      // debugger
      loadingInstance.close()
      this.$refs.upload.clearFiles()
      this.uploadList = []

      this.$message({
        message: '上传失败！',
        type: 'error'
      })
      console.log('err:' + err)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  .wrapper-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999;
    font-size: 18px;
    margin-bottom:30px;
    .wrapper-header_l {
      display: flex;
      i{
        margin-right: 10px;
      }
      >div:nth-child(3) {
        color:#333;
        margin: 0  10px;
      }
    }
  }
  .wrapper-cont{
     height:60vh;
     overflow: scroll;
      .box-card {
        background: #ffffff;
        .packageType-tip{
          font-size: 13px;
          color: #909399;
          line-height: 18px;
        }
      }
    }
  }
.fontTitle{
  font-size: 16px;
  color: #606266;
}
/deep/ .el-divider{
  margin: 20px 0;
}
/deep/ .el-card__body {
    padding: 10px 0 10px 0;
}
/deep/ .el-tooltip__popper {
    max-width: 280px !important;
}
/deep/ .el-tooltip__popper.is-light{
  max-width: 280px !important;
}
/deep/ .el-form-item__label{
  padding: 0;
}
.whiteBac{
  background: #ffffff!important;
}
</style>
