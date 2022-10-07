<template>
  <el-form-item
    ref="cascader"
    :label="labels+' : '"
    :prop="propName"
    :label-width="labelWidth"
    :code="code"
    :version="version"
    :rules="newRules"
  >
    <el-cascader
      v-model="cascaderValue"
      :options="options"
      :placeholder="placeholder"
      :separator="separator"
      :filterable="filterable"
      :clearable="clearable"
      :disabled="disabled"
      :show-all-levels="showAllValues"
      :size="size"
      @change="change"
    />
  </el-form-item>
</template>

<script>
export default {
  name: 'LoongeasyCascader',
  props: {
    code: {
      required: true,
      type: String
    },
    value: {
    },
    prop: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    separator: {
      type: String,
      default: '/'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showAllValues: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    version: {
      type: String,
      default: '2.0'
    }
  },
  data() {
    return {
      options: [],
      propName: this.prop,
      cascaderValue: [],
      labels: '',
      newRules: [{
        required: this.required,
        message: this.labels + '不能为空！',
        trigger: 'change'
      }]
    }
  },
  watch: {
    '$store.state.app.huaxiaStandard': {
      handler: function(newVal, oldVal) {
        var key
        if (this.type === 'hxStandard') {
          key = this.code + '_' + this.version
        } else {
          key = this.code
        }
        if (newVal[key]) {
          this.labels = newVal[key].nameZh
          this.options = newVal[key].options
          this.newRules = [{
            required: this.required,
            message: this.labels + '不能为空！',
            trigger: 'change'
          }]
        }
      }
    },
    value(nval, oval) {
      if (nval !== oval) {
        this.cascaderValue = nval
      }
    },
    cascaderValue(nval, oval) {
      if (nval !== oval) {
        this.$emit('input', nval)
      }
    }
  },
  mounted: function() {
    this.getClassType()
    if (this.getNewData === false) {
      var key
      if (this.type === 'hxStandard') {
        key = this.code + '_' + this.version
      } else {
        key = this.code
      }
      if (this.$store.state.app.huaxiaStandard[key]) {
        this.labels = this.$store.state.app.huaxiaStandard[key].nameZh
        this.options = this.$store.state.app.huaxiaStandard[key].options
        this.newRules = [{
          required: this.required,
          message: this.labels + '不能为空！',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    change() {
      this.$nextTick(() => {
        this.$refs.cascader.clearValidate()
      })
    },
    getClassType() {
      var o = this.$refs.cascader.$el.className
      if (o.includes('hxStandard') === true) {
        this.type = 'hxStandard'
      } else {
        this.type = 'dictionary'
      }
    }
  }
}
</script>
<style scoped>
 .el-cascader{
   width: 100%;
 }
</style>
