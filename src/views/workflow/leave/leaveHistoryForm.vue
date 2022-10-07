<template>
  <div>
    <div>
      <h2>请假人：{{ form.createName }}</h2>
      <el-form label-width="80px">
        <el-form-item label="请假类型">

          {{ form.type|typeFilter }}

        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="form.reason" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="form.leaveStartTime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="form.leaveEndTime" />
        </el-form-item>
      </el-form>
    </div>
    <div
      v-for="(historyData, index) in fromData"
      :key="index"
    >
      <h2>{{ historyData.taskNodeName }}</h2>
      <h3>审批人:{{ historyData.createName }}</h3>
      <h3>审批时间:{{ historyData.createdDate }}</h3>
      <el-form v-for="(fistoryFormData, indexH) in historyData.formHistoryDataDTO" :key="indexH" label-width="80px">
        <el-form-item :label="fistoryFormData.title">
          <el-input v-model="fistoryFormData.value" />
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-table :data="fromData" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
      <el-table-column prop="taskNodeName" label="节点名称" width="150" />
      <el-table-column prop="createName" label="审批人" width="150" />
      <el-table-column prop="createdDate" label="审批时间" width="150" />
      <el-table-column prop="mobile" label="手机号" width="150" />
      <el-table-column prop="status" label="状态" width="100" />
    </el-table> -->
  </div>
</template>

<script>
export default {
  name: 'LeaveHistoryForm',
  filters: {
    typeFilter(val) {
      let res = ''
      switch (val) {
        case '0':
          res = '年假'
          break
        case '1':
          res = '病假'
          break
        case '2':
          res = '事假'
          break
      }
      return res
    }
  },
  props: {
    businessKey: {
      type: String
    },
    leaveData: {
      type: Object
    },
    historyFromData: {
      type: Array
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      fromData: [],
      params: ''
    }
  },
  watch: {
    leaveData() {
      this.form = this.leaveData
    },
    historyFromData() {
      this.fromData = this.historyFromData
    }
  },
  created() {
    this.form = this.leaveData
    this.fromData = this.historyFromData
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
    }
  }

}
</script>

<style scoped>

</style>
