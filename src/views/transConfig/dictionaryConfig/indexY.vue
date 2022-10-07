<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" :inline="true" label-width="80px" size="small">
        <el-form-item label="响应码:" prop="rspCode">
          <el-input
            v-model="pageInfo.rspCode"
            clearable
            type="text"
            placeholder="请输入响应码！"
            style="width:180px"
          />
        </el-form-item>
        <el-form-item label="响应信息:" prop="rspMsg">
          <el-input
            v-model="pageInfo.rspMsg"
            clearable
            type="text"
            placeholder="请输入响应信息！"
            style="width:180px"
          />
        </el-form-item>
        <el-form-item label="类型:" prop="rspType">
          <el-select v-model="pageInfo.rspType" disabled style="width:120px">
            <!-- <el-option label="所有" :value="0"></el-option> -->
            <!-- <el-option label="平台" :value="1"></el-option> -->
            <el-option label="应用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch1()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :loading="loading" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <el-table-column prop="rspCode" width="200">
          <template #header>
            <span>响应码</span>
            <div class="sort-div" @click="sortTable('rsp_code')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_code'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_code'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rspMsg">
          <template #header>
            <span>响应信息</span>
            <div class="sort-div" @click="sortTable('rsp_msg')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_msg'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_msg'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rspType" width="250">
          <template #header>
            <span>类型</span>
            <div class="sort-div" @click="sortTable('rsp_type')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
          <template slot-scope="scope">
            {{ scope.row.rspType | rspTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <a v-if="scope.row.rspType==2" class="linkfont" style="margin-right:30px" @click="openDrawer(scope.row)">修改</a>
            <a v-if="scope.row.rspType==2" class="linkfont" @click="handleRemove(scope.row)">删除</a>
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
    <el-dialog width="30%" top="200px" :visible.sync="drawerEdit" title="修改响应码配置" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="100px" label-position="right" :rules="ruleValidate" size="small">
            <el-form-item label="响应码:" prop="rspCode">
              <el-input v-model="currentEdit.rspCode" placeholder="请输入响应码" style="width:220px" />
            </el-form-item>
            <el-form-item label="响应信息:" prop="rspMsg">
              <el-input v-model="currentEdit.rspMsg" placeholder="请输入响应信息" style="width:220px" />
            </el-form-item>
            <el-form-item label="类型:" prop="rspType">
              <el-select v-model="currentEdit.rspType" disabled style="width:220px">
                <!-- <el-option label="平台" :value="1"></el-option> -->
                <el-option label="应用" :value="2" />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="drawerEdit=false">取消</el-button>
        <el-button type="primary" size="small" @click="editSubmit">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog width="30%" top="200px" :visible.sync="drawerAdd" title="添加响应码配置" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="addForm" :model="currentAdd" label-width="100px" label-position="right" :rules="ruleValidate" size="small">
            <el-form-item label="响应码:" prop="rspCode">
              <el-input v-model="currentAdd.rspCode" placeholder="请输入响应码" style="width:220px" />
            </el-form-item>
            <el-form-item label="响应信息:" prop="rspMsg">
              <el-input v-model="currentAdd.rspMsg" placeholder="请输入响应信息" style="width:220px" />
            </el-form-item>
            <el-form-item label="类型:" prop="rspType">
              <el-select v-model="currentAdd.rspType" disabled style="width:220px">
                <!-- <el-option label="平台" :value="1"></el-option> -->
                <el-option label="应用" :value="2" />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="drawerAdd=false">取消</el-button>
        <el-button type="primary" size="small" @click="addSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveRspMsg,
  editRspMsg,
  getRspMsgPage,
  deleteRspMsgById
} from '@/api/dictionaryConfigApi'
export default {
  name: 'DictionaryConfig1',
  filters: {
    rspTypeFilter(val) {
      let res = ''
      switch (val) {
        case 1:
          res = '平台'
          break
        case 2:
          res = '应用'
          break
        default:
          res = '缺少数据'
          break
      }
      return res
    }

  },
  data() {
    const validateTen = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('输入值不能为空'))
      } else if (value.trim().length > 10) {
        return callback(new Error('不可超过十位字符！'))
      } else {
        callback()
      }
    }
    const validateBai = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('输入值不能为空'))
      } else if (value.trim().length > 100) {
        return callback(new Error('请输入内容必须小于100位！'))
      } else {
        callback()
      }
    }
    return {
      drawerEdit: false,
      drawerAdd: false,
      currentEdit: {
        examine_type: 'edit', // 用于审核样式
        rspCode: '',
        rspMsg: '',
        rspType: 2,
        rspCode_Old: '',
        rspMsg_Old: '',
        rspType_Old: 2,
        rspCode_Dec: '响应码',
        rspMsg_Dec: '响应信息',
        rspType_Dec: '类型'
      },
      currentAdd: {
        examine_type: 'add', // 用于审核样式
        rspCode: '',
        rspMsg: '',
        rspType: 2,
        rspCode_Dec: '响应码',
        rspMsg_Dec: '响应信息',
        rspType_Dec: '类型'
      },
      currentDel: {
        examine_type: 'delete', // 用于审核样式
        rspCode: '',
        rspMsg: '',
        rspType: 2,
        rspCode_Old: '',
        rspMsg_Old: '',
        rspType_Old: 2,
        rspCode_Dec: '响应码',
        rspMsg_Dec: '响应信息',
        rspType_Dec: '类型'
      },
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        rspCode: '',
        rspMsg: '',
        rspType: 2,
        sortField: '',
        sortFieldValue: ''
      },
      columns: [{
        title: '响应码',
        key: 'rspCode',
        width: 400
      },
      {
        title: '响应信息',
        key: 'rspMsg',
        width: 400
      },
      {
        title: '操作',
        slot: 'handle',
        fixed: 'right'
      }
      ],
      ruleValidate: {
        rspCode: [{
          required: true,
          validator: validateTen,
          trigger: 'blur'
        }],
        rspMsg: [{
          required: true,
          validator: validateBai,
          trigger: 'blur'
        }],
        rspType: [{
          required: true,
          message: '类型不能为空！',
          trigger: 'change'
        }]
      },
      data: []
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    /**
     * @description 设置上送数据的参数,为审核详情页提供原数据、修改数据、各数据标题
     * @param data 原上送数据
     * @param obj 改造数据变量名称
     * @param arr 添加的后缀名称数组 ['_Old','_Dec']
     */
    setExamineData(data, obj, arr) {
      for (const i in data) {
        this[obj][i] = data[i]
        for (const j in arr) {
          this[obj][i + arr[j]] = data[i]
        }
      }
    },
    handleSearch() {
      this.loading = true
      getRspMsgPage(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch1() {
      this.pageInfo.page = 1
      this.pageInfo.sortField = ''
      this.pageInfo.sortFieldValue = ''
      this.handleSearch()
    },
    sortTable(val) {
      if (this.pageInfo.sortField !== val) {
        this.pageInfo.sortFieldValue = ''
      }
      this.pageInfo.sortField = val
      if (this.pageInfo.sortFieldValue === '' || this.pageInfo.sortFieldValue === 'desc') {
        this.pageInfo.sortFieldValue = 'asc'
        this.handleSearch()
        return
      }
      if (this.pageInfo.sortFieldValue === 'asc') {
        this.pageInfo.sortFieldValue = 'desc'
        this.handleSearch()
        return
      }
    },
    handleAdd() {
      this.drawerAdd = true
      setTimeout(() => {
        this.$refs.addForm.resetFields()
      }, 0)
      this.currentAdd = {
        examine_type: 'add', // 用于审核样式
        rspCode: '',
        rspMsg: '',
        rspType: 2,
        rspCode_Dec: '响应码',
        rspMsg_Dec: '响应信息',
        rspType_Dec: '类型'
      }
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.currentEdit))
          if (params.rspCode >= 0 && params.rspCode <= 100000) {
            if (params.rspType !== 1) {
              this.$message.error('应用响应码在100001——999999之间！')
              return
            }
          }
          if (params.rspCode >= 100001 && params.rspCode <= 999999) {
            if (params.rspType !== 2) {
              this.$message.error('平台响应码在000000——100000之间！')
              return
            }
          }
          editRspMsg(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
            }
            this.drawerEdit = false
            this.handleSearch()
          }).finally(() => {

          })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过！'
          })
        }
      })
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const params = this.currentAdd
          if (params.rspCode >= 0 && params.rspCode <= 100000) {
            if (params.rspType !== 1) {
              this.$message.error('应用响应码在100001——999999之间！')
              return
            }
          }
          if (params.rspCode >= 100001 && params.rspCode <= 999999) {
            if (params.rspType !== 2) {
              this.$message.error('平台响应码在000000——100000之间！')
              return
            }
          }
          saveRspMsg(params).then(res => {
            if (res.code === 0) {
              this.pageInfo.page = 1
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
            }
            this.drawerAdd = false
            this.handleSearch()
          }).finally(() => {

          })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过！'
          })
        }
      })
    },
    handleRemove(data) {
      this.setExamineData(data, 'currentDel', ['_Old'])
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRspMsgById(this.currentDel).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          }
          this.handleSearch()
        }).catch(() => {
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openDrawer(data) {
      setTimeout(() => {
        this.$refs.editForm.resetFields()
        // this.currentEdit = JSON.parse(JSON.stringify(data))
        this.setExamineData(data, 'currentEdit', ['_Old'])
      }, 0)
      this.drawerEdit = true
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
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

<style lang="less">
  .account-setting {
    &-con {
      height: ~"calc(100vh - 176px)";
      display: inline-block;
      vertical-align: top;
      position: relative;

      &.left-con {
        border-right: 1px solid #e6e6e6;
      }

      &.view-con {
        position: absolute;
        left: 264px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
      }
    }
  }
</style>
