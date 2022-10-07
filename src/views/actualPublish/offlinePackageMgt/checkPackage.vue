<template>
  <div class="wrapper">
    <el-dialog
      :visible.sync="packageData.dialogVisible"
      :before-close="handlePackgeClose"
      width="60%"
      top="80px"
      title="查看离线包"
    >
      <!-- 表单 -->
      <div class="wrapper-cont">
        <el-card class="box-card whiteBac">
          <el-form label-width="120px">
            <el-divider content-position="left"><span class="fontTitle">基本信息</span></el-divider>
            <el-form-item label="资源包类型：" prop="type" required>
              <el-radio-group v-model="packageData.type" disabled>
                <el-radio label="全局资源包" />
                <el-radio label="普通资源包" />
              </el-radio-group>
              <div class="packageType-tip">一个H5App只能包含一个包类型，选择之后无法更改。当前全局资源包一级目录名称为：<span>70000001</span>,二级目录名称为：<span>mcube-prod.oss-cn-hangzhou</span>，三级目录名称为：<span>3werwerwerewr</span></div>
            </el-form-item>
            <el-form-item label="版本：" prop="version" required>
              <el-input v-model="packageData.version" style="width:240px" disabled />
            </el-form-item>
            <!-- <el-form-item label="客户端范围：" prop="clientType"  required>
            <el-checkbox-group v-model="packageForm.clientType">
              <el-checkbox label="IOS" name="clientType"></el-checkbox>
              <el-form-item label="最低版本:" style="display:inline-block" >
                <el-input v-model="packageForm.IOSLowVersion" style="width:140px"></el-input>
              </el-form-item>
              <el-form-item label="最高版本:" style="display:inline-block">
                <el-input v-model="packageForm.IOSHeightVersion" style="width:140px"></el-input>
              </el-form-item>
              <br>
              <el-checkbox label="Andriod" name="clientType"></el-checkbox>
              <el-form-item label="最低版本:" style="display:inline-block" >
                <el-input v-model="packageForm.AndroidLowVersion" style="width:140px"></el-input>
              </el-form-item>
              <el-form-item label="最高版本:" style="display:inline-block">
                <el-input v-model="packageForm.AndroidHeightVersion" style="width:140px"></el-input>
              </el-form-item>
            </el-checkbox-group>
          </el-form-item> -->
            <!-- <el-form-item label="文件："  required>
            <el-upload
              ref="upload"
              class="upload-demo"
              action="http://lyzd.nat300.top/zipdiffversion/save"
              :data="uploadData"
              accept=".zip"
              :auto-upload="false"
              :file-list="uploadList">
              <el-button size="small"  class="el-icon-upload2">选择文件</el-button>
            </el-upload>
          </el-form-item> -->
            <el-divider content-position="left" style="margin:10px 0;"><span class="fontTitle">配置信息</span></el-divider>
            <el-form-item label="主入口URL：" prop="entryPage" required>
              <el-input v-model="packageData.entryPage" disabled />
            </el-form-item>
            <el-form-item label="虚拟域名：" required>
              <el-input v-model="packageData.virtualName" disabled />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePackgeClose">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>>

<script>

export default {
  name: 'CheckPackage',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    packageData: Object
  },
  methods: {
    handlePackgeClose() { // 关闭弹窗
      this.packageData.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  .wrapper-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999;
    font-size: 18px;
    margin-bottom:30px;
    .wrapper-header_l {
      display: flex;
      i{
        margin-right: 10px;
      }
      >div:nth-child(3) {
        color:#333;
        margin: 0  10px;
      }
    }
  }
  .wrapper-cont{
     height:60vh;
     overflow: scroll;
      .box-card {
        background: #ffffff;
        .packageType-tip{
          font-size: 13px;
          color: #909399;
          line-height: 18px;
        }
      }

    }
}
.fontTitle{
  font-size: 16px;
  color: #606266;
}
/deep/ .el-divider{
  margin: 20px 0;
}
/deep/ .el-card__body {
    padding: 10px 0 10px 0;
}
.whiteBac{
  background: #ffffff!important;
}
</style>
