<template>
  <div class="body">
    <div class="bg">
      <div class="subtitle">
        <span>{{ date | formatDate }}</span>
      </div>
      <div class="head">
        <div class="box1">
          <div class="blacktext1">使用用户</div>
          <div class="black">{{ user }}</div>
          <!-- <div class="graytext">昨日{{ yesterdayUser }}</div> -->
        </div>
        <div class="box1">
          <div class="blacktext1">启动次数</div>
          <div class="black">{{ start }}</div>
          <!-- <div class="graytext">昨日{{ yesterdayStart }}</div> -->
        </div>
        <div class="box1">
          <div class="blacktext1">安装用户</div>
          <div class="black">{{ install }}</div>
          <!-- <div class="graytext">昨日{{ yesterdayInstall }}</div> -->
        </div>
      </div>
    </div>
    <div class="bg">
      <div class="search">趋势图</div>
      <div class="chart1">
        <div class="right1">
          <el-button type="text" size="small" @click="getUserEchart">使用用户</el-button>
          <el-button type="text" size="small" @click="getStartEchart">启动次数</el-button>
          <el-button type="text" size="small" @click="getInstalltEchart">安装用户</el-button>
        </div>
        <div v-show="showUserEchart" ref="echartUser" class="main" />
        <div v-show="showStartEchart" ref="echartStart" class="main" />
        <div v-show="showInstallEchart" ref="echartInstall" class="main" />
      </div>
    </div>
  </div>
</template>
<script>
import { getOperationInfo } from '@/api/behavior'
import echarts from 'echarts'
export default {
  filters: {
    formatDate: function(val) {
      var currdate = new Date(val)
      var year = currdate.getFullYear()
      var month = currdate.getMonth() + 1
      var day = currdate.getDate()
      var hours = currdate.getHours()
      var minutes = currdate.getMinutes()
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
    }
  },
  data() {
    return {
      date: '11',
      // yesterday: '',
      user: '',
      start: '',
      install: '',
      // yesterdayUser: '',
      // yesterdayStart: '',
      // yesterdayInstall: '',
      showUserEchart: true,
      showStartEchart: false,
      showInstallEchart: false,
      xArrUser: [],
      yArrUser: [],
      xArrStart: [],
      yArrStart: [],
      xArrInstall: [],
      yArrInstall: [],
      countUser: [],

      countStart: [],
      countInstall: []
    }
  },
  created: function() {
    this.date = new Date()
  },
  mounted() {
    getOperationInfo().then(res => {
      if (res.returnCode === '000000') {
        console.log(res, '运营概览')
        // console.log(res.data, '运营概览1111111111111')
        // console.log(res.data.user, '运营概览用户')
        this.xArrUser = []
        this.yArrUser = []
        this.countUser = res.data.user
        for (var i = 0; i < this.countUser.length; i++) {
          this.xArrUser.push(this.countUser[i].logTime)
          this.yArrUser.push(this.countUser[i].count)
        }
        this.getUserEchart()
        this.xArrStart = []
        this.yArrStart = []
        this.countStart = res.data.start
        for (var j = 0; j < this.countStart.length; j++) {
          this.xArrStart.push(this.countStart[j].logTime)
          this.yArrStart.push(this.countStart[j].count)
        }
        this.xArrInstall = []
        this.yArrInstall = []
        this.countInstall = res.data.install
        for (var k = 0; k < this.countInstall.length; k++) {
          this.xArrInstall.push(this.countInstall[k].logTime)
          this.yArrInstall.push(this.countInstall[k].count)
        }
        // var length = res.data.user.length - 1
        this.user = (res.data.user[0].count) * 1 + res.data.user[1].count + res.data.user[2].count + res.data.user[3].count + res.data.user[4].count + res.data.user[5].count + res.data.user[6].count
        this.start = (res.data.start[0].count) * 1 + res.data.start[1].count + res.data.start[2].count + res.data.start[3].count + res.data.start[4].count + res.data.start[5].count + res.data.start[6].count
        this.install = (res.data.install[0].count) * 1 + res.data.install[1].count + res.data.install[2].count + res.data.install[3].count + res.data.install[4].count + res.data.install[5].count + res.data.install[6].count
      }
    })
  },
  methods: {
    getUserEchart() { // 使用用户（将图展示并进行图表赋值）
      this.showUserEchart = true
      this.showStartEchart = false
      this.showInstallEchart = false
      this.$nextTick(function() {
        echarts.init(this.$refs.echartUser).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartUser = echarts.init(this.$refs.echartUser)
        // 绘制图表
        let echartOption = JSON.parse(JSON.stringify({}))
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#015252'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrUser,
            name: '时间',
            nameTextStyle: {
              fontSize: 16,
              padding: [0, 0, 0, 20]
            }
          },
          yAxis: {
            type: 'value',
            name: '使用用户数',
            nameTextStyle: {
              fontSize: 16,
              padding: [0, 0, 5, 0]
            }
          },
          series: [
            {
              type: 'line',
              data: this.yArrUser
            }
          ]
        }
        echartUser.setOption(echartOption)
      })
    },
    getStartEchart() { // 启动次数（将图展示并进行赋值）
      this.showUserEchart = false
      this.showStartEchart = true
      this.showInstallEchart = false
      console.log(this.showStartEchart, '123456')
      // 基于准备好的dom，初始化echarts实例
      this.$nextTick(function() {
        echarts.init(this.$refs.echartStart).dispose() // 销毁实例
        var echartStart = echarts.init(this.$refs.echartStart)
        // 绘制图表
        let echartOption = JSON.parse(JSON.stringify({}))
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['']
          },
          color: ['#015252'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrStart,
            name: '时间',
            nameTextStyle: {
              fontSize: 16,
              padding: [0, 0, 0, 20]
            }
          },
          yAxis: {
            type: 'value',
            name: '启动次数',
            nameTextStyle: {
              fontSize: 16,
              padding: [0, 0, 5, 0]
            }
          },
          series: [
            {
              type: 'line',
              data: this.yArrStart
            }
          ]
        }
        echartStart.setOption(echartOption)
      })
    },
    getInstalltEchart() { // 安装次数（将图展示并进行赋值）
      this.showUserEchart = false
      this.showStartEchart = false
      this.showInstallEchart = true
      this.$nextTick(function() {
        echarts.init(this.$refs.echartInstall).dispose() // 销毁实例
        var echartInstall = echarts.init(this.$refs.echartInstall)
        // 绘制图表
        let echartOption = JSON.parse(JSON.stringify({}))
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['']
          },
          color: ['#015252'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrInstall,
            name: '时间',
            nameTextStyle: {
              fontSize: 16,
              padding: [0, 0, 0, 20]
            }
          },
          yAxis: {
            type: 'value',
            name: '安装次数',
            nameTextStyle: {
              fontSize: 16,
              padding: [0, 0, 5, 0]
            }
          },
          series: [
            {
              type: 'line',
              data: this.yArrInstall
            }
          ]
        }
        echartInstall.setOption(echartOption)
      })
    }
  }
}
</script>
<style lang="less">
.body{
    margin: 20px;
}
.head{
    width: 100%;
    display: inline-flex;
    .box1{
        width: 34%;
        text-align: center;
        border-right: 1px solid #eeeeee;
        padding: 20px 0;
        &:last-child{
            border-right: 0;
        }
    }
}
.subtitle{
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    padding: 15px 30px;
    border-bottom: 1px solid #eeeeee;
}
.bg{
    margin: 20px 2%;
    background: #ffffff;
}

.search{
    padding: 20px;
    border-bottom: 1px solid #eeeeee;
}
.chart1{
  position: relative;
  padding: 40px 0 20px 0;
  .right1{
    position: absolute;
    top: 3px;
    right: 20px;
  }
  .main{
    background-color: #ffffff;
    height: calc(100vh - 430px);
  }
}
.blacktext1{
    color:#333333;
    font-size: 13px;
    padding: 0 10px;
    line-height: 15px;
}
.black{
    font-size: 20px;
    line-height: 22px;
    color: #1b2227;
    margin: 10px 0;
}
</style>
