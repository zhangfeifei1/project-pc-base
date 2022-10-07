<template>
  <div class="app-container wrapper">
    <el-row class="margin-b20">
      <el-button
        type="primary"
        class="el-icon-plus"
        size="small"
        @click="handleAddGroupClick()"
      >添加白名单</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-style="cellstyle"
        :header-cell-style="rowClass"
        size="small"
      >
        <el-table-column label="白名单名称" prop="groupName" />
        <el-table-column label="白名单ID" prop="groupId" />
        <el-table-column label="白名单类型">
          <template slot-scope="props">{{ props.row.type | typeFilter }}</template>
        </el-table-column>
        <el-table-column label="白名单数量" prop="userCount" />
        <el-table-column label="操作">
          <template slot-scope="props">
            <a
              type="primary"
              :underline="false"
              @click="handleDeleteClick(props.row)"
            >删除</a>
            <a type="primary" :underline="false" @click="handleAddClick(props.row)">添加</a>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
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
    </el-row>

    <!-- 增加加白名单用户 -->
    <el-dialog
      title="添加白名单用户"
      :visible.sync="whiteListdialogVisiable"
      :before-close="handleWhiteListClose"
      width="30%"
      top="150px"
      class="add-white-wrapper"
    >
      <el-form :model="groupForm" :rules="groupFormRules" label-width="120px" size="small">
        <el-form-item label="userId列表：" prop="id" required>
          <el-input
            v-model="userList"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            style="width:220px"
          /><br>
          <font
            class="_tip"
          >可输入多个userId，使用英文(半角)逗号或换行分隔，同时输入userId和上传文件的时候，只有输入的userId生效。userId列表白名单的最大数量为10万。</font>
        </el-form-item>
        <el-form-item label="白名单文件：" prop="name" required>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="/pmobile/diffpackage/zipdiffwhitelist/save"
            accept=".txt"
            :headers="headersToken"
            :file-list="fileList"
            :data="uploadData"
            :auto-upload="false"
            :on-change="handleChangeFile"
            :on-success="uploadSuccessCallback"
            :on-error="uploadErrorCallback"
            :on-remove="handleRemoveFile"
          >
            <el-button slot="trigger" size="small" class="el-icon-upload2">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">名称后缀为txt的文本文件，每行一条记录，最大为5兆，每次倒入最大数量为10万</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- <div class="add-white-cont">
        <el-row class="add-white-line">
          <div class="add-white_lebel">userId列表：</div>
          <div class="add-white_cont">
            <el-input
              v-model="userList"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              style="width:220px"
            />
            <font
              class="_tip"
            >可输入多个userId，使用英文(半角)逗号或换行分隔，同时输入userId和上传文件的时候，只有输入的userId生效。userId列表白名单的最大数量为10万。</font>
          </div>
        </el-row>
        <el-row class="add-white-line">
          <div class="add-white_lebel">白名单文件：</div>
          <el-col class="add-white_cont">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="/pmobile/diffpackage/zipdiffwhitelist/save"
              accept=".txt"
              :headers="headersToken"
              :file-list="fileList"
              :data="uploadData"
              :auto-upload="false"
              :on-change="handleChangeFile"
              :on-success="uploadSuccessCallback"
              :on-error="uploadErrorCallback"
              :on-remove="handleRemoveFile"
            >
              <el-button slot="trigger" size="small" class="el-icon-upload2">选择文件</el-button>
              <div slot="tip" class="el-upload__tip">名称后缀为txt的文本文件，每行一条记录，最大为5兆，每次倒入最大数量为10万</div>
            </el-upload>
          </el-col>
        </el-row>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleWhiteListClose()">取 消</el-button>
        <el-button type="primary" size="small" @click="handleWhiteListSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加白名单组  -->
    <el-dialog
      title="添加白名单组"
      :visible.sync="groupDialogVisiable"
      :before-close="handleGroupClose"
      width="30%"
      top="200px"
      class="add-white-wrapper"
    >
      <el-form ref="groupForm" :model="groupForm" :rules="groupFormRules" label-width="140px" size="small">
        <el-form-item label="白名单组id：" prop="id" required>
          <el-input v-model="groupForm.id" style="width:220px" />
        </el-form-item>
        <el-form-item label="白名单组名称：" prop="name" required>
          <el-input v-model="groupForm.name" style="width:220px" />
        </el-form-item>
        <el-form-item label="白名单组类型：" prop="type" required>
          <el-select v-model="groupForm.type" placeholder="请选择" style="width:220px" @change="selectChange">
            <el-option label="普通组" value="0" />
            <el-option label="正则组" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowRegExp" label="请输入正则表：" prop="regExp" required>
          <el-input v-model="groupForm.regExp" style="width:220px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleGroupClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleGroupSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Loading
} from 'element-ui'
var loadingInstance = ''
import {
  getWhiteGroup,
  addWhiteGroup,
  deleteWhiteGroup,
  addWhiteList
} from '@/api/whiteListMgt'
import { getToken } from '@/utils/util'
export default {
  filters: {
    typeFilter(data) {
      if (data === '0') {
        return '普通组'
      } else if (data === '1') {
        return '正则组'
      }
    }
  },
  data() {
    const validateNull = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('输入值不能为空'))
      } else {
        callback()
      }
    }
    const validateGroupId = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('白名单组id不能为空'))
      } else if (/^[0-9]*$ /.test(value) || value.trim().length !== 6) {
        return callback(new Error('请数组6位数字组成的字符'))
      } else {
        callback()
      }
    }
    const validateGroupName = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('白名单组名称不能为空'))
      } else {
        callback()
      }
    }
    const validateType = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请选择白名单组类型'))
      } else {
        callback()
      }
    }
    return {
      headersToken: {},
      groupForm: {
        id: '',
        name: '',
        type: '',
        regExp: ''
      },
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      fileList: [],
      groupDialogVisiable: false,
      isShowRegExp: false,
      whiteListdialogVisiable: false,
      userList: '', // userId列表
      tableData: [], // 表单数据
      selectedGroupId: '',
      uploadData: {}, // 白名单数据
      groupFormRules: {
        id: [{ required: true, validator: validateGroupId, trigger: 'blur' }],
        name: [{ required: true, validator: validateGroupName, trigger: 'blur' }],
        type: [{ required: true, validator: validateType, trigger: 'blur' }],
        regExp: [{ required: true, validator: validateNull, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.queryWhiteGroup()
    const token1 = getToken()
    this.headersToken = {
      'Authorization': 'Bearer ' + token1,
      'appid': '1552274783265'
    }
  },
  methods: {
    // 白名单查询
    queryWhiteGroup() {
      const params = {
        size: this.pageInfo.limit,
        current: this.pageInfo.page
      }
      getWhiteGroup(params)
        .then(res => {
          this.tableData = res.data.records
          this.pageInfo.total = parseInt(res.data.total)
        })
        .finally(() => {})
    },
    // 白名单类型切换
    selectChange(value) {
      if (value === '0') {
        this.isShowRegExp = false
        this.groupForm.regExp = ''
      } else {
        this.isShowRegExp = true
      }
    },
    // 添加白名单
    handleAddGroupClick() {
      this.groupDialogVisiable = true
    },
    // 提交白名单组
    handleGroupSubmit() {
      this.$refs['groupForm'].validate(valid => {
        if (valid) {
          const params = {
            groupId: this.groupForm.id.trim(),
            groupName: this.groupForm.name,
            type: this.groupForm.type,
            regExp: this.groupForm.regExp
          }
          addWhiteGroup(params)
            .then(res => {
              // debugger
              if (res.code === 0) {
                this.groupDialogVisiable = false
                this.isShowRegExp = false
                this.$refs['groupForm'].resetFields()
                this.queryWhiteGroup()
                this.$message({
                  type: 'success',
                  message: '新建成功！'
                })
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => {})
        }
      })
    },
    // 关闭白名单组
    handleGroupClose() {
      this.groupDialogVisiable = false
      this.isShowRegExp = false
      this.$refs['groupForm'].resetFields()
    },
    // 白名单组删除
    handleDeleteClick(data) {
      this.$confirm('确认删除本条数据？')
        .then(_ => {
          const params = {
            id: data.id,
            groupId: data.groupId,
            type: data.type
          }
          deleteWhiteGroup(params)
            .then(res => {
              this.queryWhiteGroup()
            })
            .finally(() => {})
        })
        .catch(_ => {})
    },
    // 增加白名单用户
    handleAddClick(data) {
      this.whiteListdialogVisiable = true
      this.selectedGroupId = data.groupId
      this.userList = ''
      this.uploadData = {}
    },
    // 提交白名单用户
    handleWhiteListSubmit() {
      this.uploadData.groupId = this.selectedGroupId
      // debugger
      if (this.userList.trim() !== '') {
        // 识别textarea中的换行  将其转换为,
        this.uploadData.userList = this.userList.replace(/\n/g, ',')
      }
      this.$confirm('确认提交吗？')
        .then(_ => {
          if (this.fileList.length !== 0) {
            // 打开遮罩
            loadingInstance = Loading.service({
              text: '数据加载中'
            })
            this.$refs.upload.submit()
          } else if (this.userList.trim() !== '') {
            addWhiteList(this.uploadData).then(res => {
              this.whiteListdialogVisiable = false
              this.userList = ''
              this.$refs.upload.clearFiles()
              this.fileList = []
              this.queryWhiteGroup()
            }).finally({})
          } else {
            this.$message({
              message: '请输入userId或上传文件',
              type: 'error'
            })
          }
        })
        .catch(_ => {})
    },
    // 关闭白名单用户
    handleWhiteListClose() {
      this.whiteListdialogVisiable = false
      this.userList = ''
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    // 上传成功后回调
    uploadSuccessCallback(response, file, fileList) {
      // 关闭遮罩
      loadingInstance.close()
      this.$refs.upload.clearFiles()
      this.fileList = []
      response = JSON.parse(response.response)
      if (response.returnCode === '000000') {
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
        this.userList = ''
        this.whiteListdialogVisiable = false
        this.queryWhiteGroup()
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
    },
    // 上传失败后回调
    uploadErrorCallback(err, file, fileList) {
      // 关闭遮罩
      loadingInstance.close()
      this.$refs.upload.clearFiles()
      this.fileList = []
      this.$message({
        message: '上传失败！',
        type: 'error'
      })
      console.log('err:' + JSON.stringify(err))
    },
    // 选择文件
    handleChangeFile(file, fileList) {
      // debugger
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.fileList = []
      } else {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    // 移除文件时调用
    handleRemoveFile(file, fileList) {
      this.fileList = []
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.queryWhiteGroup()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.queryWhiteGroup()
    },
    /**
       * @description 设置el-table内容居中
       */
    cellstyle() {
      return 'padding-left: 10px;padding-right: 10px;'
    },
    /**
       * @description 设置el-table表头居中
       */
    rowClass() {
      return 'background:#ffffff;color:#515a6e;padding-left: 10px;padding-right: 10px;'
    }
  }
}
</script>>

<style lang="scss" scoped>
.wrapper {
  .margin-b20 {
    margin-bottom: 20px;
  }
  // .add-white-line {
  //   display: flex;
  //   margin-bottom: 20px;
  //   .add-white_label {
  //     width: 120px;
  //   }
  //   .add-white_cont {
  //     flex: 1;
  //     font {
  //       font-size: 12px;
  //       color: #606266;
  //       margin-top: 7px;
  //       display: inline-block;
  //     }
  //   }
  // }
}
._tip{
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
</style>
