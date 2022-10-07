<template>
  <div>
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :model="pageInfo"
        :inline="true"
        label-width="80px"
        size="small"
        class="demo-form-inline form-btn-box"
      >
        <el-form-item label="策略名称" prop="policyName">
          <el-input v-model="pageInfo.policyName" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>
          <el-button
            :disabled="hasAuthority('gatewayIpLimitEdit')?false:true"
            class="search-btn"
            type="primary"
            @click="handleModal()"
          >
            <span>添加</span>
          </el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <el-table-column prop="policyName" label="策略名称" width="150" />
        <el-table-column prop="policyType" label="策略类型" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.policyType===1" type="success">允许-白名单</el-tag>
            <el-tag v-if="scope.row.policyType===0" type="danger">拒绝-黑名单</el-tag>
            <el-tag v-if="scope.row.policyType===2" type="danger">拒绝-用户id</el-tag>
            <el-tag v-if="scope.row.policyType===8" type="danger">拒绝-自定义</el-tag>
            <el-tag v-if="scope.row.policyType===9" type="danger">允许-自定义</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间" width="180" />
        <el-table-column prop="ipAddress" label="IP地址/域名" width="150" />
        <el-table-column prop="bl" label="用户唯一id" width="250" />
        <el-table-column prop="customType" label="参数类型" width="120">
          <template slot-scope="scope">
            {{ scope.row.customType|customTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="customKv" label="参数设置" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" :disabled="hasAuthority('gatewayIpLimitEdit')?false:true" @click="handleModal(scope.row)">
              编辑</a>&nbsp;
            <a class="linkfont" :disabled="hasAuthority('gatewayIpLimitEdit')?false:true" @click="handleRemove(scope.row)">
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
    <el-dialog
      :visible.sync="modalVisible"
      :title="modalTitle"
      width="80%"
      :before-close="handleReset"
    >
      <div>
        <el-tabs v-model="current" @tab-click="handleTabClick">
          <el-tab-pane label="策略信息" name="form1" style="margin-left:40px">
            <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="140px" size="small">
              <el-form-item label="策略名称：" prop="policyName">
                <el-input v-model="formItem.policyName" placeholder="请输入内容" style="width:500px" />
              </el-form-item>
              <el-form-item label="策略类型：" prop="policyType">
                <el-select v-model="formItem.policyType" style="width:500px">
                  <el-option :value="0" label="拒绝-黑名单" />
                  <el-option :value="1" label="允许-白名单" />
                  <el-option :value="2" label="拒绝-用户id" />
                  <el-option :value="8" label="拒绝-自定义" />
                  <el-option :value="9" label="允许-自定义" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="formItem.policyType==0||formItem.policyType==1" label="IP地址/域名：" prop="ipAddress">
                <el-input
                  v-model="formItem.ipAddress"
                  type="textarea"
                  style="width:500px"
                  placeholder="192.168.0.1;192.168.0.2;baidu.com;weixin.com"
                /> 同时支持Ip和域名,多个用分号";"隔开。示例：192.168.0.1;baidu.com;weixin.com

              </el-form-item>
              <el-form-item v-if="formItem.policyType===2" label="用户唯一id" prop="bl">
                <el-input v-model="formItem.bl" type="textarea" style="width:500px" />
              </el-form-item>
              <el-form-item v-if="formItem.policyType===8||formItem.policyType===9" label="参数类型：" prop="customType">
                <el-select v-model="formItem.customType" style="width:500px">
                  <el-option :value="0" label="Header" />
                  <el-option :value="1" label="Param" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="formItem.policyType===8||formItem.policyType===9" label="参数设置：" prop="customKv">
                <el-input v-model="formItem.customKv" type="textarea" style="width:500px" /><br>
                <span>访问控制：
                  格式：key,value ，多个用分号";"隔开。示例：userId,13120460000 或 merchantId,1005;appId,00001</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :disabled="!formItem.policyId" label="绑定接口" name="form2">
            <el-form v-show="current=='form2'" ref="form2" :model="formItem" :rules="formItemRules" label-width="100px">
              <el-alert type="warning" show-icon style="width:700px;">请注意：如果API上原来已经绑定了一个策略，则会被本策略覆盖，请慎重选择！</el-alert>
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
        <el-button type="primary" size="small" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getIpLimits, addIpLimit, updateIpLimit, removeIpLimit, getIpLimitApis, addIpLimitApis } from '@/api/ipLimitApi'
import { getAuthorityApi } from '@/api/authorityApi'

export default {
  name: 'GatewayIpLimit',
  filters: {
    customTypeFilter(val) {
      let res = ''
      switch (val) {
        case 0:
          res = 'Header'
          break
        case 1:
          res = 'Param'
          break
        default:
          res = ''
      }
      return res
    }
  },
  data() {
    return {
      saving: false,
      modalVisible: false,
      modalTitle: '',
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        policyName: ''
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
        policyName: [
          { required: true, message: '策略名称不能为空', trigger: 'blur' }
        ],
        policyType: [
          { required: true, message: '策略类型不能为空', trigger: 'blur' }
        ],
        ipAddress: [
          { required: true, message: 'Ip地址不能为空', trigger: 'blur' }
        ],
        bl: [
          { required: true, message: '用户唯一id不能为空', trigger: 'blur' }
        ],
        customType: [
          { required: true, message: '参数类型不能为空', trigger: 'change' }
        ],
        customKv: [
          { required: true, message: '参数设置不能为空', trigger: 'blur' }
        ]
      },
      formItem: {
        policyId: '',
        policyName: '',
        policyType: 0,
        ipAddress: '',
        bl: '',
        customType: 0,
        customKv: '',
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
        this.modalTitle = data ? '编辑来源限制 - ' + this.formItem.policyName : '编辑来源限制'
        this.modalVisible = true
      }
      if (this.current === this.forms[1]) {
        this.modalTitle = data ? '绑定接口 - ' + this.formItem.policyName : '绑定接口'
        this.handleIpLimitApi(this.formItem.policyId)
      }
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
    },
    handleTabClick(name) {
      // this.current = name
      this.handleModal()
    },
    handleReset() {
      const newData = {
        policyId: '',
        policyName: '',
        policyType: 0,
        ipAddress: '',
        bl: '',
        apiIds: [],
        customType: 0,
        customKv: ''
      }
      this.formItem = newData
      // 重置验证
      this.forms.map(form => {
        this.handleResetForm(form)
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
              if (this.formItem.policyType === 0 || this.formItem.policyType === 1) {
                this.formItem.bl = ''
                this.formItem.customType = ''
                this.formItem.customKv = ''
              }
              if (this.formItem.policyType === 2) {
                this.formItem.ipAddress = ''
                this.formItem.customType = ''
                this.formItem.customKv = ''
              }
              if (this.formItem.policyType === 8 || this.formItem.policyType === 9) {
                this.formItem.bl = ''
                this.formItem.ipAddress = ''
              }
              updateIpLimit(this.formItem).then(res => {
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
              if (this.formItem.policyType === 0 || this.formItem.policyType === 1) {
                this.formItem.bl = ''
                this.formItem.customType = ''
                this.formItem.customKv = ''
              }
              if (this.formItem.policyType === 2) {
                this.formItem.ipAddress = ''
                this.formItem.customType = ''
                this.formItem.customKv = ''
              }
              if (this.formItem.policyType === 8 || this.formItem.policyType === 9) {
                this.formItem.bl = ''
                this.formItem.ipAddress = ''
              }
              addIpLimit(this.formItem).then(res => {
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
            addIpLimitApis({ policyId: this.formItem.policyId, apiIds: this.formItem.apiIds, oldApiIds: this.oldApiIds }).then(res => {
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
      getIpLimits(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
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
    filterTag(value, row) {
      return row.status === value
    },
    handleRemove(data) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeIpLimit(data.policyId).then(res => {
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
    handleIpLimitApi(policyId) {
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
      const p2 = getIpLimitApis(params)
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
      this.handleIpLimitApi(this.formItem.policyId)
    },
    handlePageSizeTrans(size) {
      this.pageInfoTrans.size = size
      this.handleIpLimitApi(this.formItem.policyId)
    },
    handleTransferChange(newTargetKeys, direction, moveKeys) {
      if (newTargetKeys.indexOf('1') !== -1) {
        this.formItem.apiIds = ['1']
      } else {
        this.formItem.apiIds = newTargetKeys
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
