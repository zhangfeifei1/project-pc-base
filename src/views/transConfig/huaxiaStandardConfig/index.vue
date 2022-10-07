<template>
  <div class="app-container calendar-list-container">
    <el-form ref="searchForm" :model="pageInfo" :inline="true" label-width="100px" size="small" style="margin-top: 20px">
      <el-form-item label="标准项编号:" prop="itemCode">
        <el-input
          v-model="pageInfo.itemCode"
          clearable
          type="text"
          placeholder="请输入标准项编号！"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="中文名称:" prop="nameZh">
        <el-input
          v-model="pageInfo.nameZh"
          clearable
          type="text"
          placeholder="请输入中文名称！"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="版本号:" prop="version">
        <el-input
          v-model="pageInfo.version"
          clearable
          type="text"
          placeholder="请输入版本号！"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" style="width:80px" @click="handleSearch(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="data" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
      <el-table-column prop="itemCode" label="标准项编号" width="200" />
      <el-table-column prop="itemSubject" label="标准主题" width="200" />
      <el-table-column prop="majorCategory" label="标准大类" width="200" />
      <el-table-column prop="secondaryCategory" label="标准子类" width="200" />
      <el-table-column prop="nameZh" label="中文名称" width="350" />
      <el-table-column prop="nameEn" label="英文名称" width="350" />
      <el-table-column prop="nameAlias" label="别名" width="200" />
      <el-table-column prop="businessDefinition" label="业务定义" width="800" />
      <el-table-column prop="businessRule" label="业务规则" width="500" />
      <el-table-column prop="businessRange" label="值域" width="200" />
      <el-table-column prop="businessBasis" label="制定依据" width="500" />
      <el-table-column prop="techType" label="数据类别" width="200" />
      <el-table-column prop="techDataFormat" label="数据格式" width="200" />
      <el-table-column prop="techCodingRule" label="代码编码规则" width="500" />
      <el-table-column prop="manageDept" label="定义标准部门" width="350" />
      <el-table-column prop="manageRelevant" label="相关标准" width="350" />
      <el-table-column prop="manageRelation" label="与相关标准关系" width="200" />
      <!-- <el-table-column prop="codeType" label="代码类型" width="200">
        <template slot-scope="scope">
          {{ scope.row.codeType|codeTypeFilter }}
        </template>
      </el-table-column> -->
      <el-table-column prop="version" label="版本号" width="200" />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <a v-if="scope.row.techType==='代码类'" class="linkfont" @click="showDetails(scope.row)">代码详情</a>
          <a v-else class="linkfont" style="color:#ccc!important;cursor:not-allowed">代码详情</a>
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
    <el-dialog width="60%" top="200px" :visible.sync="drawerDetails" :title="drawerTitle" :show-close="false">
      <el-table border :data="innerData" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <template v-for="(item,index) in tableHead">
          <el-table-column :key="index" :prop="Object.keys(item)[0]" :label="item[Object.keys(item)[0]]" width="400" />
        </template>
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-pagination
          background
          :current-page="pageInfoInner.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageInfoInner.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfoInner.total"
          @size-change="handlePageSizeInner"
          @current-change="handlePageInner"
        />
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="drawerDetails=false">返回</el-button>
      </span>
    </el-dialog>
    <el-dialog width="60%" top="200px" :visible.sync="drawerTree" :title="drawerTitle" :show-close="false">
      <el-row v-loading="loading">
        <el-col :span="10">
          <el-card style="background:#FFFFFF!important">
            <tree-table
              style="max-height:500px;overflow: auto"
              expand-key="name"
              :expand-type="false"
              :is-fold="true"
              :tree-type="true"
              :selectable="false"
              :columns="columns"
              :data="treeData"
              @radio-click="rowClick"
            />
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card style="background:#FFFFFF!important">
            <el-form ref="editForm" :model="currentEdit" label-width="110px" label-position="right" size="small">
              <div v-for="(item,index) in editHead" :key="index">
                <el-form-item :label="item[Object.keys(item)[0]]+':'" :prop="Object.keys(item)[0]">
                  <el-input v-model="currentEdit[Object.keys(item)[0]]" style="width:300px" disabled />
                </el-form-item>
              </div>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="drawerTree=false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHxStandardItemPage,
  getHxOption,
  getHxOptionForLevel
} from '@/api/huaxiaStandardConfig'
import {
  listConvertTreeH
} from '@/utils/util'
export default {
  name: 'HuaxiaStandardConfig',
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
    codeTypeFilter(val) {
      let res = ''
      switch (val) {
        case 1:
          res = '普通代码'
          break
        case 2:
          res = '多值代码'
          break
        default:
          res = '多级代码'
          break
      }
      return res
    }

  },
  data() {
    return {
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
        codeName: '',
        codeDescription: '',
        version: ''
      },
      loading: false,
      pageInfoInner: {
        total: 0,
        current: 1,
        size: 10
      },
      currentEdit: {
        rspCode: '',
        rspName: '',
        rspStatus: '',
        rspMain: '  '
      },
      editHead: [{ rspCode: '代码名称' }, { rspName: '代码取值' }, { rspStatus: '码值名称' }, { rspMain: '代码含义' }],
      treeData: [],
      drawerDetails: false,
      drawerTree: false,
      drawerTitle: '',
      data: [],
      tableObj: {},
      tableHead: [{ uu: '标准名称' }, { id: '代码取值-数字' }, { type: '代码取值-字母' }, { sttt: '代码名称' }, { a: '测试名称' }],
      innerData: [{ uu: '测试使用1', id: '天1', type: '天朗1', sttt: '天朗气1', a: 'q001' }, { uu: '测试使用2', id: '天2', type: '天朗2', sttt: '天朗气2', a: 'q002' }, { uu: '测试使用3', id: '天3', type: '天朗3', sttt: '天朗气3', a: 'q003' }],
      columns: [{
        title: '码值名称',
        key: 'name',
        minWidth: '300px'
      }]
    }
  },
  mounted: function() {
    this.handleSearch(1)
  },
  methods: {
    handleSearch(val) {
      if (val) {
        this.pageInfo.current = val
      }
      getHxStandardItemPage(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).catch(() => {
        this.$message.error('查询失败 ！')
      })
    },
    handleSearchInner() {
      const params = {
        size: this.pageInfoInner.size,
        current: this.pageInfoInner.current,
        itemCode: this.tableObj.itemCode,
        version: this.tableObj.version
      }
      getHxOption(params).then(res => {
        this.innerData = res.data.innerData.records
        this.pageInfoInner.total = res.data.innerData.total
        this.tableHead = res.data.tableHead
      }).catch(() => {
        this.$message.error('查询失败!')
      })
    },
    handleSearchTree() {
      this.loading = true
      const params = {
        itemCode: this.tableObj.itemCode,
        version: this.tableObj.version
      }
      getHxOptionForLevel(params).then(res => {
        const opt = {
          primaryKey: 'code',
          parentKey: 'parentCode',
          startPid: '0'
        }
        this.treeData = listConvertTreeH(res.data.innerData, opt)
        console.log(this.treeData)
        this.editHead = res.data.tableHead
      }).finally(() => {
        this.loading = false
      })
    },
    rowClick(data) {
      if (data) {
        this.currentEdit = Object.assign({}, data.row)
      }
    },
    handleReset() {
      this.currentEdit = {
        rspCode: '',
        rspName: '',
        rspStatus: '',
        rspMain: '  '
      }
      this.editHead = [{ rspCode: '代码名称' }, { rspName: '代码取值' }, { rspStatus: '码值名称' }, { rspMain: '代码含义' }]
    },
    showDetails(val) {
      this.drawerTitle = val.nameZh + '详情'
      if (val.codeType === '3') {
        this.drawerTree = true
        this.tableObj = val
        this.handleSearchTree()
      } else {
        this.drawerDetails = true
        this.pageInfoInner.current = 1
        this.tableObj = val
        this.handleSearchInner()
      }
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
      this.handleSearchInner()
    },
    handlePageSizeInner(size) {
      this.pageInfoInner.size = size
      this.handleSearchInner()
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
