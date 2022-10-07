<template>
  <div>
    <div class="main">
      <el-card>
        <el-button type="primary" size="small" style="margin-bottom:20px" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="small" @click="handleUploadLog">上传日志配置</el-button>
        <el-table
          :data="tableData"
          style="width:100%"
          border
          :cell-style="cellstyle"
          :header-cell-style="rowClass"
          size="small"
        >
          <el-table-column prop="id" label="任务ID" width="180" />
          <el-table-column prop="userId" label="用户ID" width="110" />
          <el-table-column prop="ruleDesc" label="描述" width="150" />
          <el-table-column prop="systemType" label="平台" width="90" :formatter="platFormat" />
          <el-table-column prop="collectMethod" label="触发通道" width="180" :formatter="pullwayFormat" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="status" label="状态" width="180" :formatter="statusFormat" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleTrigger(scope.row)">触发</el-button>
              <el-button :disabled="scope.row.status != 3 ?true:false" type="text" size="small" @click="handleDownload(scope.row)">下载</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination
            background
            :current-page="logPull.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="logPull.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="logPull.total"
            @size-change="handleLogPullSize"
            @current-change="handleLogPullPage"
          />
        </el-col>
      </el-card>
    </div>
    <!-- 添加日志弹框 -->
    <el-dialog title="添加日志" :visible.sync="modalVisible" width="50%">
      <el-form ref="formItem" :model="formItem" :rules="addLogRules" label-width="200px">
        <el-form-item label="用户ID：" prop="userId">
          <el-input v-model="formItem.userId" placeholder="请输入用户Id" style="width:350px" size="small" />
        </el-form-item>
        <el-form-item label="规则描述：" prop="describe">
          <el-input v-model="formItem.describe" placeholder="请输入规则描述" style="width:350px" size="small" />
        </el-form-item>
        <el-form-item label="平台：" prop="plat">
          <el-radio-group v-model="formItem.plat">
            <el-radio :label="1">ios</el-radio>
            <el-radio :label="2">Android</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间段：" prop="rangeTime">
          <el-date-picker
            v-model="formItem.rangeTime"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholde="开始日期"
            end-placeholde="结束日期"
            value-format="yyyyMMdd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="上报网络环境：" prop="netWork">
          <el-radio-group v-model="formItem.netWork">
            <el-radio :label="1">Wi-Fi</el-radio>
            <el-radio :label="2">移动网络</el-radio>
            <el-radio :label="3">都可以</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button size="small" style="margin-bottom:20px" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 上传日志配置弹框 -->
    <el-dialog title="上传日志配置" :visible.sync="uploadLogVisible" width="60%">
      <el-form ref="uploadLogForm" :model="uploadLogForm" :rules="uploadLogRules" label-width="130px">
        <el-form-item label="上传卡顿日志" prop="UPApmLog">
          <el-switch v-model="uploadLogForm.UPApmLog" active-value="true" inactive-value="false" />
        </el-form-item>
        <el-form-item label="上传崩溃日志" prop="UPCrashLog">
          <el-switch v-model="uploadLogForm.UPCrashLog" active-value="true" inactive-value="false" />
        </el-form-item>
        <el-form-item label="上传错误日志" prop="UPJsErrorLog">
          <el-switch v-model="uploadLogForm.UPJsErrorLog" active-value="true" inactive-value="false" />
        </el-form-item>
        <el-form-item label="保存天数：" prop="saveDays">
          <el-input v-model="uploadLogForm.saveDays" placeholder="请输入保存天数" style="width:350px" />
        </el-form-item>
        <el-form-item label="保存类型：" prop="saveType">
          <el-input v-model="uploadLogForm.saveType" placeholder="请输入保存类型" style="width:350px" />
        </el-form-item>
        <el-form-item label="时间戳：" prop="timestampFormat">
          <el-input v-model="uploadLogForm.timestampFormat" style="width:350px" />
        </el-form-item>
        <el-form-item label="上传格式：" prop="uploadFormat">
          <el-select v-model="uploadLogForm.uploadFormat" placeholder="请选择上传日志格式">
            <el-option
              v-for="item in uploadFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="写入消息日志：" prop="writeBusinessLog">
          <el-input v-model="uploadLogForm.writeBusinessLog" placeholder="请输入消息日志" style="width:350px" />
        </el-form-item>
        <el-form-item label="写入格式：" prop="writeFormat">
          <el-select v-model="uploadLogForm.writeFormat" placeholder="请选择写入格式">
            <el-option
              v-for="item in writeFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="写入SDK日志：" prop="writeSDKLog">
          <el-input v-model="uploadLogForm.writeSDKLog" placeholder="请输入SDK日志" style="width:350px" />
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button size="small" style="margin-bottom:20px" @click="goBack">返回</el-button>
        <el-button type="primary" size="small" @click="submitLog">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/util'
import $config from '@/settings/defaultSetting'
import axios from 'axios'
import { getPageList, pull, deleteLog, addLogList,
  getLogConfig, // 上传日志配置中查日志配置列表
  updateLogConfig // 修改日志配置列表
} from '@/api/monitoring'
export default {
  data() {
    const validateSix = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('数据内容不能为空'))
      } else if (value.trim().length < 6) {
        return callback(new Error('请至少输入6个字符'))
      } else {
        callback()
      }
    }
    return {
      tableData: [
        {
          id: '',
          userId: '',
          ruleDesc: '',
          systemType: '',
          collectMethod: '',
          createTime: '',
          status: ''
        }
      ],
      logPull: {
        total: 0,
        page: 1,
        limit: 10
      },
      modalVisible: false,
      rules: {

      },
      formItem: {
        userId: '',
        describe: '',
        plat: '',
        rangeTime: '',
        logType: '',
        netWork: ''
      },
      addLogRules: {
        userId: [
          { required: true,
            validator: validateSix,
            trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ],
        plat: [
          { required: true, message: '请选择平台', trigger: 'change' }
        ],
        rangeTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        netWork: [
          { required: true, message: '请选择上报网络环境', trigger: 'change' }
        ]
      },
      uploadLogRules: {
        UPApmLog: [
          { required: true, message: '请选择是否上传卡顿日志', trigger: 'change' }
        ],
        UPCrashLog: [
          { required: true, message: '请选择是否上传崩溃日志', trigger: 'change' }
        ],
        UPJsErrorLog: [
          { required: true, message: '请选择是否上传错误日志', trigger: 'change' }
        ],
        saveDays: [
          { required: true, message: '保存天数不能为空', trigger: 'blur' }
        ],
        saveType: [
          { required: true, message: '保存类型不能为空', trigger: 'blur' }
        ],
        timestampFormat: [
          { required: true, message: '时间不能为空', trigger: 'blur' }
        ],
        uploadFormat: [
          { required: true, message: '上传日志的格式不能为空', trigger: 'change' }
        ],
        writeBusinessLog: [
          { required: true, message: '上传消息日志不能为空', trigger: 'blur' }
        ],
        writeFormat: [
          { required: true, message: '写入格式不能为空', trigger: 'change' }
        ],
        writeSDKLog: [
          { required: true, message: 'SDK日志不能为空', trigger: 'blur' }
        ]

      },
      uploadFormatOptions: [{ key: 'json', value: 'json' }, { key: 'file', value: 'file' }],
      writeFormatOptions: [{ key: 'file', value: 'file' }, { key: 'DB', value: 'DB' }],
      uploadLogForm: {
        UPApmLog: 'false',
        UPCrashLog: 'false',
        UPJsErrorLog: 'false',
        saveDays: '',
        saveType: '',
        timestampFormat: '',
        uploadFormat: '',
        writeBusinessLog: '',
        writeFormat: '',
        writeSDKLog: ''
      },

      uploadLogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted() {
    this.getUploadlogList() // 查上传日志配置
  },
  created() {
    // 获取分页列表
    this.getLogPullList()
  },
  methods: {
    handleLogPullPage(current) {
      this.logPull.page = current
      this.getLogPullList()
    },
    handleLogPullSize(size) {
      this.logPull.limit = size
      this.getLogPullList()
    },
    getLogPullList() {
      // 日志拉取分页列表
      const params = {
        current: this.logPull.page,
        size: this.logPull.limit
      }
      getPageList(params)
        .then((res) => {
          console.log(res, '日志拉取列表')
          if (res.returnCode === '000000') {
            this.tableData = res.data.records
            this.logPull.total = res.data.total * 1
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    handleUploadLog() { // 上传日志配置
      this.uploadLogVisible = true
    },
    getUploadlogList() {
      getLogConfig().then(res => {
        if (res.returnCode === '000000') {
          console.log(res, '上传日志配置')
          this.uploadLogForm = res.data
        }
      })
    },
    platFormat(data) {
      if (data.systemType != null && data.systemType !== '' && data.systemType === 1) {
        return 'ios'
      } else if (
        data.systemType != null &&
        data.systemType !== '' &&
        data.systemType === 2
      ) {
        return 'android'
      }
    },
    statusFormat(data) {
      if (data.status != null && data.status === 0) {
        return '初始化'
      } else if (data.status != null && data.status === 1) {
        return '已发送设备消息'
      } else if (data.status != null && data.status === 2) {
        return '日志未上报，回执成功'
      } else if (data.status != null && data.status === 3) {
        return '上送日志'
      }
    },
    pullwayFormat(data) {
      if (data.collectMethod === 0) {
        return '通过移动同步触发'
      }
    },
    handleTrigger(item) { // 触发
      const params = {
        userId: item.userId,
        syncId: item.syncId,
        id: item.id,
        timeSlot: item.timeSlot,
        status: item.status
      }
      pull(params).then((res) => {
        if (res.returnCode === '000000') {
          this.$message.success('触发成功')
        }
      })
    },
    handleDownload(item) { // 下载日志
    //  url: '/pmobile//behavior/logsFile/download?filePath=' + item.logFilePath,
      console.log(item, '11111111111111')
      // const token = getToken()
      // // config.headers['Bl'] = '1'
      // if (token) {
      //   $config.apiUrl.headers['Authorization'] = 'Bearer ' + token
      // }
      // axios({
      //   method: 'post',
      //   headers: $config.apiUrl.headers,
      //   url: '/pmobile//behavior/logsFile/download?filePath=' + item.logFilePath,
      //   responseType: 'blob'
      // }).then((response) => {
      //   var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
      //   var link = document.createElement('a')
      //   link.style.display = 'none'
      //   link.href = url
      //   link.setAttribute('download', 'Log.zip')
      //   document.body.appendChild(link)
      //   link.click()
      // })
      const token = getToken()
      // config.headers['Bl'] = '1'
      if (token) {
        $config.apiUrl.headers['Authorization'] = 'Bearer ' + token
      }
      axios({
        method: 'post',
        headers: $config.apiUrl.headers,
        url: '/pmobile//behavior/logsFile/download?filePath=' + item.logFilePath,
        responseType: 'blob'
        // url: '/pmobile//behavior/logsFile/download',
        // data: 'request=' + encodeURIComponent(JSON.stringify({ filePath: item.logFilePath }))

      }).then((response) => {
        var url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'Log.zip')
        document.body.appendChild(link)
        link.click()
      })
    },
    handleDelete(item) { // 删除
      const params = {
        id: item.id
      }
      deleteLog(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('删除成功')
          this.getLogPullList()
        }
      })
    },
    handleAdd() { // 添加
      this.modalVisible = true
    },
    submit() { // 确定
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          const params = {
            userId: this.formItem.userId,
            ruleDesc: this.formItem.describe,
            systemType: this.formItem.plat,
            timeSlot: this.formItem.rangeTime[0] + '-' + this.formItem.rangeTime[1],
            netType: this.formItem.netWork
          }
          console.log(params, 11111111111)
          addLogList(params).then(res => {
            if (res.returnCode === '000000') {
              this.$message.success('添加成功')
              this.formItem = {}
              this.getLogPullList()
              this.modalVisible = false
            }
          })
        }
      })
    },
    submitLog() {
      this.$refs['uploadLogForm'].validate((valid) => {
        if (valid) {
          updateLogConfig(this.uploadLogForm).then(res => {
            if (res.returnCode === '000000') {
              this.$message.success('修改成功')
            }
          })
          this.uploadLogVisible = false
        }
      })
    },
    goBack() {
      this.uploadLogVisible = false
    },
    handleResetForm() {
      this.$refs['uploadLogForm'].resetFields()
    },
    cancel() { // 取消
      this.modalVisible = false
    },
    cancelLog() { // 上传日志取消
      this.uploadLogVisible = false
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
</script>
<style lang="scss" scoped>
.title{
  p {
    color:#606266;
    font-size: 24px;
    margin-left: 20px;
  }
}
</style>
