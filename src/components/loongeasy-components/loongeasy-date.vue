<template>
  <el-form-item
    ref="date"
    :label="labels+' : '"
    :prop="propName"
    :code="code"
    :version="version"
    :rules="newRules"
    :label-width="labelWidth"
  >
    <el-date-picker
      v-model="dateValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :type="showType"
      :format="format"
      :value-format="valueFormat"
      :align="align"
    />
  </el-form-item>
</template>

<script>
export default {
  name: 'LoongeasyDate',
  props: {
    code: {
      required: true,
      type: String
    },
    value: {
      type: String | Number
    },
    prop: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    showType: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left'
    },
    version: {
      type: String,
      default: '2.0'
    }
  },
  data() {
    return {
      valueFormat: '',
      propName: this.prop,
      dateValue: '',
      labels: '',
      newRules: [{
        required: this.required,
        message: this.labels + '不能为空！',
        trigger: 'blur'
      }
      ],
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
          this.labels = newVal[key].nameZh
          this.valueFormat = newVal[key].pattern
          this.newRules = [{
            required: this.required,
            message: this.labels + '不能为空！',
            trigger: 'blur'
          }
          ]
        }
      }
    },
    value(nval, oval) {
      if (nval !== oval) {
        this.dateValue = nval
      }
    },
    dateValue(nval, oval) {
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
        this.valueFormat = this.$store.state.app.huaxiaStandard[key].pattern
        this.newRules = [{
          required: this.required,
          message: this.labels + '不能为空！',
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    getClassType() {
      var o = this.$refs.date.$el.className
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
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
</style>
