<template>
  <div class="body">
    <div class="head">
      <div class="box" @click="showDes(1)">
        <span class="title">崩溃</span>
        <span class="title">|</span>
        <span class="title">{{ collapsePercent }}</span>
      </div>
      <div class="box" @click="showDes(2)">
        <span class="title">卡顿 </span>
        <span class="title">|</span>
        <span class="title">{{ blockPercent }}</span>
      </div>
      <div class="box" @click="showDes(3)">
        <span class="title">错误 </span>
        <span class="title">|</span>
        <span class="title">{{ errorPercent }}</span>
      </div>
    </div>
    <!-- 崩溃区域 -->
    <div v-if="showCollapse === true">
      <div class="titleArea">
        <div class="subtitle">崩溃趋势分析</div>
      </div>
      <div class="mainArea">
        <div ref="echart" class="left" />
        <div class="right">
          <div class="titleClick">
            <el-button type="text" size="small" @click="changeCollDevice(1)">联网设备数</el-button>
            <el-button type="text" size="small" @click="changeCollDevice(2)">崩溃设备数</el-button>
          </div>
          <div v-if="showCollDevice === false" ref="echartOnline" class="echartRight" />
          <div v-if="showCollDevice === true" ref="echartCollDevice" class="echartRight" />
        </div>
      </div>
    </div>
    <!-- 卡顿区域 -->
    <div v-if="showBlock === true">
      <div class="titleArea">
        <div class="subtitle">卡顿趋势分析</div>
      </div>
      <div class="mainArea">
        <div ref="echartBlock" class="left" />
        <div class="right">
          <div class="titleClick">
            <el-button type="text" size="small" @click="changeBlockDevice(1)">联网设备数</el-button>
            <el-button type="text" size="small" @click="changeBlockDevice(2)">卡顿设备数</el-button>
          </div>
          <div v-if="showBlockDevice === false" ref="echartOnline" class="echartRight" />
          <div v-if="showBlockDevice === true" ref="echartBlockDevice" class="echartRight" />
        </div>
      </div>
    </div>
    <!-- 错误分析趋势 -->
    <div v-if="showError === true">
      <div class="titleArea">
        <div class="subtitle">错误趋势分析</div>
      </div>
      <div class="mainArea">
        <div ref="echartError" class="left" />
        <div class="right">
          <div class="titleClick">
            <el-button type="text" size="small" @click="changeErrorDevice(1)">联网设备数</el-button>
            <el-button type="text" size="small" @click="changeErrorDevice(2)">错误设备数</el-button>
          </div>
          <div v-if="showErrorDevice === false" ref="echartOnline" class="echartRight" />
          <div v-if="showErrorDevice === true" ref="echartErrorDevice" class="echartRight" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import {
  getLogsRatio // 异常概览接口
} from '@/api/monitoring'
import echarts from 'echarts'
export default {
  name: 'Overview',
  // filters: {
  //   paramsFilter(value) {
  //     return value ? parseFloat(value).toFixed(2) + '%' : value
  //   }
  // },
  data() {
    return {
      collapsePercent: '0%',
      blockPercent: '0%',
      errorPercent: '0%',
      errorPercent1: 1,
      showCollapse: true, // 崩溃题目区域
      showBlock: false, // 卡顿题目区域
      showError: false, // 错误题目区域
      showCollDevice: false,
      showBlockDevice: false,
      showErrorDevice: false,
      xArr: [],
      yArr: [],
      visitCount: [],

      xArrBlock: [], // 卡顿x轴数组
      yArrBlock: [], // 卡顿y轴数组
      visitCountBlock: [],

      yArrJs: [], // Js y轴数组
      visitCountJs: [],
      xArrError: [],
      yArrNative: [],
      visitCountNative: [],

      xArrOnlineDeive: [], // 联网设备x轴
      yArrOnlineDevice: [], // 联网设备y轴

      xArrCollDevice: [], // 崩溃设备数x轴
      yArrCollDevice: [], // 崩溃设备数y轴

      xArrBlockDevice: [], // 卡顿设备数x轴
      yArrBlockDevice: [], // 卡顿设备数y轴

      xArrErrorDevice: [], // 错误设备数x轴
      yArrJsErrorDevice: [], // js错误设备数y轴
      yArrNaErrorDevice: [] // Native错误设备数y轴
    }
  },
  mounted() {
    // 崩溃率接口
    const visitData = {
      days: 7,
      collectionName: 'CrashLog'
    }
    getLogsRatio(visitData).then((res) => {
      // console.log(res, '**崩溃率***')
      if (res.returnCode === '000000') {
        this.xArr = []
        this.yArr = []
        this.visitCount = res.data
        for (var i = 0; i < this.visitCount.length; i++) {
          this.xArr.push(this.visitCount[i].days)
          this.yArr.push(this.visitCount[i].ratio)
        }
        this.getCollapseLog()
        // 获取联网设备数
        this.xArrOnlineDeive = []
        this.yArrOnlineDeive = []
        for (var j = 0; j < this.visitCount.length; j++) {
          this.xArrOnlineDeive.push(this.visitCount[j].days)
          this.yArrOnlineDeive.push(this.visitCount[j].counts)
        }
        this.getDeviceQuantity()
        // 获取崩溃设备数
        this.xArrCollDevice = []
        this.yArrCollDevice = []
        for (var k = 0; k < this.visitCount.length; k++) {
          this.xArrCollDevice.push(this.visitCount[k].days)
          this.yArrCollDevice.push(this.visitCount[k].exceptionCounts)
        }
        var length = res.data.length - 1
        this.collapsePercent = `${res.data[length].ratio}%` // 获取最后一天的崩溃率
      }
    })
    // 卡顿接口
    const blockData = {
      days: 7,
      collectionName: 'ApmLog'
    }
    getLogsRatio(blockData).then((res) => {
      // console.log(res, '**卡顿率***')
      if (res.returnCode === '000000') {
        this.xArrBlock = []
        this.yArrBlock = []
        this.visitCountBlock = res.data
        for (var i = 0; i < this.visitCountBlock.length; i++) {
          this.xArrBlock.push(this.visitCountBlock[i].days)
          this.yArrBlock.push(this.visitCountBlock[i].ratio)
        }
        // 获取卡顿设备数
        this.xArrBlockDevice = []
        this.yArrBlockDevice = []
        for (var k = 0; k < this.visitCountBlock.length; k++) {
          this.xArrBlockDevice.push(this.visitCountBlock[k].days)
          this.yArrBlockDevice.push(this.visitCountBlock[k].exceptionCounts)
        }
        var blockLength = res.data.length - 1
        this.blockPercent = `${res.data[blockLength].ratio}%` // 获取最后的卡顿率
      }
    })
    // 错误率接口
    const JsErrorData = {
      days: 7,
      collectionName: 'JSErrorLog'
    }
    getLogsRatio(JsErrorData).then((res) => {
      // console.log(res, '**JS错误率***')
      if (res.returnCode === '000000') {
        this.xArrError = []
        this.yArrJs = []
        this.visitCountJs = res.data
        for (var i = 0; i < this.visitCountJs.length; i++) {
          this.xArrError.push(this.visitCountJs[i].days)
          this.yArrJs.push(this.visitCountJs[i].ratio)
        }
        var lengthJs = res.data.length - 1
        this.errorPercent1 = res.data[lengthJs].ratio
        console.log(this.errorPercent1, '错误111111111111111111')
        // 错误设备数(JS)
        this.xArrErrorDevice = []
        this.yArrJsErrorDevice = []
        for (var k = 0; k < this.visitCountJs.length; k++) {
          this.xArrErrorDevice.push(this.visitCountJs[k].days)
          this.yArrJsErrorDevice.push(this.visitCountJs[k].exceptionCounts)
        }
      }
    })
    const NativeErrorData = {
      days: 7,
      collectionName: 'NativeErrorLog'
    }
    getLogsRatio(NativeErrorData).then((res) => {
      console.log(JSON.parse(JSON.stringify(res)), '**Native错误率***')
      if (res.returnCode === '000000') {
        this.xArrError = []
        this.yArrNative = []
        this.visitCountNative = JSON.parse(JSON.stringify(res)).data
        for (var i = 0; i < this.visitCountNative.length; i++) {
          this.xArrError.push(this.visitCountNative[i].days)
          this.yArrNative.push(this.visitCountNative[i].ratio)
        }
        // 错误设备数（Native）
        this.xArrErrorDevice = []
        this.yArrNaErrorDevice = []
        for (var j = 0; j < this.visitCountNative.length; j++) {
          this.xArrErrorDevice.push(this.visitCountNative[j].days)
          this.yArrNaErrorDevice.push(this.visitCountNative[j].exceptionCounts)
        }
        var lengthNa = res.data.length - 1
        var errorPercent2 = res.data[lengthNa].ratio
        console.log(errorPercent2, '错误22222222222222222')
        var sumError = this.errorPercent1 + errorPercent2
        console.log(sumError, '错误和33333333333333')
        this.errorPercent = `${sumError}%`// 取最后一天两个错误率的和
      }
    })
  },
  methods: {
    showDes(key) {
      if (key === 1) {
        this.showCollapse = true
        this.showBlock = false
        this.showError = false
        this.getCollapseLog()
        this.getDeviceQuantity()
      } else if (key === 2) {
        this.showCollapse = false
        this.showBlock = true
        this.showError = false
        this.getBlockLog()
        this.getDeviceQuantity()
      } else if (key === 3) {
        this.showCollapse = false
        this.showBlock = false
        this.showError = true
        this.getErrorLog()
        this.getDeviceQuantity()
      }
    },
    changeCollDevice(v) {
      if (v === 1) {
        this.showCollDevice = false
        this.getDeviceQuantity()
      } else if (v === 2) {
        this.showCollDevice = true
        this.getCollDevice()
      }
    },
    changeBlockDevice(v) {
      if (v === 1) {
        this.showBlockDevice = false
        this.getDeviceQuantity()
      } else if (v === 2) {
        this.showBlockDevice = true
        this.getBlockDevice()
      }
    },
    changeErrorDevice(v) {
      if (v === 1) {
        this.showErrorDevice = false
        this.getDeviceQuantity()
      } else if (v === 2) {
        this.showErrorDevice = true
        this.getErrorDevice()
      }
    },
    getCollapseLog() { // 崩溃率
      this.$nextTick(() => {
        // 在创建之前销毁
        echarts.init(this.$refs.echart).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echart = echarts.init(this.$refs.echart)
        // 绘制图表
        let echartOption = {}
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#55a2d6'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArr,
            name: '时间',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: '设备崩溃率(%)',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 5, 0]
            },
            min: 0,
            max: 100
          },
          series: [
            {
              type: 'line',
              data: this.yArr
            }
          ]
        }
        echart.setOption(echartOption)
      })
    },
    getBlockLog() { // 卡顿日志
      this.$nextTick(() => {
        // 在创建之前销毁
        echarts.init(this.$refs.echartBlock).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartBlock = echarts.init(this.$refs.echartBlock)
        // 绘制图表
        let echartOption = {}
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#55a2d6'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrBlock,
            name: '时间',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: '设备卡顿率(%)',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 5, 0]
            },
            min: 0,
            max: 100
          },
          series: [
            {
              type: 'line',
              data: this.yArrBlock
            }
          ]
        }
        echartBlock.setOption(echartOption)
      })
    },
    getErrorLog() { // 错误日志
      this.$nextTick(() => {
        // 在创建之前销毁
        echarts.init(this.$refs.echartError).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartError = echarts.init(this.$refs.echartError)
        // 绘制图表
        let echartOption = {}
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrError,
            name: '时间',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: '设备错误率(%)',
            min: 0,
            max: 100,
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 5, 0]
            }
          },
          legend: {
            data: ['A JsError', 'B NativeError'],
            left: 'right'
          },
          series: [
            {
              type: 'line',
              name: 'A JsError',
              data: this.yArrJs
            },
            {
              type: 'line',
              name: 'B NativeError',
              data: this.yArrNative,
              color: ['#55a2d6']
            }
          ]
        }
        echartError.setOption(echartOption)
      })
    },
    getDeviceQuantity() { // 联网设备数
      this.$nextTick(() => {
        echarts.init(this.$refs.echartOnline).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartOnline = echarts.init(this.$refs.echartOnline)
        // 绘制图表
        let echartOption = {}
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          // color: ['#015252'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrOnlineDeive,
            name: '时间',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: '联网设备数',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 5, 0]
            }
          },
          series: [
            {
              type: 'line',
              data: this.yArrOnlineDeive
            }
          ]
        }
        echartOnline.setOption(echartOption)
      })
    },
    getCollDevice() { // 崩溃设备数
      this.$nextTick(() => {
        echarts.init(this.$refs.echartCollDevice).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartCollDevice = echarts.init(this.$refs.echartCollDevice)
        // 绘制图表
        let echartOption = {}
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['green'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrCollDevice,
            name: '时间',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: '崩溃设备数',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 5, 0]
            }
          },
          series: [
            {
              type: 'line',
              data: this.yArrCollDevice
            }
          ]
        }
        echartCollDevice.setOption(echartOption)
      })
    },
    getBlockDevice() { // 卡顿设备数
      this.$nextTick(() => {
        echarts.init(this.$refs.echartBlockDevice).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartBlockDevice = echarts.init(this.$refs.echartBlockDevice)
        // 绘制图表
        let echartOption = {}
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['green'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrBlockDevice,
            name: '时间',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: '卡顿设备数',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 5, 0]
            }
          },
          series: [
            {
              type: 'line',
              data: this.yArrBlockDevice
            }
          ]
        }
        echartBlockDevice.setOption(echartOption)
      })
    },
    getErrorDevice() { // 错误设备数
      this.$nextTick(() => {
        echarts.init(this.$refs.echartErrorDevice).dispose() // 销毁实例
        // 基于准备好的dom，初始化echarts实例
        var echartErrordevice = echarts.init(this.$refs.echartErrorDevice)
        // 绘制图表
        let echartOption = {}
        echartOption = {
          tooltip: {
            trigger: 'axis'
          },
          // color: ['#015252'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xArrErrorDevice,
            name: '时间',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: '错误设备数',
            nameTextStyle: {
              color: '#000000',
              fontSize: 13,
              padding: [0, 0, 5, 0]
            }
          },
          legend: {
            data: ['A JsError', 'B NativeError'],
            left: 'right'
          },
          series: [
            {
              type: 'line',
              name: 'A JsError',
              data: this.yArrJsErrorDevice
            },
            {
              type: 'line',
              name: 'B NativeError',
              data: this.yArrNaErrorDevice,
              color: ['green']
            }
          ]
        }
        echartErrordevice.setOption(echartOption)
      })
    }
  }
}
</script>
<style lang="less">
.body {
  margin: 20px;
  .head {
    height: 100px;
    width: 100%;
    display: inline-flex;
    .box {
      width: 30%;
      background-color: rgb(85, 162, 214);
      text-align: center;
      padding-top: 40px;
      padding-bottom: 40px;
      margin: 0 2%;
      .title {
        font-size: 20px;
        color: #ffffff;
        line-height: 22px;
      }
    }
    .box:hover {
      background: rgb(44, 129, 186);
    }
  }
  .box:hover{
    background: rgb(44, 129, 186);
  }
  .mainArea{
    display: flex;
    margin: 0 2% 30px 2%;
    background-color: #ffffff;
    height: calc(100vh - 390px);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
    .left{
      width: 50%;
      padding: 40px 0;
      border-right: 1px solid #eeeeee;
    }
    .right{
      position: relative;
      width: 50%;
      padding: 40px 0;
      .titleClick {
        position: absolute;
        right: 20px;
        top: 10px;
      }
      .echartRight{
        width: 100%;
        height: 100%;
      }
    }
  }
  .titleArea{
    display: flex;
    margin: 20px 2% 0 2%;
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    .subtitle{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
      padding: 15px 30px;
    }
  }
}
</style>
