<template>
  <div class="info-change-wrap">
    <el-form ref="form" :model="newAppForm" label-width="160px" :rules="newAppRules">
      <el-form-item label="AppID:" prop="AppID" required>
        <el-input v-model="newAppForm.AppID" placeholder="请输入AppID" style="width:180px" />
      </el-form-item>
      <el-form-item label="App名称:" prop="AppName" required>
        <el-input v-model="newAppForm.AppName" placeholder="请输入AppName" style="width:180px" />
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
      <el-form-item label="App描述:" prop="AppDesc" required>
        <el-input
          v-model="newAppForm.AppDesc"
          type="textarea"
          placeholder="请输入AppDesc"
          style="width:230px"
        />
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button type="default" size="small" @click="cancel">取消</el-button>
      <el-button type="primary" size="small" @click="confirm()">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/util'
import fileupload from '@/components/FileUpload/fileupload.vue'
import { createApp } from '@/api/dynamicPageApi'
export default {
  components: {
    fileupload
  },
  props: {
    newAppDialogShow: {
      type: Boolean
    }
  },
  data() {
    const validateAppId = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('AppID不能为空'))
      } else {
        callback()
      }
    }
    const validateAppName = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('App名称不能为空'))
      } else {
        callback()
      }
    }
    const validateAppOfflinePackage = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('离线包关联App不能为空'))
      } else {
        callback()
      }
    }
    const validateAppMaidian = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('埋点关联APP不能为空'))
      } else {
        callback()
      }
    }
    const validateAppDesc = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('App描述不能为空'))
      } else {
        callback()
      }
    }
    return {
      newAppForm: {
        AppID: '',
        AppName: '',

        // AppOfflinePackage: "",
        // AppMaidian: "",
        AppDesc: ''
      },
      AppIcon: {},
      headersToken: {},
      AppFileList: [],
      AppUploadFlag: false,
      newAppRules: {
        AppID: [{ required: true, validator: validateAppId, trigger: 'blur' }],
        AppName: [
          { required: true, validator: validateAppName, trigger: 'blur' }
        ],
        AppOfflinePackage: [
          {
            required: true,
            validator: validateAppOfflinePackage,
            trigger: 'blur'
          }
        ],
        AppMaidian: [
          { required: true, validator: validateAppMaidian, trigger: 'blur' }
        ],
        AppDesc: [
          { required: true, validator: validateAppDesc, trigger: 'blur' }
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
    // 接收子组件上传文件方法
    getFile(val) {
      console.log(val)
      this.AppIcon = val[0]
    },
    // 确定
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('++++++')
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
              this.$emit('update:newAppDialogShow', false)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    cancel() {
      this.$emit('update:newAppDialogShow', false)
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
