<template>
  <div class="new-theme-wrap">
    <el-dialog
      title="新建皮肤主题"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @close="newThemeClose"
    >
      <!-- 新建主题form表单 -->
      <el-form
        ref="themeForm"
        :model="themeForm"
        :rules="themeRules"
        label-width="110px"
        size="small"
      >
        <el-form-item label="主题ID：" prop="themeId">
          <el-input v-model="themeForm.themeId" style="width:180px" placeholder="请输入主题Id" />
        </el-form-item>
        <el-form-item label="主题名称：" prop="themeName">
          <el-input v-model="themeForm.themeName" style="width:180px" placeholder="请输入主题名称" />
        </el-form-item>
        <el-form-item>
          <!-- 上传皮肤按钮 -->
          <span slot="label">
            <span style="font-size:14px">上传主题</span>
            <el-tooltip content="项目本地上传zip压缩文件，zip包中的文件名字需与主题ID一致" placement="top" effect="light">
              <i class="el-icon-question" style="color:#606266" />
            </el-tooltip>
            <span>：</span>
          </span>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="/pmobile/dynamic/theme/uploadTheme"
            :data="uploadData"
            :headers="headersToken"
            accept=".zip"
            :file-list="uploadList"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
          >
            <el-button size="small" class="el-icon-folder-opened">选择主题文件</el-button>
          <!-- <el-button type="success" size="small" class="el-icon-upload2" style="margin-bottom:20px" @click="uploadSubmit">点击上传</el-button> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button size="small" @click="goBack">返回</el-button>
        <el-button type="primary" size="small" style="margin-bottom:20px" @click="uploadSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/util'
export default {
  name: 'NewTheme',
  components: {},
  props: {
    dialogNewTheme: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      themeForm: {
        themeId: '',
        themeName: ''
      },
      themeRules: {
        themeId: [{ required: true, message: '请输入主题Id', trigger: 'blur' }],
        themeName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      },
      headersToken: {},
      uploadList: [],
      themeFromUpload: false,
      uploadData: {}
    }
  },
  watch: {
    dialogNewTheme() {
      this.visible = this.dialogNewTheme
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      Authorization: 'Bearer ' + token1
    }
  },
  mounted() {},
  methods: {
    newThemeClose() {
      this.$emit('update:dialogNewTheme', false)
    },
    // 点击上传
    uploadSubmit() {
      this.$refs.themeForm.validate((valid) => {
        if (valid) {
          this.uploadData.appId = this.$store.state.dynamic.dynamicPageData.appId
          this.uploadData.themeId = this.themeForm.themeId
          this.uploadData.themeName = this.themeForm.themeName
          console.log(this.uploadData, '%%%%%%%%上传')
          this.$refs.upload.submit()
          this.$emit('closeNewThemeDialog')
        }
      })
    },
    handlePreview(file, fileList) {
      // 上传文件
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.uploadList = []
      } else {
        this.uploadList = [fileList[fileList.length - 1]]
      }
      console.log(this.uploadList, '********')
    },
    handleRemove() {
      // 移除文件
      this.uploadList = []
    },
    handleSuccess(response, file, fileList) {
      // 上传成功提示并且清除列表
      this.$refs.upload.clearFiles()
      this.uploadList = []
      this.themeForm.themeId = ''
      this.themeForm.themeName = ''
      if (response.returnCode === '000000') {
        this.$message.success('创建成功')
      }
    },
    handleExceed(files, fileList) {
      this.message.warning(
        `当前选择一个文件，本次选择了${files.length}个文件，共选择了${files.length + fileList.length}个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`)
    },
    goBack() {
      this.$emit('closeNewThemeDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.new-theme-wrap{
    // text-align: center;
}
</style>
