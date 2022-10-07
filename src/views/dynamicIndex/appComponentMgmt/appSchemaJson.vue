<template>
  <div style="padding-bottom:20px">
    <el-card>
      <el-input v-model="appSchemaJson" type="textarea" :rows="20" />
      <div style="margin-top:20px;text-align:center">
        <el-button size="small" @click="goBack">返回</el-button>
        <el-button size="small" type="primary" @click="editSchemaSumbit">确定</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { appCompJsonApi, editAppCompJsonApi } from '@/api/appComponentApi'
export default {
  props: {
    appEditSchemaDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      appSchemaJson: ''
    }
  },
  created() {
    this.getAppSchemaJson()
  },
  methods: {
    getAppSchemaJson() {
      const params = {
        compName: this.$store.state.dynamic.dynamicPageData.compName,
        appId: sessionStorage.getItem('appId'),
        fileName: 'data.schema'
      }
      appCompJsonApi(params).then(res => {
        this.appSchemaJson = JSON.stringify(res.data, null, 4).toString()
      })
    },
    editSchemaSumbit() {
      const params = {
        compName: this.$store.state.dynamic.dynamicPageData.compName,
        fileName: 'data.schema',
        json: this.appSchemaJson,
        appId: sessionStorage.getItem('appId'),
        themeId: ''
      }
      editAppCompJsonApi(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('提交成功')
          this.getAppSchemaJson()
          this.$emit('update:appEditSchemaDialog', false)
        }
      })
    },
    goBack() {
      this.$emit('update:appEditSchemaDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
