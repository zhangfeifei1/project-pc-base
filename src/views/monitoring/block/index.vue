<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索模块 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="blockInfo"
      size="small"
      class="demo-form-inline form-btn-box"
      label-width="70px"
    >
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="blockInfo.userId" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="设备id" prop="deviceId">
        <el-input v-model="blockInfo.deviceId" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="blockInfo.deviceType" placeholder="请选择设备类型">
          <el-option
            v-for="item in deviceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备版本" prop="deviceVersion">
        <el-input v-model="blockInfo.deviceVersion" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="app包名" prop="appBundle">
        <el-input v-model="blockInfo.appBundle" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="app版本" prop="appVersion">
        <el-input v-model="blockInfo.appVersion" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item label="日志时间" prop="sortTime">
        <el-input v-model="blockInfo.sortTime" placeholder="请输入关键字" clearable />
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
        :current-page="blockInfo.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="blockInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="blockInfo.total"
        @size-change="handlePageSize"
        @current-change="handlePage"
      />
    </el-col>
    <!-- 查看弹框 -->
    <el-dialog title="卡顿日志报表" :visible.sync="blockVisible" width="60%">
      <el-form ref="blockLogForm" :model="blockLogForm" label-width="120px" size="small">
        <el-form-item label="用户id：">
          <el-input v-model="blockLogForm.userId" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="设备id：">
          <el-input v-model="blockLogForm.deviceId" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="设备类型：">
          <el-input v-model="blockLogForm.deviceType" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="设备版本：">
          <el-input v-model="blockLogForm.deviceVersion" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="app包名：">
          <el-input v-model="blockLogForm.appBundle" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="app版本：">
          <el-input v-model="blockLogForm.appVersion" style="width:500px" disabled />
        </el-form-item>
        <el-form-item label="日志内容：">
          <div style="max-height:500px;overflow:auto">
            <pre>{{ blockLogForm.content }}</pre>
          </div>
          <!-- <el-input v-model="blockLogForm.content" type="textarea" :rows="15" style="width:500px" disabled /> -->
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
import { blockLogsList, blockOneLog } from '@/api/monitoring'
export default {
  data() {
    return {
      blockInfo: {
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
      blockVisible: false,
      blockLogForm: {
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
    this.getBlockList()
  },
  mounted() {},
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
      this.blockInfo.limit = pageSize
      this.handleSearch()
    },
    handlePage(pageNum) {
      this.blockInfo.page = pageNum
      this.handleSearch()
    },
    getBlockList() {
      const params = {
        pageNum: this.blockInfo.page,
        pageSize: this.blockInfo.limit,
        content: 'false'
      }
      blockLogsList(params).then((res) => {
        console.log(res, '*****卡顿日志列表**********')
        if (res.returnCode === '000000') {
          this.data = res.data.content
          this.blockInfo.total = res.data.totalElements * 1
        }
      })
    },
    handleSearch() {
      const params = {
        userId: this.blockInfo.userId,
        deviceId: this.blockInfo.deviceId,
        deviceType: this.blockInfo.deviceType,
        deviceVersion: this.blockInfo.deviceVersion,
        appBundle: this.blockInfo.appBundle,
        appVersion: this.blockInfo.appVersion,
        sortTime: this.blockInfo.sortTime,
        pageNum: this.blockInfo.page,
        pageSize: this.blockInfo.limit,
        content: 'false'
      }
      blockLogsList(params).then((res) => {
        this.data = res.data.content
        this.blockInfo.total = res.data.totalElements * 1
      })
    },
    handleWitch(val) {
      this.blockVisible = true
      const params = {
        collectionName: 'ApmLog',
        objectId: val.objectId
      }
      blockOneLog(params).then(res => {
        console.log(res, '卡顿查看111111111111111')
        if (res.returnCode === '000000') {
          this.blockLogForm.userId = res.data.userId
          this.blockLogForm.deviceId = res.data.deviceId
          this.blockLogForm.deviceType = res.data.deviceType
          this.blockLogForm.deviceVersion = res.data.deviceVersion
          this.blockLogForm.appBundle = res.data.appBundle
          this.blockLogForm.appVersion = res.data.appVersion
          this.blockLogForm.content = JSON.stringify(res.data.content, null, 4)
        }
      })
      // var temp = JSON.parse(JSON.stringify(val, null, 4))
      // temp['content'] = JSON.stringify(temp['content'], null, 4)
      // this.blockLogForm = temp
    },
    submit() {
      this.blockVisible = false
    },
    downloadContent() {
      var url = window.URL.createObjectURL(new Blob([this.blockLogForm.content], { type: 'application/text' }))
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
