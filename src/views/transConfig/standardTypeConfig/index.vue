<template>
  <div>
    <el-form ref="searchForm" :model="pageInfo" :inline="true" label-width="120px" size="small" style="margin-top: 20px">
      <el-form-item label="标准数据名称:" prop="codeName">
        <el-input
          v-model="pageInfo.codeName"
          clearable
          type="text"
          placeholder="请输入标准数据名称！"
          style="width:250px"
        />
      </el-form-item>
      <el-form-item label="标准数据描述:" prop="codeDescription">
        <el-input
          v-model="pageInfo.codeDescription"
          clearable
          type="text"
          placeholder="请输入标准数据描述！"
          style="width:250px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" style="width:80px" @click="handleSearchNew()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="8">
      <el-col :xs="16" :sm="16" :md="16" :lg="12">
        <el-card shadow="always" class="whiteBAc" style="padding-bottom: 10px;">
          <el-button type="primary" size="small" style="width:80px; margin-bottom: 16px" @click="handleAdd()">添加</el-button>
          <el-table border :data="data" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
            <el-table-column prop="codeName" width="200">
              <template #header>
                <span>标准数据名称</span>
                <div class="sort-div" @click="sortTable('code_name')">
                  <i
                    :class="['el-icon-sort-down','sort-icon-down',
                             (pageInfo.sortField=='code_name'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
                  />
                  <i
                    :class="['el-icon-sort-up','sort-icon-up',
                             (pageInfo.sortField=='code_name'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="codeDescription" width="200">
              <template #header>
                <span>标准数据描述</span>
                <div class="sort-div" @click="sortTable('code_description')">
                  <i
                    :class="['el-icon-sort-down','sort-icon-down',
                             (pageInfo.sortField=='code_description'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
                  />
                  <i
                    :class="['el-icon-sort-up','sort-icon-up',
                             (pageInfo.sortField=='code_description'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <a class="linkfont" style="margin-right:30px" @click="openDrawer(scope.row)">编辑</a>
                <a class="linkfont" @click="handleRemove(scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination
              background
              :current-page="pageInfo.current"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageInfo.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageInfo.total"
              @size-change="handlePageSize"
              @current-change="handlePage"
            />
          </el-col>
        </el-card>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="12">
        <el-card shadow="always" class="whiteBAc">
          <div>
            <template>
              <el-form ref="submitForm" size="small" :model="currentSubmit" label-width="120px" label-position="right" :rules="ruleValidate">
                <el-button
                  size="small"
                  style="margin:0px 0px 16px 0px"
                  type="primary"
                  @click="addExpand()"
                >添加参数</el-button>
                <el-form-item label="标准数据名称:" prop="codeName">
                  <el-input v-model="currentSubmit.codeName" placeholder="请输入标准数据名称！" style="width:350px" />
                </el-form-item>
                <el-form-item label="标准数据描述:" prop="codeDescription">
                  <el-input v-model="currentSubmit.codeDescription" placeholder="请输入标准数据描述！" style="width:350px" />
                </el-form-item>
                <el-form-item label="标准数据:">
                  <el-table ref="innerPage" :data="currentSubmit.CodeOption" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
                    <el-table-column prop="codeValue" label="选项值" width="150">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.codeValue" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="valueDescription" label="选项描述" width="150">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.valueDescription" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <a @click="deleteExpand(scope.row)">删除</a>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top:14px">
                    <el-pagination
                      background
                      :current-page="pageInfoInner.current"
                      :page-size="pageInfoInner.size"
                      layout="total, prev, pager, next"
                      :total="pageInfoInner.total"
                      @size-change="handlePageSizeInner"
                      @current-change="handlePageInner"
                    />
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </div>
          <div class="footer">
            <el-button type="primary" size="small" @click="handleSubmit">保存</el-button>
            <el-button type="default" size="small" @click="handleAdd">取消</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  addNewStandard,
  searchStandard,
  searchStandardTerm,
  deleteStandard,
  updateStandard
} from '@/api/standardTypeConfig'
export default {
  name: 'StandardTypeConfig',
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
    return {
      dialogTitle: '',
      dialogFlag: '',
      CodeOption: [],
      currentSubmit: {
        codeName: '',
        codeDescription: '',
        CodeOption: []
      },
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
        codeName: '',
        codeDescription: '',

        sortField: '',
        sortFieldValue: ''
      },
      pageInfoInner: {
        total: 0,
        current: 1,
        size: 5
      },
      ruleValidate: {
        codeName: [{
          required: true,
          message: '标准数据名称不可为空!',
          trigger: 'blur'
        }],
        codeDescription: [{
          required: true,
          message: '标准数据描述不可为空!',
          trigger: 'blur'
        }]
      },
      data: []
    }
  },
  mounted: function() {
    this.handleSearch()
    this.handleAdd()
  },
  methods: {
    handleSearch() {
      searchStandard(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).catch(() => {
        this.$message.error('cxshibai')
      })
    },
    handleSearchInnerRe() {
      this.pageInfoInner.current = 1
      this.pageInfoInner.size = 5
      this.handleSearchInner()
    },
    handleSearchInnerPage() {
      var index = this.pageInfoInner.current - 1
      this.currentSubmit.CodeOption = this.CodeOption.slice(index * 5, index * 5 + 5)
    },
    handleSearchInner() {
      const params = {
        codeId: this.currentSubmit.codeId,
        codeName: this.currentSubmit.codeName
      }
      searchStandardTerm(params).then(res => {
        console.log(res)
        if (res.returnCode === '000000') {
          this.CodeOption = res.data
          this.currentSubmit.CodeOption = this.CodeOption.slice(0, 5)
          this.pageInfoInner.total = parseInt(res.data.length)
        }
      }).catch(() => {
        this.$message.error('查询失败！')
      })
    },
    handleSearchNew() {
      this.pageInfo.current = 1
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
      this.dialogTitle = '添加标准数据'
      this.dialogFlag = 'add'
      this.$nextTick(() => {
        this.$refs.submitForm.resetFields()
        this.currentSubmit = {
          codeName: '',
          codeDescription: '',
          CodeOption: []
        }
        this.CodeOption = []
        this.handleSearchInnerRe()
      })
    },
    handleSubmit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.currentSubmit))
          params.CodeOption = this.CodeOption
          if (this.dialogFlag === 'add') {
            addNewStandard(params).then(res => {
              if (res.returnCode === '000000') {
                this.$message.success('新增标准数据成功！')
                this.handleAdd()
              }
              this.handleSearchNew()
            }).catch(() => {
              this.$message.error('新增标准数据失败！')
            })
            return
          } else if (this.dialogFlag === 'upload') {
            updateStandard(params).then(res => {
              if (res.returnCode === '000000') {
                this.$message.success('更新标准数据成功！')
              }
              this.handleSearchNew()
            }).catch(() => {
              this.$message.error('更新标准数据失败！')
            })
            return
          }
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过'
          })
        }
      })
    },
    handleRemove(data) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          codeId: data.codeId,
          codeName: data.codeName,
          type: 'item'
        }
        deleteStandard(params).then(res => {
          if (res.code === 0) {
            this.pageInfo.current = 1
            this.pageInfo.sortField = ''
            this.pageInfo.sortFieldValue = ''
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.handleAdd()
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
      this.dialogTitle = '更新标准数据'
      this.dialogFlag = 'upload'

      this.currentSubmit = {
        codeName: JSON.parse(JSON.stringify(data)).codeName,
        codeDescription: JSON.parse(JSON.stringify(data)).codeDescription,
        codeId: JSON.parse(JSON.stringify(data)).codeId,
        CodeOption: []
      }
      this.CodeOption = []
      this.handleSearchInnerRe()
    },
    // 高级配置增加参数
    addExpand() {
      var newE = {
        codeValue: '',
        valueDescription: ''
      }
      this.CodeOption.splice((this.pageInfoInner.current - 1) * 5, 0, newE)
      this.pageInfoInner.total = this.pageInfoInner.total + 1
      this.handleSearchInnerPage()
    },
    // 删除扩展参数
    deleteExpand(val) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var index = this.CodeOption.indexOf(val)
        if (index > -1) {
          this.CodeOption.splice(index, 1)
        }
        this.pageInfoInner.total = this.pageInfoInner.total - 1
        if (this.pageInfoInner.total % 5 === 0) {
          this.pageInfoInner.current = this.pageInfoInner.current - 1
        }
        this.handleSearchInnerPage()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlePage(current) {
      this.pageInfo.current = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.size = size
      this.handleSearch()
    },
    handlePageInner(current) {
      this.pageInfoInner.current = current
      this.handleSearchInnerPage()
    },
    handlePageSizeInner(size) {
      this.pageInfoInner.size = size
      this.handleSearchInnerPage()
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
  .whiteBAc{
    position: relative;
    background: #ffffff !important;
    min-height: 600px;
    padding-top: 10px;
  }
  .footer{
    position: absolute;
    bottom: 40px;
    left: 50px;
  }
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
  .disableA{
    color: #ccc!important;
  }
</style>
