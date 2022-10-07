<template>
  <el-form-item
    ref="checkbox"
    :label="labels+' : '"
    :prop="propName"
    :rules="newRules"
    :code="code"
    :version="version"
    :label-width="labelWidth"
  >
    <el-checkbox-group v-model="checkboxValue" :disabled="disabled">
      <el-checkbox
        v-for="item in options"
        :key="item.id"
        :label="item.value"
        :value="item.key" />
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'LoongeasyCheckbox',
  props: {
    code: {
      required: true,
      type: String
    },
    value: {
      type: Array
    },
    valueType: {
      type: String,
      default: ''
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
      type: '',
      propName: this.prop,
      checkboxValue: [],
      labels: '',
      options: [],
      newRules: [{
        required: this.required,
        message: this.labels + '不能为空！',
        trigger: 'change'
      }],
      getNewData: false
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
          this.labels = this.$store.state.app.huaxiaStandard[key].nameZh
          if (this.valueType === '') {
            this.options = this.$store.state.app.huaxiaStandard[key].codeValue
          } else {
            if (this.valueType === 'numberCode') {
              this.options = this.$store.state.app.huaxiaStandard[key].numberCode
            } else if (this.valueType === 'letterCode') {
              this.options = this.$store.state.app.huaxiaStandard[key].letterCode
            } else if (this.valueType === 'twoLetterCode') {
              this.options = this.$store.state.app.huaxiaStandard[key].twoLetterCode
            } else if (this.valueType === 'threeLetterCode') {
              this.options = this.$store.state.app.huaxiaStandard[key].threeLetterCode
            }
          }
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
        this.checkboxValue = nval
      }
    },
    checkboxValue(nval, oval) {
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
        if (this.valueType === '') {
          this.options = this.$store.state.app.huaxiaStandard[key].codeValue
        } else {
          if (this.valueType === 'numberCode') {
            this.options = this.$store.state.app.huaxiaStandard[key].numberCode
          } else if (this.valueType === 'letterCode') {
            this.options = this.$store.state.app.huaxiaStandard[key].letterCode
          } else if (this.valueType === 'twoLetterCode') {
            this.options = this.$store.state.app.huaxiaStandard[key].twoLetterCode
          } else if (this.valueType === 'threeLetterCode') {
            this.options = this.$store.state.app.huaxiaStandard[key].threeLetterCode
          }
        }
        this.newRules = [{
          required: this.required,
          message: this.labels + '不能为空！',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    getClassType() {
      var o = this.$refs.checkbox.$el.className
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
</style>
