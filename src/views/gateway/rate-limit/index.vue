<template>
  <div>
    <el-card shadow="always">
      <div class="search-con search-con-top">
        <el-form
          ref="searchForm"
          :model="pageInfo"
          :inline="true"
          label-width="80px"
          size="small"
          class="demo-form-inline form-btn-box"
          style="width:100%"
        >
          <el-form-item>
            <el-button class="search-btn" type="primary" @click="handleModal()">
              <span>添加</span>
            </el-button>
          </el-form-item>
        </el-form>

      </div>
      <el-table border :data="data" :loading="loading" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <el-table-column prop="policyName" label="策略名称" width="200" />
        <el-table-column prop="intervalUnit" label="单位时间" width="150" />
        <el-table-column prop="totalLimitQuota" label="API流量控制" width="180" />
        <el-table-column prop="ipLimitQuota" label="IP流量控制" width="180" />
        <el-table-column prop="cookieLimitQuota" label="会话流量控制" width="180" />
        <el-table-column prop="headerLimitKvc" label="Header自定义流量控制" width="200" />
        <el-table-column prop="paramLimitKvc" label="请求自定义流量控制" width="200" />
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" @click="handleModal(scope.row)">
              编辑</a>&nbsp;
            <a class="linkfont" @click="handleRemove(scope.row)">
              删除
            </a>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>
    <el-dialog :visible.sync="modalVisible" :title="modalTitle" width="80%" top="20px" @on-cancel="handleReset">
      <div>
        <el-tabs v-model="current" @tab-click="handleTabClick">
          <el-tab-pane label="策略信息" name="form1" style="margin-left:40px">
            <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="150px" size="small">
              <el-form-item label="策略名称：" prop="policyName">
                <el-input v-model="formItem.policyName" placeholder="请输入内容" style="width:500px" />
              </el-form-item>
              <el-form-item label="单位时间：" prop="intervalUnit">
                <el-select v-model="formItem.intervalUnit">
                  <el-option value="seconds" label="秒(seconds)" />
                  <el-option value="minutes" label="分钟(minutes)" />
                  <el-option value="hours" label="小时(hours)" />
                  <el-option value="days" label="天(days)" />
                </el-select>
              </el-form-item>
              <el-form-item label="API流量控制：" prop="totalLimitQuota">
                <el-input-number v-model="formItem.totalLimitQuota" />(次数)
              </el-form-item>
              <el-form-item label="IP流量控制：" prop="ipLimitQuota">
                <el-input-number v-model="formItem.ipLimitQuota" />(次数)
              </el-form-item>
              <el-form-item label="会话流量控制：" prop="cookieLimitQuota">
                <el-input-number v-model="formItem.cookieLimitQuota" />(次数)
              </el-form-item>
              <el-form-item label="Header自定义流量控制：" prop="headerLimitKvc">
                <el-input v-model="formItem.headerLimitKvc" type="textarea" style="width:500px" /><br>
                <span>流量控制：
                  格式：key,value,quota ，多个用分号";"隔开。示例：userId,13120460000,100 或 merchantId,1005,20;appId,00001,40</span>
              </el-form-item>
              <el-form-item label="请求自定义流量控制：" prop="paramLimitKvc">
                <el-input v-model="formItem.paramLimitKvc" type="textarea" style="width:500px" /><br>
                <span>流量控制：
                  格式：key,value,quota ，多个用分号";"隔开。示例：userId,13120460000,100 或 merchantId,1005,20;appId,00001,40</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :disabled="!formItem.policyId" label="绑定接口" name="form2">
            <el-form v-show="current=='form2'" ref="form2" :model="formItem" :rules="formItemRules" label-width="100px">
              <el-alert type="warning" show-icon style="width:700px">请注意：如果API上原来已经绑定了一个策略，则会被本策略覆盖，请慎重选择！</el-alert>
              <el-form-item prop="authorities" label="功能接口：">
                <el-transfer
                  v-model="formItem.apiIds"
                  :data="selectApis"
                  :titles="['未选择接口', '已选择接口']"
                  :render-content="transferRender"
                  filterable
                  @change="handleTransferChange"
                />
                <el-col :span="24" class="toolbar">
                  <el-pagination
                    background
                    :current-page="pageInfoTrans.current"
                    :page-sizes="[20, 100, 500, 1000]"
                    :page-size="pageInfoTrans.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfoTrans.total"
                    @size-change="handlePageSizeTrans"
                    @current-change="handlePageTrans"
                  />
                </el-col>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="handleReset">取消</el-button>
        <el-button type="primary" :loading="saving" size="small" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRateLimits,
  addRateLimit,
  updateRateLimit,
  removeRateLimit,
  getRateLimitApis,
  addRateLimitApis
} from '@/api/rateLimitApi'
import {
  getAuthorityApi
} from '@/api/authorityApi'
export default {
  name: 'GatewayRateLimit',
  data() {
    return {
      loading: false,
      saving: false,
      modalVisible: false,
      modalTitle: '',
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      current: 'form1',
      forms: [
        'form1',
        'form2'
      ],
      oldApiIds: [],
      pageInfoTrans: {
        current: 1,
        size: 20,
        total: 0
      },
      selectApis: [],
      formItemRules: {
        policyName: [{
          required: true,
          message: '策略名称不能为空',
          trigger: 'blur'
        }]
      },
      formItem: {
        policyId: '',
        policyName: '',
        intervalUnit: 'second',
        totalLimitQuota: 0,
        ipLimitQuota: 0,
        cookieLimitQuota: 0,
        headerLimitKvc: '',
        paramLimitKvc: '',
        apiIds: []
      },
      data: []
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    handleModal(data) {
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑限流策略 - ' + this.formItem.policyName : '编辑限流策略'
        this.modalVisible = true
      }
      if (this.current === this.forms[1]) {
        this.modalTitle = data ? '绑定接口 - ' + this.formItem.policyName : '绑定接口'
        this.handleRateLimitApi(this.formItem.policyId)
      }
    },
    handleTabClick(name) {
      // this.current = name
      this.handleModal()
    },
    handleReset() {
      const newData = {
        policyId: '',
        policyName: '',
        intervalUnit: 'second',
        apiIds: [],
        totalLimitQuota: 0,
        ipLimitQuota: 0,
        cookieLimitQuota: 0,
        headerLimitKvc: '',
        paramLimitKvc: ''
      }
      this.formItem = newData
      // 重置验证
      this.forms.map(form => {
        this.$refs[form].resetFields()
      })
      this.current = this.forms[0]
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit() {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.policyId) {
              updateRateLimit(this.formItem).then(res => {
                this.handleReset()
                this.handleSearch()
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                }
              }).finally(() => {
                this.saving = false
              })
            } else {
              addRateLimit(this.formItem).then(res => {
                this.handleReset()
                this.handleSearch()
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                }
              }).finally(() => {
                this.saving = false
              })
            }
          }
        })
      }
      if (this.current === this.forms[1]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            addRateLimitApis({
              policyId: this.formItem.policyId,
              apiIds: this.formItem.apiIds,
              oldApiIds: this.oldApiIds
            }).then(res => {
              this.handleReset()
              this.handleSearch()
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '绑定成功'
                })
              }
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getRateLimits({
        page: this.pageInfo.page,
        limit: this.pageInfo.limit
      }).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    handleRemove(data) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRateLimit(data.policyId).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleRateLimitApi(policyId) {
      if (!policyId) {
        return
      }
      const that = this
      const params = {
        current: that.pageInfoTrans.current,
        size: that.pageInfoTrans.size,
        policyId: policyId
      }
      const p1 = getAuthorityApi(params)
      const p2 = getRateLimitApis(params)
      Promise.all([p1, p2]).then(function(values) {
        const res1 = values[0]
        const res2 = values[1]
        if (res1.code === 0) {
          res1.data.records.map(item => {
            item.key = item.apiId
            item.label = `${item.prefix.replace('/**', '')}${item.path} - ${item.apiName}`
          })
          that.selectApis = res1.data.records
          that.pageInfoTrans.total = parseInt(res1.data.total)
        }
        if (res2.code === 0) {
          const apiIds = []
          res2.data.map(item => {
            if (!apiIds.includes(item.apiId)) {
              apiIds.push(item.apiId)
            }
          })
          that.formItem.apiIds = apiIds
          that.oldApiIds = apiIds
        }
        that.modalVisible = true
      })
    },
    transferRender(h, option) {
      const ss = option.label
      return <span title={ss}>{ option.label }</span>
    },
    handlePageTrans(current) {
      this.pageInfoTrans.current = current
      this.handleRateLimitApi(this.formItem.policyId)
    },
    handlePageSizeTrans(size) {
      this.pageInfoTrans.size = size
      this.handleRateLimitApi(this.formItem.policyId)
    },
    handleTransferChange(newTargetKeys, direction, moveKeys) {
      if (newTargetKeys.indexOf('1') !== -1) {
        this.formItem.apiIds = ['1']
      } else {
        this.formItem.apiIds = newTargetKeys
      }
    },
    handleClick(name, row) {
      switch (name) {
        case 'remove':
          this.handleRemove(row)
          break
      }
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

</script>

