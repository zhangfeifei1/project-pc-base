<template>
  <el-form-item
    ref="switch"
    :label="labels+' : '"
    :prop="propName"
    :rules="newRules"
    :code="code"
    :version="version"
    :label-width="labelWidth"
  >
    <el-switch
      v-model="switchValue"
      :active-value="1"
      :inactive-value="0"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :disabled="disabled" />
  </el-form-item>
</template>

<script>
export default {
  name: 'LoongeasySwitch',
  props: {
    code: {
      required: true,
      type: String
    },
    value: {
      type: Number|String
    },
    prop: {
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
    activeColor: {
      type: String
    },
    inactiveColor: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: '2.0'
    }
  },
  data() {
    return {
      propName: this.prop,
      labels: '',
      newRules: [{
        required: this.required,
        message: this.labels + '不能为空！',
        trigger: 'change'
      }],
      getNewData: false,
      switchValue: this.value
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
        this.switchValue = nval
      }
    },
    switchValue(nval, oval) {
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
      var o = this.$refs.switch.$el.className
      if (o.includes('hxStandard') === true) {
        this.type = 'hxStandard'
      } else {
        this.type = 'dictionary'
      }
    }
  }
}
</script>
