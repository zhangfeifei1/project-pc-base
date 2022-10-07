<template>
  <div>
    <!-- 按钮盒 -->
    <div style="margin-bottom:20px">
      <el-button
        type="primary"
        style="width:200px;margin-right:10px"
        size="small"
        @click="handleAppDownload()"
      >下载APP用于编辑主题</el-button>
    </div>
    <!-- 新建主题form表单 -->
    <!-- <el-form
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
        <span slot="label">
          <span style="font-size:14px">上传主题</span>
          <el-tooltip content="项目本地www文件夹的zip压缩文件，文件路径中不能包含中文" placement="top" effect="light">
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
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="small" class="el-icon-upload2" @click="uploadSubmit">点击上传</el-button>
      </el-form-item>
    </el-form> -->

    <!-- 表格区域 -->
    <div>
      <el-table
        :data="themeTableData"
        style="width:100%"
        border
        :cell-style="cellstyle"
        :header-cell-style="rowClass"
        size="small"
      >
        <el-table-column label="主题ID" prop="themeId" />
        <el-table-column label="主题名称" prop="themeName" />
        <el-table-column label="下载组件">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleDownTheme(scope.row.appId,scope.row.themeId)"
            >下载主题</el-button>
          </template>
        </el-table-column>
        <el-table-column label="删除组件" prop="delete">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDeleteTheme(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" style="margin-bottom:20px">
        <el-pagination
          background
          :current-page="themePage.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="themePage.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="themePage.total"
          @size-change="handlePageSize"
          @current-change="handlePage"
        />
      </el-col>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/util'
import $config from '@/settings/defaultSetting'
import axios from 'axios'
import {
  themeList,
  downloadTheme,
  deleteTheme
} from '@/api/dynamicPageApi'
export default {
  data() {
    return {
      id: '',
      // themeForm: {
      //   themeId: '',
      //   themeName: ''
      // },
      // themeRules: {
      //   themeId: [{ required: true, message: '请输入主题Id', trigger: 'blur' }],
      //   themeName: [
      //     { required: true, message: '请输入主题名称', trigger: 'blur' }
      //   ]
      // },
      // headersToken: {},
      // uploadList: [],
      // themeFromUpload: false,
      // uploadData: {},
      themeTableData: [],
      themePage: {
        total: 0,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      Authorization: 'Bearer ' + token1
    }
    // 获取皮肤列表
    this.getThemeList()
  },
  methods: {
    // 获取皮肤列表
    getThemeList() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        current: this.themePage.page, // 当前在第几页
        size: this.themePage.limit // 一页有几个
      }
      themeList(params)
        .then((res) => {
          console.log(res, '%%%%%%%%%%themeList')
          if (res.returnCode === '000000') {
            this.themeTableData = res.data.records
            this.themePage.total = res.data.total * 1
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    // // 点击上传
    // uploadSubmit() {
    //   this.$refs.themeForm.validate((valid) => {
    //     if (valid) {
    //       this.uploadData.appId = this.$store.state.dynamic.dynamicPageData
    //       this.uploadData.themeId = this.themeForm.themeId
    //       this.uploadData.themeName = this.themeForm.themeName
    //       console.log(this.uploadData, '%%%%%%%%上传')
    //       this.$refs.upload.submit()
    //     }
    //   })
    // },
    // handlePreview(file, fileList) {
    //   // 上传文件
    //   if (fileList.length > 1) {
    //     fileList.shift()
    //   }
    //   if (fileList.length === 0) {
    //     this.uploadList = []
    //   } else {
    //     this.uploadList = [fileList[fileList.length - 1]]
    //   }
    //   console.log(this.uploadList, '********')
    // },
    // handleRemove() {
    //   // 移除文件
    //   this.uploadList = []
    // },
    // handleSuccess(response, file, fileList) {
    //   // 上传成功提示并且清除列表
    //   this.$refs.upload.clearFiles()
    //   this.uploadList = []
    //   this.themeForm.themeId = ''
    //   this.themeForm.themeName = ''
    //   // console.log(response, file, fileList);
    //   if (response.returnCode === '000000') {
    //     // this.$message({
    //     //   message: response.message,
    //     //   type: "success",
    //     // });
    //     this.$message.success('创建成功')
    //   }
    //   // else {
    //   //   this.$message({
    //   //     message: response.message,
    //   //     type: "error",
    //   //   });
    //   // }
    // },
    // handleExceed(files, fileList) {
    //   this.message.warning(
    //     `当前选择一个文件，本次选择了${files.length}个文件，共选择了${files.length + fileList.length}个文件`
    //   )
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}?`)
    // },
    // 删除皮肤
    handleDeleteTheme(item) {
      console.log(111, item)
      const data = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        themeId: item.themeId,
        id: item.id
      }
      this.$confirm('确定删除该主题吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTheme(data)
            .then((res) => {
              console.log(res)
              if (res.returnCode === '000000') {
                this.$message.success('删除主题成功!')
                this.getThemeList()
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
    handleDownTheme(appId, themeId) {
      const token = getToken()
      // config.headers['Bl'] = '1'
      if (token) {
        $config.apiUrl.headers['Authorization'] = 'Bearer ' + token
      }
      axios({
        method: 'post',
        headers: $config.apiUrl.headers,
        url: '/pmobile/dynamic/theme/downloadTheme?applicationId=' + appId + '&themeId=' + themeId,
        responseType: 'blob'
      }).then((response) => {
        var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', themeId + '.zip')
        document.body.appendChild(link)
        link.click()
        // if (response.returnCode === '000000') {
        //   this.$message.success('')
        // }
      })
    },
    // 2进制文件流下载转文件
    // downloadFile(fileName, content) {
    //   const link = document.createElement('a') // 创建a标签
    //   link.style.display = 'none'
    //   link.setAttribute('download', fileName) // 必须指明下载文件类型，否则会乱码
    //   const objectUrl = URL.createObjectURL(content)
    //   link.href = objectUrl
    //   link.click()
    //   URL.revokeObjectURL(objectUrl)
    // },
    // 下载APP
    handleAppDownload() {
      // const downloadElement = document.createElement('a')
      // downloadElement.href = `/pmobile/dynamic/app/downloadApp/${this.$store.state.dynamic.dynamicPageData}`
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
        url: `/pmobile/dynamic/app/downloadApp/${this.$store.state.dynamic.dynamicPageData.appId}`,
        responseType: 'blob'
      }).then((response) => {
        var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.$store.state.dynamic.dynamicPageData.appId + '.zip')
        document.body.appendChild(link)
        link.click()
        // if (response.returnCode === '000000') {
        //   this.$message.success('')
        // }
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
    },
    handlePage(current) {
      this.themePage.page = current
    },
    handlePageSize(size) {
      this.themePage.limit = size
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
