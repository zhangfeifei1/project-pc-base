<template>
  <div class="versionBg">
    <div class="versionTitle">版本分布趋势图</div>
    <div class="chart1">
      <div class="right1">
        <el-button type="text" size="small" @click="getNewUserEchart">新增用户</el-button>
        <el-button type="text" size="small" @click="getUserEchart">使用用户</el-button>
        <el-button type="text" size="small" @click="getStartEchart">启动次数</el-button>
      </div>
      <div v-show="isShowNewUserEchart" ref="newUserEchart" class="main" />
      <div v-show="isShowUserEchart" ref="userEchart" class="main" />
      <div v-show="isShowStartEchart" ref="startEchart" class="main" />
    </div>
  </div>
</template>
<script>
import { getVersionInfo } from '@/api/behavior'
import echarts from 'echarts'
export default {
  data() {
    return {
      days: 7,
      isShowNewUserEchart: true,
      isShowUserEchart: false,
      isShowStartEchart: false,
      xArrNewUser: [],
      yArrNewUser: [],
      countNewUser: [],
      xArrUser: [],
      yArrUser: [],
      countUser: [],
      xArrStart: [],
      yArrStart: [],
      countStart: []
    }
  },
  mounted() {
    getVersionInfo(this.days).then(res => { // 获取版本分布的数据
      console.log(res, '版本分布111111111111111111')
      if (res.returnCode === '000000') {
        this.xArrNewUser = []
        this.yArrNewUser = []
        this.countNewUser = res.data.install
        for (var i = 0; i < this.countNewUser.length; i++) {
          this.xArrNewUser.push(this.countNewUser[i].appVersion)
          this.yArrNewUser.push(this.countNewUser[i].count)
        }
        this.getNewUserEchart()
        this.xArrUser = []
        this.yArrUser = []
        this.countUser = res.data.user
        for (var j = 0; j < this.countUser.length; j++) {
          this.xArrUser.push(this.countUser[j].appVersion)
          this.yArrUser.push(this.countUser[j].count)
        }
        this.xArrStart = []
        this.yArrStart = []
        this.countStart = res.data.start
        for (var k = 0; k < this.countStart.length; k++) {
          this.xArrStart.push(this.countStart[k].appVersion)
          this.yArrStart.push(this.countStart[k].count)
        }
      }
    })
  },
  methods: {
    getNewUserEchart() {
      this.isShowNewUserEchart = true
      this.isShowUserEchart = false
      this.isShowStartEchart = false
      // 基于准备好的dom，初始化echarts实例
      var echartNewUser = echarts.init(this.$refs.newUserEchart)
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
          type: 'value',
          boundaryGap: false,
          data: this.xArrNewUser,
          name: '版本',
          nameTextStyle: {
            fontSize: 16,
            padding: [0, 0, 0, 20]
          }
        },
        yAxis: {
          type: 'value',
          name: '新增用户',
          nameTextStyle: {
            fontSize: 16,
            padding: [0, 0, 5, 0]
          }
        },
        series: [
          {
            type: 'line',
            data: this.yArrNewUser
          }
        ]
      }
      echartNewUser.setOption(echartOption)
    },
    getUserEchart() {
      this.isShowNewUserEchart = false
      this.isShowUserEchart = true
      this.isShowStartEchart = false
      this.$nextTick(function() {
        // echarts.init(this.$refs.echartUser).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartUser = echarts.init(this.$refs.userEchart)
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
            type: 'value',
            boundaryGap: false,
            data: this.xArrUser,
            name: '版本',
            nameTextStyle: {
              fontSize: 16,
              padding: [0, 0, 0, 20]
            }
          },
          yAxis: {
            type: 'value',
            name: '使用用户',
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
    getStartEchart() {
      this.isShowNewUserEchart = false
      this.isShowUserEchart = false
      this.isShowStartEchart = true
      this.$nextTick(function() {
        // echarts.init(this.$refs.echartStart).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartStart = echarts.init(this.$refs.startEchart)
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
            type: 'value',
            boundaryGap: false,
            data: this.xArrStart,
            name: '版本',
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
    }
  }
}
</script>
<style lang="less">
    .versionBg{
        margin: 20px;
        background: #ffffff;
        .versionTitle{
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

    }

// .show{
//         position: relative;
//         display: flex;
//         height: 400px;
//         padding-top: 50px;
//         text-align: center;
//         .right{
//             position: absolute;
//             right: 20px;
//             top: 13px;
//           }
//         .main{
//             margin: 25px 25px 30px 25px;
//             background-color: #ffffff;
//             // border-radius: 10px;
//             padding: 20px 0px 10px 0px;
//             min-height: 200px;
//             max-height: 450px;
//             height: calc(100vh - 390px);
//             // box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
//           }
//         }
</style>
