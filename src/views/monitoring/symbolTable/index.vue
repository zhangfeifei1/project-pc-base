<template>
  <div class="white">
    <div class="table">
      <div class="blacktext3">暂无配置符号表</div>
      <div class="text1">配置符号表，快速并准确地定位应用发生异常的代码位置</div>
      <div class="upload" @click="dialogVisible = true">上传符号表</div>
    </div>
    <el-dialog
      width="30%"
      title="上传ios符号表"
      :visible.sync="dialogVisible"
    >
      <div class="main">
        <div class="bluetext">选择文件</div>
        <div class="graytext">(支持ZIP文件，最大不超过100MB)</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  }
}
</script>
<style lang="less">
    .white{
        display: flex;
        height: 600px;
        margin: 20px;
        background: #ffffff;
    }
    .table{
      height: fit-content;
      text-align: center;
      margin: auto;
    }
    .blacktext3{
        color:#333333;
        font-size: 13px;
        line-height: 15px;
        margin-bottom: 20px;
    }
    .text1{
        color:#808080;
        font-size: 13px;
        line-height: 15px;
        margin-bottom: 30px;
    }
    .upload{
        margin: auto;
        width: fit-content;
        background: #409EFF;
        padding: 10px 30px;
        color: #ffffff;
        font-size: 13px;
        line-height: 15px;
    }
    .main{
        text-align: center;
        margin: auto;
        .graytext{
          color:#91a3ad;
          font-size: 12px;
        }
        .bluetext{
          font-size: 12px;
          color: #409EFF;
          margin-bottom: 10px;
        }
    }
    .el-dialog__header{
      padding: 15px 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .el-dialog__title{
      font-size: 14px;
      color: #282828;
    }
    .el-dialog__headerbtn{
      top: 18px;
    }
    // .el-dialog__body{
    //   height: 400px;
    //   padding: 20px;
    //   display: flex;
    // }
</style>
