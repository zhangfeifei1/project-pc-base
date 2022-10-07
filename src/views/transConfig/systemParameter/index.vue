<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" :inline="true" label-width="130px" size="small">
        <el-form-item label="系统参数key:" prop="parameterKey">
          <el-input
            v-model="pageInfo.parameterKey"
            clearable
            type="text"
            placeholder="请输入系统参数key！"
            style="width:180px"
          />
        </el-form-item>
        <el-form-item label="系统参数值:" prop="parameterValue">
          <el-input
            v-model="pageInfo.parameterValue"
            clearable
            type="text"
            placeholder="请输入系统参数值！"
            style="width:180px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch1()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="data" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <el-table-column prop="parameterKey" width="320">
          <template #header>
            <span>系统参数key</span>
            <div class="sort-div" @click="sortTable('parameter_key')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='parameter_key'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='parameter_key'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="parameterValue" width="250">
          <template #header>
            <span>系统参数值</span>
            <div class="sort-div" @click="sortTable('parameter_value')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='parameter_value'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='parameter_value'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="parameterDesc" width="350">
          <template #header>
            <span>系统参数描述</span>
            <div class="sort-div" @click="sortTable('parameter_desc')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='parameter_desc'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='parameter_desc'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" style="margin-right:30px" @click="openDrawer(scope.row)">修改</a>
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
    <el-dialog width="30%" top="200px" :visible.sync="drawerEdit" title="修改系统参数配置" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="120px" label-position="right" :rules="ruleValidate" size="small">
            <el-form-item label="系统参数key:" prop="parameterKey">
              <el-input v-model="currentEdit.parameterKey" disabled placeholder="请输入系统参数key" style="width:220px" />
            </el-form-item>
            <el-form-item label="系统参数值:" prop="parameterValue">
              <el-input v-model="currentEdit.parameterValue" placeholder="请输入系统参数值" style="width:220px" />
            </el-form-item>
            <el-form-item label="系统参数描述:" prop="parameterDesc">
              <el-input v-model="currentEdit.parameterDesc" disabled placeholder="请输入系统参数描述" style="width:220px" />
            </el-form-item>
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="drawerEdit=false">取消</el-button>
        <el-button type="primary" size="small" @click="editSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getParameterPage,
  getPattern,
  editParameter
} from '@/api/systemParameter'
export default {
  name: 'SystemParameter',
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
    // const validateSix = (rule, value, callback) => {
    //   if (!value.trim()) {
    //     return callback(new Error('输入值不能为空'))
    //   } else if (!/^[0-9]*$/.test(value)) {
    //     return callback(new Error('输入值只能为数字'))
    //   } else if (value.trim().length !== 6) {
    //     return callback(new Error('请输入6位数字'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateBai = (rule, value, callback) => {
    //   if (!value.trim()) {
    //     return callback(new Error('输入值不能为空'))
    //   } else if (value.trim().length > 100) {
    //     return callback(new Error('请输入内容必须小于100位！'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      drawerEdit: false,
      valuePattern: '',
      currentEdit: {
        examine_type: 'edit', // 用于审核样式
        parameterKey: '',
        parameterValue: '',
        parameterDesc: '',

        parameterKey_Old: '',
        parameterValue_Old: '',
        parameterDesc_Old: '',

        parameterKey_Dec: '系统参数key',
        parameterValue_Dec: '系统参数值',
        parameterDesc_Dec: '系统参数描述'
      },
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        parameterKey: '',
        parameterValue: '',
        parameterDesc: '',
        sortField: '',
        sortFieldValue: ''
      },
      columns: [{
        title: '系统参数key',
        key: 'parameterKey',
        width: 400
      },
      {
        title: '系统参数值',
        key: 'parameterValue',
        width: 400
      },
      {
        title: '操作',
        slot: 'handle',
        fixed: 'right'
      }
      ],
      ruleValidate: {
        parameterKey: [{
          required: true,
          message: '系统参数key不能为空！',
          trigger: 'blur'
        }],
        parameterValue: [{
          required: true,
          message: '系统参数值不能为空！',
          trigger: 'blur'
        }],
        parameterDesc: [{
          required: true,
          message: '系统参数描述不能为空！',
          trigger: 'blur'
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
      getParameterPage(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {})
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
    isEmptyObj(data) {
      for (var item in data) {
        return false
      }
      return true
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.currentEdit))
          if (!this.isEmptyObj(this.valuePattern) && !RegExp(this.valuePattern.parameterKey).test(params.parameterValue)) {
            this.$message.error('系统参数值不满足验证规则！')
            return
          }
          editParameter(params).then(res => {
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
            message: '验证不通过'
          })
        }
      })
    },
    openDrawer(data) {
      this.drawerEdit = true
      this.$nextTick(() => {
        this.$refs.editForm.resetFields()
        // this.currentEdit = JSON.parse(JSON.stringify(data))
        this.setExamineData(data, 'currentEdit', ['_Old'])
        getPattern(this.currentEdit).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.valuePattern = res.data
          }
        })
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
