<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" inline label-width="120px" size="small" class="demo-form-inline form-btn-box">
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>
          <el-button
            class="search-btn"
            type="primary"
            @click="handleAdd()"
          >
            <span>添加</span>
          </el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <el-table-column prop="id" label="id" width="200">
          <template #header>
            <span>id</span>
            <div class="sort-div" @click="sortTable('namespace')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='namespace'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='namespace'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="规则名称" width="280">
          <template #header>
            <span>规则名称</span>
            <div class="sort-div" @click="sortTable('data_id')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='data_id'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='data_id'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="regex" label="正则表达式规则">
          <template #header>
            <span>正则表达式规则</span>
            <div class="sort-div" @click="sortTable('nacos_group')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='nacos_group'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='nacos_group'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="replacement" label="databaseTable" width="200">
          <template #header>
            <span>替换规则</span>
            <div class="sort-div" @click="sortTable('database_table')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='database_table'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='database_table'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" style="margin-right:15px" @click="openDrawer(scope.row)">编辑</a>
            <a class="linkfont" style="margin-right:15px" @click="handleRemove(scope.row)">删除</a>

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
    <el-dialog width="30%" top="180px" :visible.sync="drawerAdd" title="添加脱敏规则" :show-close="true">
      <div>
        <template>
          <el-form ref="addForm" :model="currentAdd" label-width="140px" label-position="right" :rules="ruleValidate" size="small">
            <!-- <el-form-item label="id：" prop="id">
              <el-input v-model="currentAdd.id" placeholder="请输入id" style="width:220px" />
            </el-form-item> -->
            <el-form-item label="规则名称：" prop="name">
              <el-input v-model="currentAdd.name" placeholder="请输入规则名称" style="width:220px" />
            </el-form-item>
            <el-form-item label="正则表达式规则：" prop="regex">
              <el-input v-model="currentAdd.regex" placeholder="请输入正则表达式规则" style="width:220px" />
            </el-form-item>
            <el-form-item label="替换规则：" prop="replacement">
              <el-input v-model="currentAdd.replacement" placeholder="请输入替换规则" style="width:220px" />
            </el-form-item>
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="drawerAdd=false">取消</el-button>
        <el-button type="primary" size="small" @click="addSubmit">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog width="30%" top="175px" :visible.sync="drawerEdit" title="编辑验证标准" :show-close="true">
      <div>
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="140px" label-position="right" :rules="ruleValidate" size="small">
            <el-form-item label="id：" prop="id">
              <el-input v-model="currentEdit.id" placeholder="请输入id" style="width:220px" disabled />
            </el-form-item>
            <el-form-item label="规则名称：" prop="name">
              <el-input v-model="currentEdit.name" placeholder="请输入规则名称" style="width:220px" />
            </el-form-item>
            <el-form-item label="正则表达式规则：" prop="regex">
              <el-input v-model="currentEdit.regex" placeholder="请输入正则表达式规则" style="width:220px" />
            </el-form-item>
            <el-form-item label="替换规则：" prop="replacement">
              <el-input v-model="currentEdit.replacement" placeholder="请输入替换规则" style="width:220px" />
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
  saveDesensitizationRule,
  deleteDesensitizationRuleById,
  editDesensitizationRule,
  // getDesensitizationRule,
  getDesensitizationPage
} from '@/api/desensiteApi'
export default {
  name: 'Desensite',
  data() {
    return {
      databaseTableOptions: [],
      nacosKeyOptions: [],
      nacosKeyOptions1: [],
      nacosKeyOptions2: [],
      drawerEdit: false,
      drawerAdd: false,
      currentEdit: {
        examine_type: 'edit', // 用于审核样式
        id: '', // 原数据代表审核详情里显示的新数据的value值
        name: '',
        regex: '',
        replacement: '',
        id_Old: '', // _Old代表审核详情里显示的老数据的value值
        name_Old: '',
        regex_Old: '',
        replacement_Old: '',
        id_Dec: 'id', // _Dec代表审核详情里显示的key值
        name_Dec: '规则名称',
        regex_Dec: 'regex',
        replacement_Dec: '替换规则'
      },
      currentAdd: {
        examine_type: 'add', // 用于审核样式
        name: '', // 原数据代表审核详情里显示的新数据的value值
        regex: '',
        replacement: '',
        id_Dec: 'id', // _Dec代表审核详情里显示的key值
        name_Dec: '规则名称',
        regex_Dec: 'regex',
        replacement_Dec: '替换规则'
      },
      currentDel: {
        examine_type: 'delete', // 用于审核样式
        id: '', // 原数据代表审核详情里显示的新数据的value值
        name: '',
        regex: '',
        replacement: '',
        id_Old: '', // _Old代表审核详情里显示的老数据的value值
        name_Old: '',
        regex_Old: '',
        replacement_Old: '',
        id_Dec: 'id', // _Dec代表审核详情里显示的key值
        name_Dec: '规则名称',
        regex_Dec: 'regex',
        replacement_Dec: '替换规则'
      },
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        sortField: '',
        sortFieldValue: ''
      },
      ruleValidate: {
        name: [{
          required: true,
          message: '规则名称不能为空！',
          trigger: 'blur'
        }],
        regex: [{
          required: true,
          message: '正则表达式规则不能为空！',
          trigger: 'blur'
        }],
        replacement: [{
          required: true,
          message: '替换规则不能为空！',
          trigger: 'blur'
        }]
      },
      data: [{ 'id': '1001', 'name': '', 'regex': '', 'replacement': '', 'create_time': '', 'update_time': '' }]
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
      // this.data = [{ 'id:': 1001, 'name': '证件脱敏', 'regex': '(\\d{6}\\d{8}{\\w{4}})', 'replacement': '$1*****$2', 'create_time': '', 'update_time': '' }]
      getDesensitizationPage(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
      })
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
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
      this.currentAdd = {
        examine_type: 'add',
        name: '',
        regex: '',
        replacement: '',
        id_Dec: 'id',
        name_Dec: '规则名称',
        regex_Dec: 'regex',
        replacement_Dec: '替换规则'
      }
    },
    openDrawer(data) {
      this.drawerEdit = true
      // this.databaseTableOptions = []
      // this.nacosKeyOptions = []
      // this.nacosKeyOptions1 = []
      // this.nacosKeyOptions2 = []

      // this.currentEdit = JSON.parse(JSON.stringify(data))
      this.setExamineData(data, 'currentEdit', ['_Old'])
      // for (const i in data) {
      //   this.currentEdit[i] = data[i]
      //   this.currentEdit['old_' + i] = data[i]
      // }
      console.log(this.currentEdit)
      // if (this.currentEdit.type === '0') {
      //   this.$set(this.currentEdit, 'fields', this.currentEdit.fields.split(','))
      //   this.$set(this.currentEdit, 'field', '')
      // }
      // if (this.currentEdit.type === '1') {
      //   this.$set(this.currentEdit, 'field', JSON.parse(JSON.stringify(data)).fields)
      //   this.$set(this.currentEdit, 'fields', [])
      // }
      // getTables({}).then(res => {
      //   this.databaseTableOptions = JSON.parse(JSON.stringify(res.data))
      // }).finally(() => {})
      // const params = {
      //   tableName: this.currentEdit.databaseTable
      // }
      // getColumnNames(params).then(res => {
      //   this.nacosKeyOptions = JSON.parse(JSON.stringify(res.data))
      // }).finally(() => {
      //   this.nacosKeyOptions.forEach(v => {
      //     if (v.columnName !== this.currentEdit.nacosKey) {
      //       this.nacosKeyOptions1.push(v)
      //       this.nacosKeyOptions2.push(v)
      //     }
      //   })
      // })
    },

    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editDesensitizationRule(this.currentEdit).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
              this.drawerEdit = false
            }
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
          saveDesensitizationRule(this.currentAdd).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
              this.drawerAdd = false
            }
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
        deleteDesensitizationRuleById(this.currentDel).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '删除成功'
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
