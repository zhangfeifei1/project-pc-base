<template>
  <div>
    <el-card shadow="always">
      <!-- <el-form ref="searchForm" :model="pageInfo" inline label-width="120px" size="small" class="demo-form-inline form-btn-box">
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>
          <el-button
            :disabled="hasAuthority('systemApiEdit')?false:true"
            class="search-btn"
            type="primary"
            @click="handleAdd()"
          >
            <span>添加</span>
          </el-button>
        </el-form-item>
      </el-form> -->

      <el-table border :data="data" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <!-- <el-table-column prop="namespace" label="命名空间" width="150">
          <template #header>
            <span>命名空间</span>
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
        </el-table-column> -->
        <el-table-column prop="dataId" label="dataId" width="200">
          <template #header>
            <span>dataId</span>
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
        <el-table-column prop="nacosGroup" label="Group" width="200">
          <template #header>
            <span>Group</span>
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
        <el-table-column prop="databaseTable" label="数据库表" width="200">
          <template #header>
            <span>数据库表</span>
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
        <el-table-column prop="nacosKey" label="配置项key" width="150">
          <template #header>
            <span>配置项key</span>
            <div class="sort-div" @click="sortTable('nacos_key')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='nacos_key'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='nacos_key'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fields" label="配置字段集合" width="300">
          <template #header>
            <span>配置字段集合</span>
            <div class="sort-div" @click="sortTable('fields')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='fields'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='fields'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template #header>
            <span>状态</span>
            <div class="sort-div" @click="sortTable('status')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='status'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='status'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='1'" type="success">已与数据库同步</el-tag>
            <el-tag v-if="scope.row.status==='0'" type="danger">未与数据库同步</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" style="margin-right:15px" @click="openDrawer(scope.row)">编辑</a>
            <!-- <a class="linkfont" style="margin-right:15px" @click="handleRemove(scope.row)">删除</a> -->
            <a class="linkfont" @click="handleRefresh(scope.row)">刷新</a>
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
    <el-dialog width="60%" top="100px" :visible.sync="drawerAdd" title="添加验证标准" :show-close="false">
      <div style="margin-left:40px">
        <template>
          <el-form ref="addForm" :model="currentAdd" label-width="130px" label-position="right" :rules="ruleValidate" size="small">
            <!-- <el-form-item label="命名空间：" prop="namespace">
              <el-input v-model="currentAdd.namespace" placeholder="请输入命名空间" style="width:500px" />
            </el-form-item> -->
            <el-form-item label="dataId：" prop="dataId">
              <el-input v-model="currentAdd.dataId" placeholder="请输入dataId" style="width:500px" />
            </el-form-item>
            <el-form-item label="Group：" prop="nacosGroup">
              <el-input v-model="currentAdd.nacosGroup" placeholder="请输入group" style="width:500px" />
            </el-form-item>
            <el-form-item label="是否拼接dataId：" prop="isPrefixDataId">
              <el-radio-group v-model="currentAdd.isPrefixDataId">
                <el-radio label="0">不拼接</el-radio>
                <el-radio label="1">拼接</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="数据库表：" prop="databaseTable">
              <el-select
                v-model="currentAdd.databaseTable"
                style="width:500px"
                placeholder="请选择"
                @change="dataTableChange()"
              >
                <el-option
                  v-for="item in databaseTableOptions"
                  :key="item.tableName"
                  :label="item.tableName"
                  :value="item.tableName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配置项key：" prop="nacosKey">
              <el-select v-model="currentAdd.nacosKey" style="width:500px" placeholder="请选择" @change="nacosKeyChange()">
                <el-option
                  v-for="item in nacosKeyOptions"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="格式：" prop="type">
              <el-radio-group v-model="currentAdd.type" @change="addTypeChange()">
                <el-radio label="0">Json</el-radio>
                <el-radio label="1">key-value</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="currentAdd.type=='0'" ref="add1" label="配置字段集合：" prop="fields">
              <el-select v-model="currentAdd.fields" multiple style="width:500px" placeholder="请选择">
                <el-option
                  v-for="item in nacosKeyOptions1"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-show="currentAdd.type=='1'" ref="add2" label="配置字段：" prop="field">
              <el-select v-model="currentAdd.field" style="width:500px" placeholder="请选择">
                <el-option
                  v-for="item in nacosKeyOptions2"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
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
    <el-dialog width="60%" top="100px" :visible.sync="drawerEdit" title="编辑验证标准" :show-close="true">
      <div style="margin-left:40px">
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="130px" label-position="right" :rules="ruleValidate" size="small">
            <!-- <el-form-item label="命名空间：" prop="namespace">
              <el-input v-model="currentEdit.namespace" placeholder="请输入命名空间" style="width:500px" />
            </el-form-item> -->
            <el-form-item label="dataId：" prop="dataId">
              <el-input v-model="currentEdit.dataId" placeholder="请输入dataId" style="width:500px" />
            </el-form-item>
            <el-form-item label="Group：" prop="nacosGroup">
              <el-input v-model="currentEdit.nacosGroup" placeholder="请输入group" style="width:500px" />
            </el-form-item>
            <el-form-item label="是否拼接dataId：" prop="isPrefixDataId">
              <el-radio-group v-model="currentEdit.isPrefixDataId">
                <el-radio label="0">不拼接</el-radio>
                <el-radio label="1">拼接</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="数据库表：" prop="databaseTable">
              <el-select
                v-model="currentEdit.databaseTable"
                style="width:500px"
                placeholder="请选择"
                @change="dataTableChange1()"
              >
                <el-option
                  v-for="item in databaseTableOptions"
                  :key="item.tableName"
                  :label="item.tableName"
                  :value="item.tableName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配置项key：" prop="nacosKey">
              <el-select v-model="currentEdit.nacosKey" style="width:500px" placeholder="请选择" @change="nacosKeyChange1()">
                <el-option
                  v-for="item in nacosKeyOptions"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="格式：" prop="type">
              <el-radio-group v-model="currentEdit.type" @change="editTypeChange()">
                <el-radio label="0">Json</el-radio>
                <el-radio label="1">key-value</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="currentEdit.type=='0'" ref="edit1" label="配置字段集合：" prop="fields">
              <el-select v-model="currentEdit.fields" multiple style="width:500px" placeholder="请选择">
                <el-option
                  v-for="item in nacosKeyOptions1"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-show="currentEdit.type=='1'" ref="edit2" label="配置字段：" prop="field">
              <el-select v-model="currentEdit.field" style="width:500px" placeholder="请选择">
                <el-option
                  v-for="item in nacosKeyOptions2"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
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
  </div>
</template>

<script>
import {
  getDynamicPage,
  getTables,
  getColumnNames,
  refresh,
  deleteById,
  save,
  edit
} from '@/api/dynamicApi'
export default {
  name: 'Dynamic',
  data() {
    return {
      databaseTableOptions: [],
      nacosKeyOptions: [],
      nacosKeyOptions1: [],
      nacosKeyOptions2: [],
      drawerEdit: false,
      drawerAdd: false,
      currentRefresh: {
        examine_type: 'refresh', // 用于审核样式
        namespace: '',
        dataId: '',
        nacosGroup: '',
        databaseTable: '',
        nacosKey: '',
        fields: [],
        field: '',
        isPrefixDataId: '',
        type: '0',

        namespace_Old: '',
        dataId_Old: '',
        nacosGroup_Old: '',
        databaseTable_Old: '',
        nacosKey_Old: '',
        fields_Old: [],
        field_Old: '',
        isPrefixDataId_Old: '',
        type_Old: '0',

        namespace_Dec: '命名空间',
        dataId_Dec: 'dataId',
        nacosGroup_Dec: 'group',
        databaseTable_Dec: '数据库表',
        nacosKey_Dec: '配置项key',
        fields_Dec: '配置字段集合',
        field_Dec: '配置字段',
        isPrefixDataId_Dec: '是否拼接dataId',
        type_Dec: '格式'
      },
      currentEdit: {
        examine_type: 'edit', // 用于审核样式
        namespace: '',
        dataId: '',
        nacosGroup: '',
        databaseTable: '',
        nacosKey: '',
        fields: [],
        field: '',
        isPrefixDataId: '',
        type: '0',

        namespace_Old: '',
        dataId_Old: '',
        nacosGroup_Old: '',
        databaseTable_Old: '',
        nacosKey_Old: '',
        fields_Old: [],
        field_Old: '',
        isPrefixDataId_Old: '',
        type_Old: '0',

        namespace_Dec: '命名空间',
        dataId_Dec: 'dataId',
        nacosGroup_Dec: 'group',
        databaseTable_Dec: '数据库表',
        nacosKey_Dec: '配置项key',
        fields_Dec: '配置字段集合',
        field_Dec: '配置字段',
        isPrefixDataId_Dec: '是否拼接dataId',
        type_Dec: '格式'
      },
      currentAdd: {
        examine_type: 'add', // 用于审核样式
        namespace: '',
        dataId: '',
        nacosGroup: '',
        databaseTable: '',
        nacosKey: '',
        fields: [],
        field: '',
        isPrefixDataId: '',
        type: '0',

        namespace_Dec: '命名空间',
        dataId_Dec: 'dataId',
        nacosGroup_Dec: 'group',
        databaseTable_Dec: '数据库表',
        nacosKey_Dec: '配置项key',
        fields_Dec: '配置字段集合',
        field_Dec: '配置字段',
        isPrefixDataId_Dec: '是否拼接dataId',
        type_Dec: '格式'
      },
      currentDel: {
        examine_type: 'delete', // 用于审核样式
        namespace: '',
        dataId: '',
        nacosGroup: '',
        databaseTable: '',
        nacosKey: '',
        fields: [],
        field: '',
        isPrefixDataId: '',
        type: '0',

        namespace_Old: '',
        dataId_Old: '',
        nacosGroup_Old: '',
        databaseTable_Old: '',
        nacosKey_Old: '',
        fields_Old: [],
        field_Old: '',
        isPrefixDataId_Old: '',
        type_Old: '0',

        namespace_Dec: '命名空间',
        dataId_Dec: 'dataId',
        nacosGroup_Dec: 'group',
        databaseTable_Dec: '数据库表',
        nacosKey_Dec: '配置项key',
        fields_Dec: '配置字段集合',
        field_Dec: '配置字段',
        isPrefixDataId_Dec: '是否拼接dataId',
        type_Dec: '格式'
      },
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        sortField: '',
        sortFieldValue: ''
      },
      ruleValidate: {
        dataId: [{
          required: true,
          message: 'dataId不能为空！',
          trigger: 'blur'
        }],
        nacosGroup: [{
          required: true,
          message: 'Group不能为空！',
          trigger: 'blur'
        }],
        databaseTable: [{
          required: true,
          message: '数据库表不能为空！',
          trigger: 'change'
        }],
        nacosKey: [{
          required: true,
          message: '配置项key不能为空！',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '格式不能为空！',
          trigger: 'change'
        }]
      },
      data: [{}]
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
      getDynamicPage(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
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
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
      this.currentAdd = {
        examine_type: 'add', // 用于审核样式
        namespace: '',
        dataId: '',
        nacosGroup: '',
        databaseTable: '',
        nacosKey: '',
        fields: [],
        field: '',
        isPrefixDataId: '',
        type: '0',

        namespace_Dec: '命名空间',
        dataId_Dec: 'dataId',
        nacosGroup_Dec: 'group',
        databaseTable_Dec: '数据库表',
        nacosKey_Dec: '配置项key',
        fields_Dec: '配置字段集合',
        field_Dec: '配置字段',
        isPrefixDataId_Dec: '是否拼接dataId',
        type_Dec: '格式'
      }
      this.databaseTableOptions = []
      this.nacosKeyOptions = []
      this.nacosKeyOptions1 = []
      this.nacosKeyOptions2 = []
      getTables({}).then(res => {
        // debugger
        this.databaseTableOptions = JSON.parse(JSON.stringify(res.data.data))
      }).finally(() => {})
    },
    openDrawer(data) {
      this.drawerEdit = true
      this.databaseTableOptions = []
      this.nacosKeyOptions = []
      this.nacosKeyOptions1 = []
      this.nacosKeyOptions2 = []
      // this.currentEdit = JSON.parse(JSON.stringify(data))
      this.setExamineData(data, 'currentEdit', ['_Old'])
      if (this.currentEdit.type === '0') {
        this.$set(this.currentEdit, 'fields', this.currentEdit.fields.split(','))
        this.$set(this.currentEdit, 'field', '')
      }
      if (this.currentEdit.type === '1') {
        this.$set(this.currentEdit, 'field', JSON.parse(JSON.stringify(data)).fields)
        this.$set(this.currentEdit, 'fields', [])
      }
      getTables({}).then(res => {
        // debugger
        this.databaseTableOptions = JSON.parse(JSON.stringify(res.data.data))
      }).finally(() => {})
      const params = {
        tableName: this.currentEdit.databaseTable
      }
      getColumnNames(params).then(res => {
        this.nacosKeyOptions = JSON.parse(JSON.stringify(res.data.data))
      }).finally(() => {
        // debugger
        this.nacosKeyOptions.forEach(v => {
          if (v.columnName !== this.currentEdit.nacosKey) {
            this.nacosKeyOptions1.push(v)
            this.nacosKeyOptions2.push(v)
          }
        })
      })
    },
    addTypeChange() {
      if (this.currentAdd.type === '0') {
        this.$set(this.currentAdd, 'fields', [])
        this.$set(this.currentAdd, 'field', '')
        this.ruleValidate = {
          dataId: [{
            required: true,
            message: 'dataId不能为空！',
            trigger: 'blur'
          }],
          nacosGroup: [{
            required: true,
            message: 'Group不能为空！',
            trigger: 'blur'
          }],
          databaseTable: [{
            required: true,
            message: '数据库表不能为空！',
            trigger: 'change'
          }],
          nacosKey: [{
            required: true,
            message: '配置项key不能为空！',
            trigger: 'change'
          }],
          fields: [{
            required: true,
            message: '配置字段集合不能为空！',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '格式不能为空！',
            trigger: 'change'
          }]
        }
      }
      if (this.currentAdd.type === '1') {
        this.$set(this.currentAdd, 'fields', [])
        this.$set(this.currentAdd, 'field', '')
        this.ruleValidate = {
          dataId: [{
            required: true,
            message: 'dataId不能为空！',
            trigger: 'blur'
          }],
          nacosGroup: [{
            required: true,
            message: 'Group不能为空！',
            trigger: 'blur'
          }],
          databaseTable: [{
            required: true,
            message: '数据库表不能为空！',
            trigger: 'change'
          }],
          nacosKey: [{
            required: true,
            message: '配置项key不能为空！',
            trigger: 'change'
          }],
          field: [{
            required: true,
            message: '配置字段不能为空！',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '格式不能为空！',
            trigger: 'change'
          }]
        }
      }
    },
    editTypeChange() {
      if (this.currentEdit.type === '0') {
        this.$set(this.currentEdit, 'fields', [])
        this.$set(this.currentEdit, 'field', '')
        this.ruleValidate = {
          dataId: [{
            required: true,
            message: 'dataId不能为空！',
            trigger: 'blur'
          }],
          nacosGroup: [{
            required: true,
            message: 'Group不能为空！',
            trigger: 'blur'
          }],
          databaseTable: [{
            required: true,
            message: '数据库表不能为空！',
            trigger: 'change'
          }],
          nacosKey: [{
            required: true,
            message: '配置项key不能为空！',
            trigger: 'change'
          }],
          fields: [{
            required: true,
            message: '配置字段集合不能为空！',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '格式不能为空！',
            trigger: 'change'
          }]
        }
      }
      if (this.currentEdit.type === '1') {
        this.$set(this.currentEdit, 'fields', [])
        this.$set(this.currentEdit, 'field', '')
        this.ruleValidate = {
          dataId: [{
            required: true,
            message: 'dataId不能为空！',
            trigger: 'blur'
          }],
          nacosGroup: [{
            required: true,
            message: 'Group不能为空！',
            trigger: 'blur'
          }],
          databaseTable: [{
            required: true,
            message: '数据库表不能为空！',
            trigger: 'change'
          }],
          nacosKey: [{
            required: true,
            message: '配置项key不能为空！',
            trigger: 'change'
          }],
          field: [{
            required: true,
            message: '配置字段集合不能为空！',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '格式不能为空！',
            trigger: 'change'
          }]
        }
      }
    },
    dataTableChange() {
      this.currentAdd.nacosKey = ''
      this.addTypeChange()
      this.nacosKeyOptions = []
      this.nacosKeyOptions1 = []
      this.nacosKeyOptions2 = []
      const params = {
        tableName: this.currentAdd.databaseTable
      }
      getColumnNames(params).then(res => {
        this.nacosKeyOptions = JSON.parse(JSON.stringify(res.data.data))
      }).finally(() => {})
    },
    dataTableChange1() {
      this.currentEdit.nacosKey = ''
      this.editTypeChange()
      this.nacosKeyOptions = []
      this.nacosKeyOptions1 = []
      this.nacosKeyOptions2 = []
      const params = {
        tableName: this.currentEdit.databaseTable
      }
      getColumnNames(params).then(res => {
        this.nacosKeyOptions = JSON.parse(JSON.stringify(res.data.data))
      }).finally(() => {})
    },
    nacosKeyChange() {
      this.addTypeChange()
      this.nacosKeyOptions1 = []
      this.nacosKeyOptions2 = []
      this.nacosKeyOptions.forEach(v => {
        if (v.columnName !== this.currentAdd.nacosKey) {
          this.nacosKeyOptions1.push(v)
          this.nacosKeyOptions2.push(v)
        }
      })
    },
    nacosKeyChange1() {
      this.editTypeChange()
      this.nacosKeyOptions1 = []
      this.nacosKeyOptions2 = []
      this.nacosKeyOptions.forEach(v => {
        if (v.columnName !== this.currentEdit.nacosKey) {
          this.nacosKeyOptions1.push(v)
          this.nacosKeyOptions2.push(v)
        }
      })
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.currentEdit.type === '0') {
            let str = ''
            this.currentEdit.fields.forEach(v => {
              str = str + v + ','
            })
            str = str.substring(0, str.length - 1)
            this.currentEdit.fields = str
          }
          // const params = {
          //   id: this.currentEdit.id,
          //   namespace: this.currentEdit.namespace,
          //   dataId: this.currentEdit.dataId,
          //   nacosGroup: this.currentEdit.nacosGroup,
          //   databaseTable: this.currentEdit.databaseTable,
          //   nacosKey: this.currentEdit.nacosKey,
          //   isPrefixDataId: this.currentEdit.isPrefixDataId,
          //   type: this.currentEdit.type
          // }
          const params = this.currentEdit
          if (params.type === '0') {
            this.$set(params, 'fields', this.currentEdit.fields)
          }
          if (params.type === '1') {
            this.$set(params, 'fields', this.currentEdit.field)
          }

          edit(params).then(res => {
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
          if (this.currentAdd.type === '0') {
            let str = ''
            this.currentAdd.fields.forEach(v => {
              str = str + v + ','
            })
            str = str.substring(0, str.length - 1)
            this.currentAdd.fields = str
          }
          // const params = {
          //   namespace: this.currentAdd.namespace,
          //   dataId: this.currentAdd.dataId,
          //   nacosGroup: this.currentAdd.nacosGroup,
          //   databaseTable: this.currentAdd.databaseTable,
          //   nacosKey: this.currentAdd.nacosKey,
          //   isPrefixDataId: this.currentAdd.isPrefixDataId,
          //   type: this.currentAdd.type
          // }
          const params = this.currentAdd
          if (params.type === '0') {
            this.$set(params, 'fields', this.currentAdd.fields)
          }
          if (params.type === '1') {
            this.$set(params, 'fields', this.currentAdd.field)
          }
          save(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
              this.drawerAdd = false
            }
            this.handleSearch()
          }).catch(() => {
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
        deleteById(this.currentDel).then(res => {
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
    handleRefresh(data) {
      this.setExamineData(data, 'currentRefresh', ['_Old'])
      this.$confirm('确定刷新动态配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refresh(this.currentRefresh).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '刷新动态配置成功'
            })
          }
          this.handleSearch()
        }).catch(() => {
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消刷新'
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
