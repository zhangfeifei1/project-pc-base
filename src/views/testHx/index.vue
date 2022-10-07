<template>
  <div style="width: 60%; margin-left: 20%">
    <el-button size="small" @click="open">添加</el-button>
    <div style="margin: 20px">
      <div class="black">code为华夏数据标准编号时组件演示: </div>
      <el-form ref="editForm" :model="currentEdit" label-width="150px" label-position="right" size="small" :rules="ruleValidate">
        <div class="text">loongeasy-input组件演示</div>
        <loongeasy-input v-model="currentEdit.number" code="IP000038" prop="number" class="hxStandard" required placeholder="请输入" />
        <loongeasy-input v-model="currentEdit.number1" code="IP000038" version="3.0" prop="number1" class="hxStandard" required placeholder="请输入" />
        <div class="text">loongeasy-textarea组件演示</div>
        <loongeasy-textarea v-model="currentEdit.textarea" code="AC000009" prop="textarea" class="hxStandard" required placeholder="请输入" />
        <div class="text">loongeasy-radio组件演示</div>
        <loongeasy-radio v-model="currentEdit.radio1" code="IP000042" prop="radio1" class="hxStandard" required />
        <div class="text">loongeasy-switch组件演示</div>
        <loongeasy-switch v-model="currentEdit.switch" code="IP000042" prop="switch" class="hxStandard" required />
        <div class="text">loongeasy-date组件演示</div>
        <loongeasy-date v-model="currentEdit.date1" code="IP000138" prop="date1" show-type="month" placeholder="请选择年月" label-width="200px" class="hxStandard" required />
        <loongeasy-date v-model="currentEdit.date2" code="RI000095" prop="date2" show-type="year" placeholder="请选择年份" class="hxStandard" required />
        <div class="text">loongeasy-select组件普通代码类型数据演示</div>
        <loongeasy-select v-model="currentEdit.select1" code="RI000047" prop="select1" class="hxStandard" label-width="200px" placeholder="请选择" required />
        <div class="text">loongeasy-checkbox组件演示</div>
        <loongeasy-checkbox v-model="currentEdit.checkbox" code="RI000047" prop="checkbox" class="hxStandard" label-width="200px" placeholder="请选择" required />
        <div class="text">loongeasy-select组件多值代码类型数据演示</div>
        <loongeasy-select v-model="currentEdit.select2" code="IP000015" value-type="numberCode" prop="select2" class="hxStandard" placeholder="请选择" required />
        <loongeasy-select v-model="currentEdit.select3" code="IP000015" value-type="twoLetterCode" prop="select3" class="hxStandard" placeholder="请选择" required />
        <div class="text">loongeasy-cascader组件演示</div>
        <loongeasy-cascader v-model="currentEdit.cascader1" code="CL000004" prop="cascader1" class="hxStandard" placeholder="请选择行政区划" required />
        <loongeasy-cascader v-model="currentEdit.cascader2" code="CL000004" prop="cascader2" :show-all-values="false" class="hxStandard" placeholder="请选择行政区划" required />
        <div class="text">loongeasy-tree组件演示</div>
        <loongeasy-tree v-model="currentEdit.cascader3" code="CL000004" prop="cascader3" class="hxStandard" required />
        <div class="black" style="margin-bottom:20px">element-ui的el-input组件演示: </div>
        <el-form-item label="字段名：" prop="tele">
          <el-input v-model="currentEdit.tele" placeholder="请输入字段名" style="width:500px" />
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" size="small" @click="addSubmit1">保存</el-button>
    <el-dialog :visible.sync="bool" width="60%">
      <el-form ref="addForm" :model="currentAdd" label-width="150px" label-position="right" size="small">
        <div class="black">code为标准数据字段时组件演示: </div>
        <loongeasy-select v-model="currentAdd.select" code="IP000015" prop="select" class="hxStandard" value-type="threeLetterCode" placeholder="请选择" required />
        <loongeasy-cascader v-model="currentAdd.cascader" code="CL000004" prop="cascader" class="hxStandard" placeholder="请选择行政区划" required />
        <loongeasy-input v-model="currentAdd.cardNumber" prop="cardNumber" code="CardNo" placeholder="请输入银行卡号" class="dictionary" required />
        <loongeasy-input v-model="currentAdd.idNumber" prop="idNumber" code="IdNo" placeholder="请输入证件号码" class="dictionary" required />
        <loongeasy-select v-model="currentAdd.collateral" prop="collateral" code="CollateralCode" placeholder="请输入证件号码" class="dictionary" label-width="200px" required />
      </el-form>
      <el-button type="primary" size="small" @click="addSubmit2">保存</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bool: false,
      currentEdit: {
        number: '',
        number1: '',
        textarea: '',
        radio1: '',
        switch: '',
        date1: '',
        date2: '',
        select1: '',
        checkbox: [],
        select2: '',
        select3: '',
        cascader1: [],
        cascader2: [],
        cascader3: [],
        tele: ''
      },
      currentAdd: {
        date: '',
        select: '',
        cascader: '',
        cardNumber: '',
        idNumber: '',
        collateral: ''
      },
      ruleValidate: {
        tele: [{
          required: true,
          message: '字段名不能为空！',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    open() {
      this.bool = true
    },
    addSubmit1() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$message.success('验证通过')
        } else {
          this.$message.error('验证不通过')
        }
      })
    },
    addSubmit2() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$message.success('验证通过')
        } else {
          this.$message.error('验证不通过')
        }
      })
    }
  }
}
</script>
<style scoped>
.black{
    font-size: 16px;
    color: black;
    font-weight: bold;
    margin-bottom: 20px;
}
.text{
    font-size: 14px;
    color: #666666;
    margin-bottom: 20px;
}
</style>
