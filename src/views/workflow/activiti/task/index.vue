<template>
  <div class="app-container">

    <el-table
      v-loading="loading"
      :data="tastList"
      :cell-style="cellstyle"
      :header-cell-style="rowClass"
    >
      <!--      <el-table-column label="流程ID" align="center" prop="id"/>-->
      <el-table-column label="流程名称" align="center" prop="instanceName" />
      <el-table-column label="任务节点名称" align="center" prop="name" />
      <el-table-column label="任务状态" align="center" prop="status" />
      <el-table-column label="办理人" align="center" prop="assignee" />
      <el-table-column label="创建时间" align="center" prop="createdDate" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="examineAndApprove (scope.row)"
          >审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 审批对话框 -->
    <el-dialog v-if="open" :title="title" :visible.sync="open" width="500px" append-to-body>
      <leaveHistoryForm v-if="'leave'==definitionKey" :business-key="businessKey" :leave-data="leaveData" :history-from-data="historyFromData" />

      <el-form ref="form" :model="form" label-width="100px" class="demo-dynamic">
        <el-form-item
          v-for="(domain, index) in form.formData"
          :key="index"
          :label="domain.controlLable"
        >
          <el-radio-group v-if="'radio'==domain.controlType" v-model="domain.controlValue">
            <el-radio
              v-for="(defaults,indexd) in domain.controlDefault.split('--__--')"
              :key="indexd"
              :label="indexd"
            >{{ defaults }}

            </el-radio>

          </el-radio-group>
          <el-select v-if="'select'==domain.controlType" v-model="domain.controlValue">
            <el-option
              v-for="(defaults,indexd) in domain.controlDefault"
              :key="indexd"
              :label="defaults.branchName"
              :value="defaults.branchCode"
            />

          </el-select>
          <el-input
            v-if="'textarea'==domain.controlType"
            v-model="domain.controlValue"
            type="textarea"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { listTask, formDataShow, formDataSave } from '@/api/activiti/task'
import leaveHistoryForm from '@/views/workflow/leave/leaveHistoryForm'

export default {
  name: 'Leave',
  components: { leaveHistoryForm },
  data() {
    return {
      leaveData: {},
      historyFromData: [],
      id: '',
      definitionKey: '',
      businessKey: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 请假表格数据
      tastList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {
        formData: []
      },
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询请假列表 */
    getList() {
      this.loading = true
      listTask(this.queryParams).then(response => {
        // debugger
        this.tastList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.definitionKey = ''
      this.businessKey = ''
      this.form = {
        formData: []
      }
      // this.resetForm('form')
    },

    /** 审批按钮操作 */
    examineAndApprove(row) {
      console.log(row)
      this.reset()
      this.definitionKey = row.definitionKey
      this.businessKey = row.businessKey
      this.id = row.id
      var params = {
        taskId: row.id,
        businessKey: row.businessKey
      }
      formDataShow(params).then(response => {
        this.leaveData = response.data.authData
        this.historyFromData = response.data.historyInfo.historyInfo
        // FormProperty_3qipis2--__!!radio--__!!审批意见--__!!i--__!!同意--__--不同意
        // FormProperty_0lffpcm--__!!textarea--__!!批注--__!!f--__!!null
        const datas = response.data.auditInfo.props
        const formData = []
        for (let i = 0; i < datas.length; i++) {
          const strings = datas[i].split('--__!!')
          let controlValue = null
          let controlDefault = null
          switch (strings[1]) {
            case 'radio':
              controlValue = 0
              controlDefault = strings[4]
              break
            case 'select':
              controlValue = ''
              controlDefault = JSON.parse(strings[4])
              break
          }
          formData.push({
            controlId: strings[0],
            controlType: strings[1],
            controlLable: strings[2],
            controlIsParam: strings[3],
            controlValue: controlValue,
            controlDefault: controlDefault
          })
        }
        this.form.formData = formData
        this.open = true
        this.title = '审批'
      })
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
    },
    /** 提交按钮 */
    submitForm() {
      var params = {
        taskID: this.id,
        props: this.form.formData,
        businessKey: this.businessKey
      }
      formDataSave(params).then(response => {
        this.$message.success('审批成功')
        this.open = false
        this.getList()
      })
    }
  }
}
</script>
