<template>
  <div class="app-container wrapper">
    <!-- 添加 -->
    <div style="margin-bottom:20px">
      <el-button type="primary" size="small" @click="handleAddPublicComp">添加公共组件</el-button>
    </div>
    <!-- 管理组件信息区域style="margin:0px 50px 40px 50px" -->
    <div class="componentMgmt">
      <el-tabs v-model="activePublicMgtTable" type="border-card">
        <el-tab-pane label="导航栏" name="navbarPublicMgt">
          <!-- 表格1 -->
          <el-table
            :data="navBarTableData"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="max-height:400px;overflow:auto"
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
            <el-table-column prop="download" label="下载组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDownloadComp(scope.row.comID)">下载组件</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDeletePublicComp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="sourceMg" label="资源管理">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleManageFile(scope.row)">管理</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="内容栏" name="compsPublicMgt">
          <!-- 表格2 -->
          <el-table
            :data="compsTableData"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="max-height:400px;overflow:auto"
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
            <el-table-column prop="download" label="下载组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDownloadComp(scope.row.comID)">下载组件</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDeletePublicComp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="sourceMg" label="资源管理">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleManageFile(scope.row)">管理</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="底部栏" name="tabbarPublicMgt">
          <!-- 表格3 -->
          <el-table
            :data="tabBarTableData"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
            style="max-height:400px;overflow:auto"
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
            <el-table-column prop="download" label="下载组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDownloadComp(scope.row.comID)">下载组件</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除组件">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDeletePublicComp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="sourceMg" label="资源管理">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleManageFile(scope.row)">管理</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加公共组件弹框 -->
    <el-dialog title="添加公共组件" top="250px" :visible.sync="addPublicCompsVisible">
      <el-form
        ref="publicCompsForm"
        :model="formItem"
        :rules="formItemRules"
        label-width="120px"
        size="small"
      >
        <el-form-item label="组件文件：" prop="publicCompsFile">
          <el-upload
            ref="PubComponentFromUpload"
            v-model="formItem.publicCompsFile"
            class="upload-demo"
            action="/pmobile/dynamic/comp/uploadComp"
            :data="uploadData"
            :headers="headersToken"
            :file-list="PubComponentFileList"
            :auto-upload="false"
            :on-change="PubComponentUploadChange"
            :on-remove="PubComponentUploadRemove"
            :on-success="PubComponentSuccessCallback"
            :on-error="PubComponentErrorCallback"
            style="width:350px"
          >
            <el-button slot="trigger" type="primary" class="el-icon-folder-opened" size="small">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="组件类型：" prop="publicCompsType" required>
          <el-select
            v-model="formItem.publicCompsType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in publicCompsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button type="default" size="small" style="margin-top:10px;margin-bottom:20px" @click="goBack">返回</el-button>
        <el-button type="primary" size="small" @click="submitAdd">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑schema子组件 -->
    <el-dialog v-if="showEditSchema" title="编辑scheam" :visible.sync="showEditSchema" width="70%">
      <edit-schema :edit-schema-dialog.sync="showEditSchema" />
    </el-dialog>
    <!-- 配置子组件 -->
    <el-dialog v-if="showSchemaConfig" title="配置" :visible.sync="showSchemaConfig" width="70%">
      <schema-config :config-dialog-show.sync="showSchemaConfig" />
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
import { getAllPublicComp, deletePublicComp } from '@/api/pubComponentApi'
export default {
  components: {
    EditSchema: () => import('@/views/dynamicIndex/pubComponentMgmt/schemaJson'),
    SchemaConfig: () => import('@/views/dynamicIndex/editor/configFile')
    // ManageFile: () => import('@/views/dynamicIndex/pubComponentMgmt/ManageFile')
  },
  data() {
    return {
      activePublicMgtTable: 'navbarPublicMgt',
      PubComponentFileList: [],
      PubComponentUploadFlag: false,
      compName: '', // 获取公共组件的ID Name
      navBarTableData: [
      ],
      tabBarTableData: [
      ],
      compsTableData: [
      ],
      pubComponent: {
        total: 0,
        page: 1,
        limit: 10
      },
      formItem: {
        publicCompsFile: '',
        publicCompsType: ''
      },
      formItemRules: {
        // publicCompsFile: [{
        //   required: true,
        //   message: '请选择文件',
        //   trigger: 'blur'
        // }],
        publicCompsType: [{
          required: true,
          message: '请选择文件类型',
          trigger: 'blur'
        }]
      },
      publicCompsOptions: [{
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
      uploadData: {},
      addPublicCompsVisible: false, // 添加公共组件弹框
      showEditSchema: false, // 是否显示编辑schema子组件
      showManageFile: false, // 是否显示管理文件子组件
      showSchemaConfig: false
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      'Authorization': 'Bearer ' + token1,
      'appid': '1552274783265'
    }
    // 获取公共组件列表
    this.getAllCompList()
  },
  methods: {
    // PubComponent上传文件
    PubComponentUploadChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.PubComponentFileList = []
      } else {
        this.PubComponentFileList = [fileList[fileList.length - 1]]
      }
    },
    // PubComponent移除文件
    PubComponentUploadRemove() {
      this.$refs.PubComponentFromUpload.clearFiles()
      this.PubComponentFileList = []
    },
    // PubComponent上传成功后回调
    PubComponentSuccessCallback() {
      // response = JSON.parse(response.response)
      this.PubComponentUploadFlag = true
      this.$refs.PubComponentFromUpload.clearFiles()
      this.$refs.publicCompsForm.resetFields()
      this.PubComponentFileList = []
      this.$nextTick(() => {
        if (this.PubComponentUploadFlag === false) {
          return
        }
      })
    },
    // PubComponent上传失败后回调
    PubComponentErrorCallback() {
      this.PubComponentUploadFlag = false
      this.$refs.PubComponentFromUpload.clearFiles()
      this.PubComponentFileList = []
      this.$message({
        message: 'PubComponent证书文件上传失败！',
        type: 'error'
      })
    },
    getAllCompList() { // 获取公共组件列表
      getAllPublicComp().then(res => {
        console.log(res, '**公共组件列表**')
        if (res.returnCode === '000000') {
          this.navBarTableData = []
          res.data.navbar.forEach(element => {
            const tmpObj = { comID: element }
            this.navBarTableData.push(tmpObj)
          })
          this.compsTableData = []
          res.data.comps.forEach(element => {
            const tmpObj = { comID: element }
            this.compsTableData.push(tmpObj)
          })
          this.tabBarTableData = []
          res.data.tabbar.forEach(element => {
            const tmpObj = { comID: element }
            this.tabBarTableData.push(tmpObj)
          })
        }
      })
    },
    handleAddPublicComp() { // 添加公共组件
      this.addPublicCompsVisible = true
    },
    submitAdd() { // 提交文件
      this.$refs.publicCompsForm.validate((valid) => {
        if (valid) {
          this.uploadData.compType = this.formItem.publicCompsType
          this.$refs.PubComponentFromUpload.submit()
          this.getAllCompList()
          this.addPublicCompsVisible = false
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    goBack() {
      this.addPublicCompsVisible = false
    },
    handleDownloadComp(comID) { // 下载公共组件
      const token = getToken()
      // config.headers['Bl'] = '1'
      if (token) {
        $config.apiUrl.headers['Authorization'] = 'Bearer ' + token
      }
      axios({
        method: 'post',
        headers: $config.apiUrl.headers,
        url: '/pmobile/dynamic/comp/downloadPublicComp/' + comID,
        responseType: 'blob'
      }).then((response) => {
        var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', comID + '.zip')
        document.body.appendChild(link)
        link.click()
        // if (response.returnCode === '000000') {
        //   this.$message.success('')
        // }
      })
    },
    handleDeletePublicComp(item) { // 删除公共组件
      console.log(item, '%%%%%%%%%%%%%%')
      const params = {
        compName: item.comID
      }
      this.$confirm('确定删除该组件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePublicComp(params)
            .then((res) => {
              console.log(res)
              if (res.returnCode === '000000') {
                this.$message.success('删除成功!')
                this.getAllCompList()
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
    // handleManageFile(item) { // 管理文件
    //   const compName = item.comID
    //   // 存储comID
    //   this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', compName)
    //   this.showManageFile = true
    // },
    getSchema(row) { // 显示编辑schema弹框
      console.log(row, '1111111111111111111111111')
      // const compName = row.comID
      // 存储comID
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { compName: row.comID })
      this.showEditSchema = true
    },
    getSchemaConfig(row) { // 配置
      // const compName = row.comID
      // 存储comID
      this.$store.commit('dynamic/UPDATE_DYNAMIC_PAGE', { compName: row.comID })
      this.showSchemaConfig = true
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
</style>
