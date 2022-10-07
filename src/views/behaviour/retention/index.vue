<template>
  <div class="bg">
    <div class="search">
      <el-select v-model="version" size="small" style="width: 180px">
        <el-option
          v-for="item in versions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="channel" size="small" style="width: 180px">
        <el-option
          v-for="item in channels"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="range" size="small" style="width: 220px">
        <el-option
          v-for="item in ranges"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table :data="data" :loading="loading" size="small">
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="addUser" label="新增用户" />
      <el-table-column prop="firstDay" label="第1天" width="100" />
      <el-table-column prop="secondDay" label="第2天" width="100" />
      <el-table-column prop="thirdDay" label="第3天" width="100" />
      <el-table-column prop="fourthDay" label="第4天" width="100" />
      <el-table-column prop="fivthDay" label="第5天" width="100" />
      <el-table-column prop="sixthDay" label="第6天" width="100" />
      <el-table-column prop="seventhDay" label="第7天" width="100" />
      <el-table-column prop="fourtythDay" label="第14天" width="100" />
      <el-table-column prop="thirdtythDay" label="第30天" width="100" />
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      version: '选项一',
      channel: '选项一',
      range: '选项一',
      versions: [
        {
          value: '选项一',
          label: '全版本'
        }
      ],
      channels: [
        {
          value: '选项一',
          label: '全渠道'
        }
      ],
      ranges: [
        {
          value: '选项一',
          label: '最近7天'
        },
        {
          value: '选项二',
          label: '最近15天'
        },
        {
          value: '选项三',
          label: '最近30天'
        }
      ],
      data: []
    }
  }
}
</script>
<style lang="less">
    .bg{
        margin: 20px;
        background: #ffffff;
    }
    .search{
        padding: 20px;
        border-bottom: 1px solid #eeeeee;
    }
    .el-table th{
        background: #fcfcfc;
    }
</style>
