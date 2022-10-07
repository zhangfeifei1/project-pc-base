<template>
  <div class="info-change-wrap">
    <el-form ref="form" :model="changeInfoForm" label-width="160px" :rules="editAppRules">
      <el-form-item label="AppID:" prop="AppID">
        <el-input
          v-model="changeInfoForm.AppID"
          style="width:180px"
          disabled
        />
      </el-form-item>
      <el-form-item label="App名称:" prop="AppName" required>
        <el-input v-model="changeInfoForm.AppName" placeholder="请输入AppName" style="width:180px" />
      </el-form-item>
      <el-form-item label="App图标">
        <template>
          <el-upload
            ref="AppFromUpload"
            class="upload-demo"
            action="/pmobile/diffpackage/mpaas/sys/upload"
            list-type="picture"
            :headers="headersToken"
            :file-list="EditAppFileList"
            :auto-upload="false"
            :on-change="EditAppUploadChange"
            :on-remove="EditAppUploadRemove"
            :on-success="EditAppSuccessCallback"
            :on-error="EditAppErrorCallback"
            style="width:350px"
          >
            <el-button slot="trigger" size="small" class="el-icon-upload2">点击上传</el-button>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="App描述:" prop="AppDesc" required>
        <el-input
          v-model="changeInfoForm.AppDesc"
          type="textarea"
          placeholder="请输入AppDesc"
          style="width:230px"
        />
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button size="small" @click="goBackEditApp">返回</el-button>
      <el-button type="primary" size="small" @click="confirmEdit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/util'
import { editApp } from '@/api/dynamicPageApi'
export default {
  props: {
    appChangeInfoDialogShow: {
      type: Boolean
    }
  },
  data() {
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
      changeInfoForm: {
        AppID: this.$store.state.dynamic.dynamicPageData.appId,
        AppName: this.$store.state.dynamic.dynamicPageData.appName,
        AppDesc: this.$store.state.dynamic.dynamicPageData.appDesc
      },
      headersToken: {},
      AppUploadFlag: false,
      EditAppFileList: [],
      editAppRules: {
        AppName: [
          { required: true, validator: validateEditAppName, trigger: 'blur' }
        ],
        AppDesc: [
          { required: true, validator: validateEditAppDesc, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      Authorization: 'Bearer ' + token1
    }
  },
  methods: {
    confirmEdit() { // 确认修改app信息
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            appId: this.$store.state.dynamic.dynamicPageData.appId,
            metaJson: JSON.stringify(this.changeInfoForm)
          }
          editApp(data).then((res) => {
            console.log(res)
            if (res.returnCode === '000000') {
              this.$message.success('修改成功')
              this.$emit('update:appChangeInfoDialogShow', false)
            }
          })
        } else {
          this.$message.error('验证不通过！')
        }
      })
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
      this.AppUploadFlag = true
      this.$refs.AppFromUpload.clearFiles()
      this.EditAppFileList = []
      this.$nextTick(() => {
        if (this.AppUploadFlag === false) {
          return
        }
      })
    },
    // App上传失败后回调
    EditAppErrorCallback() {
      this.AppUploadFlag = false
      this.$refs.AppFromUpload.clearFiles()
      this.EditAppFileList = []
      this.$message({
        message: 'App证书文件上传失败！',
        type: 'error'
      })
    },
    // 返回
    goBackEditApp() {
      this.$emit('update:appChangeInfoDialogShow', false)
    }
  }
}
</script>>

<style lang="scss" scoped>
.info-change-wrap {
  padding-bottom: 20px;
  .footer-button {
    text-align: center;
    margin-bottom: 20px;
  }
}
/deep/.el-form-item__label {
  text-align: right;
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
