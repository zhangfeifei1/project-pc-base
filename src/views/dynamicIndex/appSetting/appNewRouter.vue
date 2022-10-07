<template>
  <div>
    <!-- 表单区域 -->
    <div>
      <el-form
        ref="newRouterForm"
        :model="newRouterForm"
        :rules="newRouterRules"
        label-width="110px"
        size="small"
      >
        <el-form-item label="路由ID：" prop="id">
          <el-input v-model="newRouterForm.id" style="width:300px" placeholder="请输入路由Id" />
        </el-form-item>
        <el-form-item label="路由名称：" prop="name">
          <el-input v-model="newRouterForm.name" style="width:300px" placeholder="请输入路由名称" />
        </el-form-item>
        <el-form-item label="是否需要登录：" prop="isneedlogin">
          <el-switch v-model="newRouterForm.isneedlogin" />
        </el-form-item>
        <el-form-item label="节点类型：" prop="node">
          <el-select v-model="newRouterForm.node" placeholder="请选择节点类型">
            <el-option
              v-for="item in nodeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转类型：" prop="type">
          <el-select v-model="newRouterForm.type" placeholder="请选择跳转类型">
            <el-option
              v-for="item in jumpTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标地址：" prop="target">
          <el-input v-model="newRouterForm.target" style="width:300px" placeholder="请输入目标地址" />
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮区域 -->
    <div style="text-align:center">
      <el-button size="small" style="margin-bottom:20px" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="submit">确定</el-button>
    </div>
  </div>
</template>
<script>
import { routerSave } from '@/api/dynamicPageApi'
export default {
  props: {
    appNewRouterDialogShow: {
      type: Boolean
    }
  },
  data() {
    return {
      newRouterForm: {
        id: '',
        name: '',
        isneedlogin: false,
        node: '',
        type: '',
        target: ''
      },
      newRouterRules: {
        id: [{ required: true, message: '请输入路由id', trigger: 'blur' }],
        name: [{ required: true, message: '请输入路由id', trigger: 'blur' }],
        node: [{ required: true, message: '请选择节点类型', trigger: 'change' }],
        type: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        target: [{ required: true, message: '请输入目标地址', trigger: 'blur' }]
      },
      nodeTypeOptions: [ // 节点类型
        { value: 'LocalWeb', label: 'LocalWeb' },
        { value: 'RemoteWeb', label: 'RemoteWeb' },
        { value: 'ContainerLocalWeb', label: 'ContainerLocalWeb' },
        { value: 'ContainerRemoteWeb', label: 'ContainerRemoteWeb' },
        { value: 'OfflinePackage', label: 'OfflinePackage' },
        { value: 'Native', label: 'Native' },
        { value: 'Custom', label: 'Custom' }
      ],
      jumpTypeOptions: [ // 跳转类型
        { value: 'pushroot', label: 'pushroot' },
        { value: 'pushtab', label: 'pushtab' },
        { value: 'parentroot', label: 'parentroot' },
        { value: 'parenttab', label: 'parenttab' }
      ]
    }
  },
  created() {

  },
  methods: {
    submit() {
      this.$refs['newRouterForm'].validate(valid => {
        if (valid) {
          const params = {
            appId: this.$store.state.dynamic.dynamicPageData.appId,
            routerJson: JSON.stringify(this.newRouterForm)
          }
          routerSave(params).then(res => {
            if (res.returnCode === '000000') {
              this.$message.success('新建成功')
              this.$refs.newRouterForm.resetFields()
              this.$emit('update:appNewRouterDialogShow', false)
            }
          })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    goBack() {
      this.$emit('update:appNewRouterDialogShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
