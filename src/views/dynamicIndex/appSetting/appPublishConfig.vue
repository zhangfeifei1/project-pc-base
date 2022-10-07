<template>
  <div class="app-publish-wrap">
    <!-- 测试发布 -->
    <!-- <div class="content">

      <div class="left-form">
        <el-form :model="testForm" label-width="80px">
          <p>测试发布</p>
          <el-form-item label="模板URL">
            <el-input v-model="testForm.testPath" disabled />
          </el-form-item>
          <el-form-item label="选择主题">
            <el-select v-model="testForm.testTheme" placeholder="请选择主题">
              <el-option
                v-for="item in testOptions"
                :key="item.themeId +'testOptions'"
                :label="item.themeName"
                :value="item.themeId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="img-right">
        <img :src="'data:image/png;base64,'+testImg">
      </div>
    </div> -->
    <!-- 测试发布按钮 -->
    <!-- <div class="footer-btt">
      <el-button type="primary" size="small" style="margin-bottom:10px" @click="testPublish">发布</el-button>
    </div> -->
    <el-tabs type="border-card">
      <el-tab-pane label="启动页发布">
        <!-- 白名单发布 -->
        <div class="content">
          <!-- 左侧表单 -->
          <div class="left-form">
            <el-form :model="whiteForm" label-width="110px">
              <p>白名单发布</p>
              <!-- <el-form-item label="模板URL">
            <el-input v-model="whiteForm.whitePath" disabled />
          </el-form-item> -->
              <el-form-item label="选择白名单：">
                <el-select v-model="whiteForm.whiteName" placeholder="请选择白名单" @change="getGroupId">
                  <el-option
                    v-for="item in whiteNameOptions"
                    :key="item.groupId"
                    :label="item.groupName"
                    :value="item.groupId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="选择发布启动页：">
                <el-select v-model="whiteForm.whiteStartPage" placeholder="请选择发布启动页">
                  <el-option
                    v-for="item in startPageOptions"
                    :key="item.startPageId +'startPageOptions'"
                    :label="item.startPageName"
                    :value="item.startPageId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 白名单发布右侧图片 -->
          <!-- <div class="img-right">
            <img :src="'data:image/png;base64,'+whiteImg">
          </div> -->
        </div>
        <!-- 白名单发布按钮 -->
        <div class="footer-btt1">
          <el-button type="primary" size="small" style="margin-bottom:10px" @click="startPageWhitePublish">发布</el-button>
        </div>
        <!-- 生产发布 -->
        <div class="content">
          <!-- 左侧表单 -->
          <div class="left-form">
            <el-form :model="publishForm" label-width="110px">
              <p>生产发布</p>
              <!-- <el-form-item label="模板URL">
            <el-input v-model="publishForm.productPath" disabled />
          </el-form-item> -->
              <el-form-item label="选择发布启动页：">
                <el-select v-model="publishForm.productStartPage" placeholder="请选择发布启动页">
                  <el-option
                    v-for="item in startPageOptions"
                    :key="item.startPageId +'startPageOptions'"
                    :label="item.startPageName"
                    :value="item.startPageId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 右侧图片 -->
          <!-- <div class="img-right">
            <img :src="'data:image/png;base64,'+publishImg">
          </div> -->
        </div>
        <!-- 生产发布按钮 -->
        <div class="footer-btt2">
          <el-button type="primary" size="small" style="margin-bottom:10px" @click="startPageProduct">发布</el-button>
        </div>
        <!-- 返回按钮 -->
        <!-- <div class="footer-button">
          <el-button size="small" @click="goBack">返回</el-button>
        </div> -->
      </el-tab-pane>
      <el-tab-pane label="首页发布">
        <!-- 白名单发布 -->
        <div class="content">
          <!-- 左侧表单 -->
          <div class="left-form">
            <el-form :model="whiteForm" label-width="90px">
              <p>白名单发布</p>
              <!-- <el-form-item label="模板URL">
            <el-input v-model="whiteForm.whitePath" disabled />
          </el-form-item> -->
              <el-form-item label="选择白名单：">
                <el-select v-model="whiteForm.whiteName" placeholder="请选择白名单" @change="getGroupId">
                  <el-option
                    v-for="item in whiteNameOptions"
                    :key="item.groupId"
                    :label="item.groupName"
                    :value="item.groupId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="选择主题：">
                <el-select v-model="whiteForm.whiteTheme" placeholder="请选择主题">
                  <el-option
                    v-for="item in whiteOptions"
                    :key="item.themeId +'whiteOptions'"
                    :label="item.themeName"
                    :value="item.themeId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 白名单发布右侧图片 -->
          <!-- <div class="img-right">
            <img :src="'data:image/png;base64,'+whiteImg">
          </div> -->
        </div>
        <!-- 白名单发布按钮 -->
        <div class="footer-btt1">
          <el-button type="primary" size="small" style="margin-bottom:10px" @click="whitePublish">发布</el-button>
        </div>
        <!-- 生产发布 -->
        <div class="content">
          <!-- 左侧表单 -->
          <div class="left-form">
            <el-form :model="publishForm" label-width="80px">
              <p>生产发布</p>
              <!-- <el-form-item label="模板URL">
            <el-input v-model="publishForm.productPath" disabled />
          </el-form-item> -->
              <el-form-item label="选择主题：">
                <el-select v-model="publishForm.productTheme" placeholder="请选择主题">
                  <el-option
                    v-for="item in publishOptions"
                    :key="item.themeId +'publishOptions'"
                    :label="item.themeName"
                    :value="item.themeId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 右侧图片 -->
          <!-- <div class="img-right">
            <img :src="'data:image/png;base64,'+publishImg">
          </div> -->
        </div>
        <!-- 生产发布按钮 -->
        <div class="footer-btt2">
          <el-button type="primary" size="small" style="margin-bottom:10px" @click="publishFinally">发布</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 返回按钮 -->
    <div class="footer-button" style="text-align:center">
      <el-button size="small" style="margin-top:20px;margin-bottom:20px" @click="goBack">返回</el-button>
    </div>
  </div>
</template>
<script>
import {
  themeList,
  getQrCode,
  publishTheme,
  groupList,
  list, // 获取启动页列表接口
  publishStartPage// 启动页发布接口
} from '@/api/dynamicPageApi'
export default {
  props: {
    appPublicDialogShow: {
      type: Boolean
    }
  },
  data() {
    return {
      // testForm: {
      //   testPath: '',
      //   testTheme: ''
      // },
      whiteForm: {
        whitePath: '',
        whiteName: '',
        whiteTheme: '',
        whiteStartPage: '' // 白名单启动页发布

      },
      publishForm: {
        productPath: '',
        productTheme: '',
        productStartPage: ''// 启动页生产发布
      },
      // testOptions: [{ themeId: '', themeName: '' }],
      startPageOptions: [{ startPageId: '', startPageName: '' }],
      whiteNameOptions: [{ groupId: '', groupName: '' }],
      whiteOptions: [{ themeId: '', themeName: '' }],
      publishOptions: [{ themeId: '', themeName: '' }],
      testImg: '', // 测试发布二维码图片
      whiteImg: '', // 白名单发布二维码图片
      whiteGroupId: '', // 白名单组的id
      publishImg: '', // 生产发布二维码图片
      id: '' // 获取themeId
    }
  },
  created() {
    this.getNotFormalList() // 获取非正式发布主题列表
    this.getIconUrl() // 二维码和下载url获取
    this.getGroupList() // 获取白名单列表
    this.getStartPageList() // 获取启动页列表
  },
  methods: {
    // 获取非正式发布主题列表
    getNotFormalList() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        current: 1,
        size: 10000
      }
      themeList(params).then((res) => {
        console.log(JSON.stringify(res, null, 4), '%%发布获取皮肤列表%%')
        if (res.returnCode === '000000') {
          this.testOptions = res.data.records
          this.whiteOptions = res.data.records
          this.publishOptions = res.data.records
        }
      })
    },
    // 二维码和下载url获取
    getIconUrl() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId
      }
      getQrCode(params).then((res) => {
        console.log(res, '测试发布图片跟URL')
        if (res.returnCode === '000000') {
          this.testImg = res.data.test.QrCode
          // this.testForm.testPath = res.data.test.Url
          this.whiteImg = res.data.whiteGroup.QrCode
          this.whiteForm.whitePath = res.data.whiteGroup.Url
          this.publishImg = res.data.formal.QrCode
          this.publishForm.productPath = res.data.formal.Url
        }
      })
    },
    // 获取白名单列表
    getGroupList() {
      groupList().then(res => {
        console.log(res, '**白名单列表**')
        if (res.returnCode === '000000') {
          this.whiteNameOptions = res.data
        }
      })
    },
    // 测试发布
    // testPublish() {
    //   const params = {
    //     appId: this.$store.state.dynamic.dynamicPageData.appId,
    //     publishType: '0',
    //     themeId: this.testForm.testTheme
    //   }
    //   publishTheme(params).then((res) => {
    //     // console.log(res)
    //     if (res.returnCode === '000000') {
    //       this.$message.success('测试发布成功')
    //     }
    //   })
    // },
    getGroupId(item) { // 获取白名单发布的id
      this.whiteGroupId = item
    },
    getStartPageList() { // 获取启动页列表
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        current: 1,
        size: 1000
      }
      list(params).then(res => {
        console.log(1111, res)
        if (res.returnCode === '000000') {
          this.startPageOptions = res.data.records
          // for (let i = 0; i < res.data.records.length; i++) {
          //   this.startPageOptions.startPageId = res.data.records[i].startPageId
          //   this.startPageOptions.startPageName = res.data.records[i].startPageName
          // }
        }
      })
    },
    startPageWhitePublish() { // 白名单启动页发布
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        startPageId: this.whiteForm.whiteStartPage,
        publishType: '1',
        group: this.whiteGroupId
      }
      publishStartPage(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('启动页白名单发布成功')
        }
      })
    },
    startPageProduct() { // 启动页生产发布
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        startPageId: this.publishForm.productStartPage,
        publishType: '2'
      }
      publishStartPage(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('启动页生产发布成功')
        }
      })
    },
    // 白名单首页发布
    whitePublish() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        themeId: this.whiteForm.whiteTheme,
        publishType: '1',
        group: this.whiteGroupId
      }
      publishTheme(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('白名单发布成功')
        }
      })
    },
    // 生产首页发布
    publishFinally() {
      const params = {
        appId: this.$store.state.dynamic.dynamicPageData.appId,
        publishType: '2',
        themeId: this.publishForm.productTheme
      }
      publishTheme(params).then((res) => {
        if (res.returnCode === '000000') {
          this.$message.success('生产发布成功')
        }
      })
    },
    goBack() {
      this.$emit('update:appPublicDialogShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-publish-wrap {
  // padding: 20px 100px;
  .content {
    display: flex;
    flex-direction: row;
    .left-form {
      flex: 1;
      p {
        text-align: center;
        font-size: 16px;
      }
    }
    .img-right {
      img {
        width: 150px;
        height: 150px;
      }
    }
  }
  .footer-btt1 {
    text-align: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #cccccc;
  }
  .footer-btt2 {
    text-align: center;
    // margin-bottom: 20px;
    // border-bottom: 1px solid #cccccc;
  }
  .footer-button {

  }
  /deep/.el-input__inner {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    width: 250px;
  }
  /deep/ .el-input.is-disabled .el-input__inner{
    background-color: #eeeeee;
  }
  /deep/.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

}
</style>
