<template>
  <div>
    <!-- 父表格 -->
    <el-table :data="tableData" max-height="450">
      <el-table-column type="expand">
        <!-- 子表格 -->
        <template slot-scope="props">
          <el-table :data="props.row.configs">
            <el-table-column label="规则名称" prop="describe" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.describe" />
              </template>
            </el-table-column>
            <el-table-column label="规则条件" prop="rulesName" width="180">
              <template slot-scope="scope">
                <!-- 时间选择器 -->
                <el-time-select
                  v-if="props.row.type == 'timezones'"
                  v-model="scope.row.startTime"
                  placeholder="起始时间"
                  style="width:160px;margin-bottom:5px"
                  :picker-options="{
                    start:'08:30',
                    step:'00:15',
                    end:'18:30'}"
                />
                <el-time-select
                  v-if="props.row.type == 'timezones'"
                  v-model="scope.row.endTime"
                  placeholder="结束时间"
                  style="width:160px"
                  :picker-options="{
                    start:'08:30',
                    step:'00:15',
                    end:'18:30',
                    minTime:scope.row.startTime}"
                />
                <!-- 用户标签下拉选择器 -->
                <el-select
                  v-if="props.row.type =='tag'"
                  v-model="scope.row.usertag"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in userOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!-- 节日规则下拉选择器 -->
                <el-select
                  v-if="props.row.type == 'festival'"
                  v-model="scope.row.festival"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in festivalOptions"
                    :key="item.code"
                    :label="item.festivalName"
                    :value="item.code"
                  />
                </el-select>
                <!-- 节气规则下拉选择器 -->
                <el-select
                  v-if="props.row.type == 'solarterms'"
                  v-model="scope.row.solarterms"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in solartermsOptions"
                    :key="item.code"
                    :label="item.solarTermName"
                    :value="item.code"
                  />
                </el-select>
                <!-- 地理位置表单 -->
                <el-form
                  v-if="props.row.type == 'position'"
                  ref="form"
                >
                  <el-form-item label="经度">
                    <el-input v-model="scope.row.longitude" />
                  </el-form-item>
                  <el-form-item label="纬度">
                    <el-input v-model="scope.row.latitude" />
                  </el-form-item>
                  <el-form-item label="半径">
                    <el-input v-model="scope.row.radius" />
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="规则类型" prop="type" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 'timezones'">时区</span>
                <span v-if="scope.row.type === 'tag'">用户标签</span>
                <span v-if="scope.row.type === 'birthday'">生日</span>
                <span v-if="scope.row.type === 'position'">地理位置</span>
                <span v-if="scope.row.type === 'festival'">节日</span>
                <span v-if="scope.row.type === 'solarterms'">节气</span>
                <span v-if="scope.row.type === 'daytime'">日间</span>
              </template>
            </el-table-column>
            <el-table-column label="指定主题" prop="theme" width="180">
              <template slot-scope="scope">
                <el-select v-model="scope.row.theme" placeholder="请选择">
                  <el-option
                    v-for="item in themeOptions"
                    :key="item.themeId"
                    :label="item.themeName"
                    :value="item.themeId"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="优先级" prop="priority" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.priority" style="width:60px" />
              </template>
            </el-table-column>
            <el-table-column label="是否开启" prop="switch" width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.switch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deteleRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="智能规则" prop="describe" />
      <el-table-column label="规则类型" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'timezones'">时区</span>
          <span v-if="scope.row.type === 'tag'">用户标签</span>
          <span v-if="scope.row.type === 'birthday'">生日</span>
          <span v-if="scope.row.type === 'position'">地理位置</span>
          <span v-if="scope.row.type === 'festival'">节日</span>
          <span v-if="scope.row.type === 'solarterms'">节气</span>
          <span v-if="scope.row.type === 'daytime'">日间</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="createRow(scope.row)">新建规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 按钮区域 -->
    <div style="text-align:center;margin-top:20px">
      <el-button type="default" size="small" style="margin-bottom:20px" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  getMagic,
  editMagic,
  getFestivalList,
  getSolarTermList,
  formalList } from '@/api/dynamicPageApi'
export default {
  props: {
    appManageDialogShow: {
      type: Boolean
    }
  },
  data() {
    return {
      tableData: [
        {
          describe: '时间区间规则',
          type: 'timezones',
          configs: [
            // 时间规则条件
            {
              describe: '电商秒杀',
              type: 'timezones',
              theme: 'ATheme',
              priority: '',
              switch: false,
              startTime: '',
              endTime: ''
            }
          ]
        },
        {
          describe: '用户标签规则',
          type: 'tag',
          configs: [
            {
              describe: '',
              type: '',
              theme: '',
              priority: '',
              switch: '',
              usertag: ''
            }
          ]
        },
        {
          describe: '生日规则',
          type: 'position',
          configs: [
            {
              describe: '',
              type: '',
              theme: '',
              priority: '',
              switch: ''
            }
          ]
        },
        {
          describe: '地理围栏规则',
          type: 'position',
          configs: [
            {
              describe: '',
              type: '',
              theme: '',
              priority: '',
              switch: '',
              latitude: '',
              longitude: '',
              radius: ''
            }
          ]
        },
        {
          describe: '节日',
          type: 'festival',
          configs: [
            {
              describe: '',
              type: '',
              theme: '',
              priority: '',
              switch: '',
              festival: ''
            }
          ]
        },
        {
          describe: '节气',
          type: 'solarterms',
          configs: [
            {
              describe: '',
              type: '',
              solarterms: '',
              theme: '',
              priority: '',
              switch: '',
              festival: ''
            }
          ]
        }
      ],
      userOptions: [],
      controlOptions: [],
      festivalOptions: [{ code: '', festivalName: '' }],
      solartermsOptions: [{ code: '', solarTermName: '' }],
      themeOptions: [
        {
          themeId: '',
          themeName: ''
        }
      ]
    }
  },
  created() {
    // 获取app智能规则
    this.getMagicRules()
    // 获取节日列表
    this.getFesRulesList()
    // 获取节气列表
    this.getSolarRulesList()
    // 获取发布皮肤列表
    this.getFormalList()
  },
  methods: {
    getMagicRules() {
      // 获取app智能规则
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId
      }
      getMagic(params).then((res) => {
        console.log(111, res)
        if (res.returnCode === '000000') {
          this.tableData = res.data
          this.tableData[0].configs = res.data[0].configs
          this.tableData[1].configs = res.data[1].configs
          this.tableData[2].configs = res.data[2].configs
          this.tableData[3].configs = res.data[3].configs
          this.tableData[4].configs = res.data[4].configs
          this.tableData[5].configs = res.data[5].configs
          this.tableData[6].configs = res.data[6].configs
        }
      })
    },
    // 保存编辑智能规则
    handleSave() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        magicJson: JSON.stringify(this.tableData)
      }
      editMagic(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('保存成功')
          this.$emit('update:appManageDialogShow', false)
          this.getMagicRules()
        }
      })
    },
    // 获取节日规则名称列表
    getFesRulesList() {
      getFestivalList().then(res => {
        console.log(res, '$$$$$$$$$$$$$$$')
        if (res.returnCode === '000000') {
          this.festivalOptions = res.data
        }
      })
    },
    // 获取节气规则名称列表
    getSolarRulesList() {
      getSolarTermList().then(res => {
        console.log(res, '节气列表')
        if (res.returnCode === '000000') {
          this.solartermsOptions = res.data
        }
      })
    },
    // 获取指定主题皮肤列表
    getFormalList() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId
      }
      formalList(params).then(res => {
        console.log(res, '**发布皮肤列表**')
        this.themeOptions = res.data
      })
    },
    createRow(item) { // 新建智能规则
      console.log(item, '1111111111111')
      if (item.type === 'timezones') {
        var newRowTimeList = {
          describe: '',
          endtime: '',
          priority: '',
          starttime: '',
          switch: '',
          theme: '',
          type: 'timezones'
        }
        item.configs.push(newRowTimeList)
      }
      if (item.type === 'tag') {
        var newRowUserList = {
          describe: '',
          priority: '',
          switch: '',
          theme: '',
          type: 'tag',
          usertag: ''
        }
        item.configs.push(newRowUserList)
      }
      if (item.type === 'birthday') {
        var newRowBirthdayList = {
          describe: '',
          priority: '',
          switch: '',
          theme: '',
          type: 'birthday'
        }
        item.configs.push(newRowBirthdayList)
      }
      if (item.type === 'position') {
        var newRowPositionList = {
          describe: '',
          latitude: '',
          longitude: '',
          radius: '',
          priority: '',
          switch: '',
          theme: '',
          type: 'position'
        }
        item.configs.push(newRowPositionList)
      }
      if (item.type === 'festival') {
        var newRowFestivalList = {
          describe: '',
          festival: '',
          priority: '',
          switch: '',
          theme: '',
          type: 'festival'
        }
        item.configs.push(newRowFestivalList)
      }
      if (item.type === 'solarterms') {
        var newRowSolartermsList = {
          describe: '',
          solarterms: '',
          priority: '',
          switch: '',
          theme: '',
          type: 'solarterms'
        }
        item.configs.push(newRowSolartermsList)
      }
      if (item.type === 'daytime') {
        var newRowDaytimeList = {
          describe: '',
          priority: '',
          switch: '',
          theme: '',
          type: 'daytime'
        }
        item.configs.push(newRowDaytimeList)
      }
    },
    // 删除智能规则
    deteleRow(index) {
      this.$confirm('确定删除该规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].configs.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    goBack() {
      this.$emit('update:appManageDialogShow', false)
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
