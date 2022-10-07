<template>
  <div style="padding-bottom:20px">
    <el-card>
      <el-input v-model="schemaJson" type="textarea" :rows="20" />
      <div style="margin-top:20px;text-align:center">
        <el-button size="small" @click="goBack">返回</el-button>
        <el-button size="small" type="primary" @click="editSchemaSumbit">确定</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { publicCompSchemaApi, editCompSchemaApi } from '@/api/pubComponentApi'
export default {
  props: {
    editSchemaDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      schemaJson: ''
    }
  },
  // activated() {
  //   this.getPublicCompSchemaJson()
  // },
  created() {
    this.getPublicCompSchemaJson()
  },
  methods: {
    getPublicCompSchemaJson() {
      const params = {
        compName: this.$store.state.dynamic.dynamicPageData.compName
      }
      publicCompSchemaApi(params).then(res => {
        this.schemaJson = JSON.stringify(res.data, null, 4).toString()
      })
    },
    editSchemaSumbit() {
      const params = {
        compName: this.$store.state.dynamic.dynamicPageData.compName,
        json: this.schemaJson
      }
      editCompSchemaApi(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('提交成功')
          this.$emit('update:editSchemaDialog', false)
          this.getPublicCompSchemaJson()
        }
      })
    },
    goBack() {
      this.$emit('update:editSchemaDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
