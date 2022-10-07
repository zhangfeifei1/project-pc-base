<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索模块 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="collapseInfo"
      size="small"
      class="demo-form-inline form-btn-box"
      label-width="70px"
    >
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="collapseInfo.userId" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="设备id" prop="deviceId">
        <el-input v-model="collapseInfo.deviceId" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select
          v-model="collapseInfo.deviceType"
          placeholder="请选择设备类型"
        >
          <el-option
            v-for="item in deviceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备版本" prop="deviceVersion">
        <el-input v-model="collapseInfo.deviceVersion" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="app包名" prop="appBundle">
        <el-input v-model="collapseInfo.appBundle" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="app版本" prop="appVersion">
        <el-input v-model="collapseInfo.appVersion" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="日志时间" prop="sortTime">
        <el-input v-model="collapseInfo.sortTime" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item style="margin-left:40px">
        <el-button type="default" @click="reset('searchForm')">重置</el-button>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 日志展示 -->
    <el-table
      :data="data"
      border
      :cell-style="cellstyle"
      :header-cell-style="rowClass"
      size="small"
    >
      <el-table-column prop="userId" label="用户id" width="150" />
      <el-table-column prop="deviceId" label="设备id" width="150" />
      <el-table-column prop="deviceType" label="设备类型" width="150" />
      <el-table-column prop="deviceVersion" label="设备版本" width="150" />
      <el-table-column prop="appBundle" label="app包名" width="150" />
      <el-table-column prop="appVersion" label="app版本" width="150" />
      <el-table-column prop="sortTime" label="日志时间" width="170" />
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleWitch(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination
        background
        :current-page="collapseInfo.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="collapseInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="collapseInfo.total"
        @size-change="handlePageSize"
        @current-change="handlePage"
      />
    </el-col>
    <!-- 查看弹框 -->
    <el-dialog title="崩溃日志" :visible.sync="collapseVisible" width="60%">
      <el-form
        ref="collapseLogForm"
        :model="collapseLogForm"
        label-width="120px"
        size="small"
      >
        <el-form-item label="用户id：">
          <el-input v-model="collapseLogForm.userId" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="设备id：">
          <el-input v-model="collapseLogForm.deviceId" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="设备类型：">
          <el-input v-model="collapseLogForm.deviceType" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="设备版本：">
          <el-input v-model="collapseLogForm.deviceVersion" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="app包名：">
          <el-input v-model="collapseLogForm.appBundle" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="app版本：">
          <el-input v-model="collapseLogForm.appVersion" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="日志内容：">
          <div style="max-height:500px;overflow:auto">
            <pre>{{ collapseLogForm.content }}</pre>
          </div>
          <!-- <pre>{{ collapseLogForm.content }}</pre> -->
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" size="small" style="margin-bottom:20px" @click="downloadContent">下载</el-button>

        <el-button type="primary" size="small" style="margin-bottom:20px" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { crashLogs, blockOneLog } from '@/api/monitoring'
import { download } from '../../dynamicIndex/pubComponentMgmt/filemanager/util'
export default {
  data() {
    return {
      collapseInfo: {
        userId: '',
        deviceId: '',
        deviceType: '',
        deviceVersion: '',
        appBundle: '',
        appVersion: '',
        sortTime: '',
        total: 0,
        page: 1,
        limit: 10
      },
      deviceTypeOptions: [
        { value: 'ios', label: 'ios' },
        { value: 'android', label: 'andriod' }
      ],
      data: [],
      collapseVisible: false,
      collapseLogForm: {
        userId: '',
        deviceId: '',
        deviceType: '',
        deviceVersion: '',
        appBundle: '',
        appVersion: '',
        content: ''
      }

    }
  },
  created() {
    // 获取崩溃日志列表
    this.getCollapseList()
  },
  mounted() {
  },
  methods: {
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
    },
    reset(form) {
      this.$refs[form].resetFields()
    },
    handlePageSize(pageSize) {
      this.collapseInfo.limit = pageSize
      this.handleSearch()
    },
    handlePage(pageNum) {
      this.collapseInfo.page = pageNum
      this.handleSearch()
    },
    getCollapseList() {
      const params = {
        pageNum: this.collapseInfo.page,
        pageSize: this.collapseInfo.limit,
        content: 'false'
      }
      crashLogs(params).then(res => {
        console.log(res, '*****崩溃日志列表**********')
        if (res.returnCode === '000000') {
          this.data = res.data.content
          this.collapseInfo.total = res.data.totalElements * 1
        }
      })
    },
    handleSearch() { // 查询
      const params = {
        userId: this.collapseInfo.userId,
        deviceId: this.collapseInfo.deviceId,
        deviceType: this.collapseInfo.deviceType,
        deviceVersion: this.collapseInfo.deviceVersion,
        appBundle: this.collapseInfo.appBundle,
        appVersion: this.collapseInfo.appVersion,
        sortTime: this.collapseInfo.sortTime,
        pageNum: this.collapseInfo.page,
        pageSize: this.collapseInfo.limit,
        content: 'false'
      }
      crashLogs(params).then(res => {
        this.data = res.data.content
        this.collapseInfo.total = res.data.totalElements * 1
      })
    },
    handleWitch(val) {
      this.collapseVisible = true
      const params = {
        collectionName: 'CrashLog',
        objectId: val.objectId
      }
      blockOneLog(params).then(res => {
        if (res.returnCode === '000000') {
          this.collapseLogForm.userId = res.data.userId
          this.collapseLogForm.deviceId = res.data.deviceId
          this.collapseLogForm.deviceType = res.data.deviceType
          this.collapseLogForm.deviceVersion = res.data.deviceVersion
          this.collapseLogForm.appBundle = res.data.appBundle
          this.collapseLogForm.appVersion = res.data.appVersion

          this.collapseLogForm.content = res.data.content
        }
      })
      // this.collapseLogForm = JSON.parse(JSON.stringify(val, null, 4))
    },
    submit() {
      this.collapseVisible = false
    },
    downloadContent() {
      var url = window.URL.createObjectURL(new Blob([this.collapseLogForm.content], { type: 'application/text' }))
      var link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'log.log')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>
<style lang="less">
    // .bg{
    //     margin: 20px;
    //     background: #ffffff;
    // }
    // .search{
    //     padding: 20px;
    //     border-bottom: 1px solid #eeeeee;
    // }
    // .listHead{
    //     position: relative;
    //     background: #fcfcfc;
    //     border-bottom: 1px solid #eeeeee;
    //     height: 50px;
    //     padding-left: 3px;
    //     .right{
    //         height: 18px;
    //         position: absolute;
    //         right: 0;
    //         top: 0;
    //     }
    // }
    // .blacktext{
    //     float: left;
    //     color:#333333;
    //     font-size: 13px;
    //     line-height: 15px;
    //     padding: 17px;
    // }
    // .text{
    //     margin: auto;
    //     color:#808080;
    //     font-size: 13px;
    //     line-height: 15px;
    // }
    // .button{
    //     float: left;
    //     width: fit-content;
    //     padding: 10px 20px;
    //     color:#333333;
    //     font-size: 13px;
    //     line-height: 15px;
    //     background: #ffffff;
    //     border: 1px solid #eeeeee;
    //     margin-top: 6px;
    // }
    // .show{
    //     display: flex;
    //     height: 600px;
    // }
</style>
