<template>
  <div class="bg">
    <div class="search">
      <el-select v-model="channel" size="small" style="width: 180px">
        <el-option
          v-for="item in channels"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="version" size="small" style="width: 180px">
        <el-option
          v-for="item in versions"
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
    <div class="show">
      <div class="right">
        <span class="graytext">新增用户</span>
        <span class="graytext">使用用户</span>
        <span class="graytext">启动次数</span>
      </div>
      <div class="blacktext1" style="margin: auto;">暂时没有相关渠道数据</div>
    </div>
    <div>
      <div class="allEdition">
        <span class="blacktext1">所有渠道数据概览</span>
        <span class="graytext">版本：{{ version }}</span>
        <span class="graytext">时间范围：{{ range }}</span>
      </div>
      <div class="subHead">
        <div class="blacktext1">应用渠道</div>
        <div class="right">
          <span class="blacktext1">累计新增用户</span>
          <span class="blacktext1">新增占比</span>
          <span class="blacktext1">累计启动次数</span>
        </div>
      </div>
      <div class="subshow" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
      ]
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
    .listHead{
        position: relative;
        background: #fcfcfc;
        border-bottom: 1px solid #eeeeee;
        height: 50px;
        padding-left: 3px;
        .right{
            height: 18px;
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .graytext{
        color: #888888;
        font-size: 12px;
        line-height: 14px;
        padding: 0 10px;
    }
    .blacktext1{
        color:#333333;
        font-size: 13px;
        line-height: 15px;
        padding: 0 20px;
    }
    .button{
        float: left;
        width: fit-content;
        padding: 10px 20px;
        color:#333333;
        font-size: 13px;
        line-height: 15px;
        background: #ffffff;
        border: 1px solid #eeeeee;
        margin-top: 6px;
    }
    .show{
        position: relative;
        display: flex;
        height: 300px;
        padding-top: 50px;
        text-align: center;
        .right{
            position: absolute;
            right: 20px;
            top: 13px;
        }
    }
    .allEdition{
        border-top: 1px solid #eeeeee;
        padding: 15px 0;
    }
    .subHead{
        position: relative;
        background: #fcfcfc;
        border-top: 1px solid #eeeeee;
        border-bottom: 1px solid #eeeeee;
        padding: 12px 0;
        .right{
            height: 18px;
            position: absolute;
            right: 10px;
            bottom: 11px;
        }
    }
    .subshow{
        min-height: 200px;
    }
</style>
