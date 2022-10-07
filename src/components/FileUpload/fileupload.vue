<template>
  <div class="content">
    <el-button type="primary" size="small" @click="getChange">上传图标</el-button>
    <!-- <div class="bttImg" @click="getChange">
      <i class="el-icon-plus"></i>
    </div>-->
    <div class="inputImg">
      <input
        v-show="false"
        ref="uploadImg"
        class="uploadImg"
        type="file"
        accept=".png, .jpg, .jpeg"
        @change="getFileData($event)"
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    getChange() {
      this.$refs.uploadImg.click()
    },
    getFileData(event) {
      const fileList = event.target.files
      // async 和 await 结合 vue 中 for循环使用：注意this指向，这里将异步处理BASE64位图片，转为同步数组。
      // 结局打印数组长度为 0，而数组有数据
      const that = this
      const ImgData = []
      async function getters() {
        for (let i = 0; i < fileList.length; i++) {
          const res = await that.getBase64(fileList[i])
          ImgData.push({
            name: fileList[i].name,
            fileValue: res
          })
        }
        that.$emit('getFile', ImgData)
      }
      getters()
    },

    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          const data = reader.result.split(',')
          imgResult = data[1]
        }
        reader.onerror = function(err) {
          reject(err)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.img-wrap {
  .title {
    line-height: 30px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;

    .img-content {
      width: 170px;
      height: 150px;
      margin-bottom: 10px;
      position: relative;
      .el-icon-remove-outline {
        position: absolute;
        top: -15px;
        right: 0px;
        color: red;
        cursor: pointer;
        font-size: 25px;
      }
      .base-img {
        width: 150px;
        height: 150px;
        border-radius: 8px;
        margin-right: 10px;
      }
    }
  }
  .bttImg {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
    text-align: center;
    .el-icon-plus {
      font-size: 28px;
      color: #8c939d;
    }
    .inputImg {
      display: none;
    }
    .uploadImg {
      display: none;
    }
  }
}
</style>
