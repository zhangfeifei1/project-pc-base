<template>
  <div>
    <el-card shadow="always">
      <!-- <el-form ref="searchForm" :model="pageInfo" :inline="true" label-width="80px">
        <el-form-item label="名称:" prop="rspCode">
          <el-input
            v-model="pageInfo.rspCode"
            size="mini"
            clearable
            type="text"
            placeholder="请输入响应码！"
            style="width:180px"
          />
        </el-form-item>
        <el-form-item label="授权:" prop="rspType">
          <el-select v-model="pageInfo.rspType" size="mini" style="width:120px">
            <el-option label="未授权" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleSearch1()">查询</el-button>
        </el-form-item>
      </el-form> -->

      <el-table border :data="data" :loading="loading" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <el-table-column prop="seqNo" width="200">
          <template #header>
            <span>交易序号</span>
            <!-- <div class="sort-div" @click="sortTable('rsp_code')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_code'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_code'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="userId" width="200">
          <template #header>
            <span>操作员</span>
            <!-- <div class="sort-div" @click="sortTable('rsp_msg')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_msg'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_msg'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div> -->
          </template>
        </el-table-column>

        <el-table-column prop="txnDesc" width="200">
          <template #header>
            <span>交易名称</span>
            <div class="sort-div" @click="sortTable('rsp_type')">
              <!-- <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              /> -->
            </div>
          </template>
          <!-- <template slot-scope="scope">
            {{ scope.row.rspType | rspTypeFilter }}
          </template> -->
        </el-table-column>
        <el-table-column prop="authStatus" width="200">
          <template #header>
            <span>审批状态</span>
            <!-- <div class="sort-div" @click="sortTable('rsp_type')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div> -->
          </template>
          <template slot-scope="scope">
            {{ scope.row.authStatus | authStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="txnTime" width="250">
          <template #header>
            <span>提交时间</span>
            <!-- <div class="sort-div" @click="sortTable('rsp_type')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='rsp_type'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div> -->
          </template>
          <!-- <template slot-scope="scope">
            {{ scope.row.rspType | rspTypeFilter }}
          </template> -->
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template v-if="scope.row.authStatus=='000'" slot-scope="scope">
            <a class="linkfont" style="margin-right:30px" @click="openDrawer(scope.row)">详情</a>
            <!-- <a class="linkfont" @click="handleRemove(scope.row)">拒绝</a> -->
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
    <el-dialog width="30%" top="60px" :visible.sync="drawerEdit" title="审批操作" :show-close="true">
      <div>
        <template>
          <div v-if="examineType=='refresh'" class="dataBox" style="text-align:center">
            将数据库数据同步至nacos
          </div>
          <div class="dataBox">老数据</div>
          <div v-for="(i,index) in oldList" :key="'old'+index" class="dataList">
            <div class="dataLabel">{{ i.label }}:</div>
            <div class="dataValue">{{ i.value }}</div>
          </div>
          <div v-if="oldList.length==0" class="dataList">
            无老数据
          </div>
          <div class="dataBox">新数据：</div>
          <div v-for="(j,index1) in newList" :key="'new'+index1" class="dataList">
            <div class="dataLabel">{{ j.label }}:</div>
            <div class="dataValue">{{ j.value }}</div>
          </div>
          <div v-if="newList.length==0" class="dataList">
            无新数据
          </div>
          <div class="dataBox">审批：</div>
          <el-form ref="editForm" :model="currentEdit.authData" label-width="120px" label-position="left" :rules="ruleValidate" size="small">
            <el-form-item label="理由:" prop="taskRejReason">
              <el-input v-model="currentEdit.taskRejReason" placeholder="" style="width:220px" />
            </el-form-item>
            <!-- <el-form-item label="类型:" prop="rspType">
              <el-select v-model="currentEdit.rspType" disabled>
                <el-option label="平台" :value="1" />
              </el-select>
            </el-form-item> -->
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="editSubmit">通过</el-button>
        <el-button type="primary" size="small" @click="handleRemove(currentEdit)">拒绝</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAuthorityList,
  setApprove
  // deleteRspMsgById
} from '@/api/examineApi'
export default {
  name: 'DictionaryConfig',
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
    },
    authStatusFilter(v) {
      if (v == null) return
      let res = ''
      switch (v) {
        case 'TF':
          res = '审核通过,处理失败'
          break
        case 'TS':
          res = '审核通过'
          break
        case 'AF':
          res = '审核拒绝'
          break
        default:
          res = '待审核'
          break
      }
      return res
    }
  },
  data() {
    const validateSix = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('输入值不能为空'))
      } else if (!/^[0-9]*$/.test(value)) {
        return callback(new Error('输入值只能为数字'))
      } else if (value.trim().length !== 6) {
        return callback(new Error('请输入6位数字'))
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
        authData: {
          province: {
            region_code: '',
            region_name: ''
          },
          city: {
            region_code: '',
            region_name: ''
          },
          county: {
            region_code: '',
            region_name: ''
          },
          branchPName: {
            branch_id: '',
            branch_name: ''
          }

        },
        rspCode: '',
        rspMsg: '',
        rspType: 1
      },
      currentAdd: {
        rspCode: '',
        rspMsg: '',
        rspType: 1
      },
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        rspCode: '',
        rspMsg: '',
        rspType: 1,
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
        // rspCode: [{
        //   required: true,
        //   validator: validateSix,
        //   trigger: 'blur'
        // }],
        // rspMsg: [{
        //   required: true,
        //   validator: validateBai,
        //   trigger: 'blur'
        // }],
        // rspType: [{
        //   required: true,
        //   message: '类型不能为空！',
        //   trigger: 'change'
        // }]
      },
      data: [],
      oldList: [],
      newList: [],
      examineType: ''
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    // 获取审核详情的原数据和修改后数据
    getOldAndNewList(item) {
      this.oldList = []
      this.newList = []
      // debugger
      for (const i in item.authData) {
        if (i.indexOf('_Dec') !== -1) {
          const oldkey = i.substring(0, i.length - 4) + '_Old'
          const newkey = i.substring(0, i.length - 4)

          if (item.authData[i] && item.authData.examine_type === 'add') {
            this.examineType = 'add'
            this.newList.push({ label: item.authData[i], value: item.authData[newkey] })
          } else if (item.authData[i] && item.authData.examine_type === 'edit') {
            this.examineType = 'edit'
            this.oldList.push({ label: item.authData[i], value: item.authData[oldkey] })
            this.newList.push({ label: item.authData[i], value: item.authData[newkey] })
          } else if (item.authData[i] && item.authData.examine_type === 'delete') {
            this.examineType = 'delete'
            this.oldList.push({ label: item.authData[i], value: item.authData[oldkey] })
          } else if (item.authData[i] && item.authData.examine_type === 'refresh') {
            this.examineType = 'refresh'
            this.newList.push({ label: item.authData[i], value: item.authData[newkey] })
          }
        }
      }
      this.oldList = [...new Set(this.oldList)]
      this.newList = [...new Set(this.newList)]
    },
    handleSearch() {
      this.loading = true

      getAuthorityList(this.pageInfo).then(res => {
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
        rspCode: '',
        rspMsg: '',
        rspType: 1
      }
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.currentEdit))
          // if (params.rspCode >= 0 && params.rspCode <= 100000) {
          //   if (params.rspType !== 1) {
          //     this.$message.error('应用响应码在100001——999999之间！')
          //     return
          //   }
          // }
          // if (params.rspCode >= 100001 && params.rspCode <= 999999) {
          //   if (params.rspType !== 2) {
          //     this.$message.error('平台响应码在000000——100000之间！')
          //     return
          //   }
          // }

          const formData = {
            seqNo: params.seqNo,
            taskApproval: '1',
            taskRejReason: params.seqNo
          }
          setApprove(formData).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '审批成功！'
              })
            }
            this.drawerEdit = false
            this.handleSearch()
          }).catch(() => {
          })
          // editRspMsg(params).then(res => {
          //   if (res.code === 0) {
          //     this.$message({
          //       type: 'success',
          //       message: '修改成功！'
          //     })
          //   }
          //   this.drawerEdit = false
          //   this.handleSearch()
          // }).catch(() => {
          // })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过'
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
          // saveRspMsg(params).then(res => {
          //   if (res.code === 0) {
          //     this.pageInfo.page = 1
          //     this.$message({
          //       type: 'success',
          //       message: '新增成功！'
          //     })
          //   }
          //   this.drawerAdd = false
          //   this.handleSearch()
          // }).catch(() => {
          // })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过'
          })
        }
      })
    },
    handleRemove(data) {
      this.$confirm('确定拒绝吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const formData = {
          seqNo: data.seqNo,
          taskApproval: '0',
          taskRejReason: data.taskRejReason
        }
        setApprove(formData).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '拒绝成功！'
            })
          }

          this.drawerEdit = false
          this.handleSearch()
        }).catch(() => {
        })
        // deleteRspMsgById(data).then(res => {
        //   if (res.code === 0) {
        //     this.pageInfo.page = 1
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功'
        //     })
        //   }
        //   this.handleSearch()
        // }).catch(() => {
        //   this.handleSearch()
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openDrawer(data) {
      // 获取审核详情的原数据和修改后数据
      this.getOldAndNewList(data)
      // this.loading = true
      // getRspMsgPage(this.pageInfo).then(res => {
      setTimeout(() => {
        this.$refs.editForm.resetFields()
        this.currentEdit = JSON.parse(JSON.stringify(data))
      }, 0)
      this.drawerEdit = true
      // }).finally(() => {
      //   this.loading = false
      // })
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
  .dataBox{
    vertical-align: middle;
    font-size: 16px;
    color: #000000;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: 700;
  }
  .dataList{
    display: flex;
    width: 90%;
    margin: 0 auto;
  }
  .dataLabel{
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: 700;
    width: 120px;
  }
  .dataValue{
    width: 220px;
    text-align: right;
    color: #606266;
    line-height: 40px;
  }
</style>
