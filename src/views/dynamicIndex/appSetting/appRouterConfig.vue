<template>
  <div>
    <!-- 按钮 -->
    <div>
      <el-button type="primary" style="width:150px;margin-bottom:20px" size="small">同步组件库路由配置</el-button>
    </div>
    <!-- 表格信息区域style="margin:0px 30px 40px 50px" -->
    <div>
      <el-table
        :data="routerTableData"
        style="width:100%"
        class="routerTable"
        border
        :cell-style="cellstyle"
        :header-cell-style="rowClass"
        size="small"
      >
        <el-table-column prop="id" label="路由ID" width="150px" />
        <el-table-column prop="name" label="路由名称" width="150px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column prop="target" label="URL" width="210px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.target" placeholder="地址" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="跳转类型" width="150px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择跳转类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="node" label="目标类型" width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.node" placeholder="请选择目标类型">
              <el-option
                v-for="item in nodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column label="参数{json}格式" prop="param" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.param" placeholder="请输入json格式的参数" type="textarea" />
          </template>
        </el-table-column> -->
        <el-table-column label="是否需要登录" prop="isneedLogin">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isneedlogin"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleSaveRouter(scope.row)">保存</el-button>
            <el-button type="text" size="small" @click="handleDeleteRouter(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" style="margin-bottom:20px">
        <el-pagination
          background
          :current-page="routerPage.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="routerPage.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="routerPage.total"
          @size-change="handlePageSize"
          @current-change="handlePage"
        />
      </el-col>
    </div>
    <!-- 底部按钮区域 -->
    <div style="text-align:center">
      <!-- <el-button size="small" style="margin-bottom:20px" @click="handleResetForm('')">重置</el-button> -->
      <el-button type="primary" size="small" style="margin-bottom:20px" @click="goBack">返回</el-button>
    </div>
  </div>
</template>
<script>
import { routerList, deleteRouter, editRouter } from '@/api/dynamicPageApi'
export default {
  props: {
    appRouterDialogShow: {
      type: Boolean
    }
  },
  data() {
    return {
      routerTableData: [
        {
          id: '',
          name: '',
          target: '',
          type: '',
          node: '',
          param: '',
          isneedlogin: false
        }
      ],
      routerPage: {
        total: 0,
        page: 1,
        limit: 10
      },
      typeOptions: [
        { value: 'pushroot', label: 'pushroot' },
        { value: 'pushtab', label: 'pushtab' },
        { value: 'parentroot', label: 'parentroot' },
        { value: 'parenttab', label: 'parenttab' }
      ],
      nodeOptions: [
        { value: 'LocalWeb', label: 'LocalWeb' },
        { value: 'RemoteWeb', label: 'RemoteWeb' },
        { value: 'ContainerLocalWeb', label: 'ContainerLocalWeb' },
        { value: 'ContainerRemoteWeb', label: 'ContainerRemoteWeb' },
        { value: 'OfflinePackage', label: 'OfflinePackage' },
        { value: 'Native', label: 'Native' },
        { value: 'Custom', label: 'Custom' }
      ]
    }
  },
  created() {
    // 获取路由列表
    this.getRouterList()
  },
  methods: {
    // 获取路由列表
    getRouterList() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        current: this.routerPage.page,
        size: this.routerPage.limit
      }
      routerList(params).then((res) => {
        console.log(res, '路由列表')
        if (res.returnCode === '000000') {
          // const data = res.data.records.map((item) => {
          //   const obj = item
          //   obj.param = JSON.stringify(obj.param)
          //   return obj
          // })
          this.routerTableData = res.data.records
          this.routerPage.total = res.data.total * 1
        }
      })
    },
    // 路由信息编辑保存
    handleSaveRouter(item) {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        routerId: item.id,
        routerJson: JSON.stringify({
          id: item.id,
          name: item.name,
          target: item.target,
          type: item.type,
          node: item.node,
          isneedlogin: item.isneedlogin
          // param: JSON.parse(item.param)
        })
      }
      editRouter(params).then((res) => {
        console.log(res, '************')
        if (res.returnCode === '000000') {
          this.$message.success('保存成功')
          this.getRouterList()
        }
      })
    },
    // 删除路由
    handleDeleteRouter(item) {
      console.log(222, item)
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        routerId: item.id
      }
      this.$confirm('确定删除该路由吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRouter(params)
            .then((res) => {
              console.log(res)
              if (res.returnCode === '000000') {
                this.$message.success('删除成功!')
                this.getRouterList()
              } else {
                this.$message.error('删除失败')
              }
            })
            .finally((res) => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    goBack() {
      this.$emit('update:appRouterDialogShow', false)
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
    },
    /**
     * @description 设置el-table内容居中
     */
    cellstyle() {
      return 'text-align:center'
    },
    /**
     * @description 设置el-table表头居中
     */
    rowClass() {
      return 'background:#ffffff;color:#515a6e;text-align:center'
    },
    handlePage(current) {
      this.routerPage.page = current
    },
    handlePageSize(size) {
      this.routerPage.limit = size
    }
  }
}
</script>
<style lang="scss" scoped>
.routerTable {
  // min-height: 50px;
  // max-height: 350px;
  // overflow-y: auto;
}
</style>
