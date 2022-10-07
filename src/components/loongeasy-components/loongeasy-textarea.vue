<template>
  <el-form-item
    ref="textarea"
    :label="labels+' : '"
    :prop="propName"
    :rules="newRules"
    :code="code"
    :version="version"
    :label-width="labelWidth"
  >
    <el-input
      type="textarea"
      v-model="textareaValue"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      :autofocus="autofocus"
      :rows="rows"
      :autosize="autosize"
    >
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'LoongeasyTextarea',
  props: {
    code: {
      required: true,
      type: String
    },
    version: {
      type: String,
      default: '2.0'
    },
    value: {
      type: String
    },
    prop: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autosize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: '',
      propName: this.prop,
      textareaValue: '',
      labels: '',
      checkRule: '',
      errorMessage: '',
      regex: '',
      replacement: '',
      newRules: [{
        required: this.required,
        message: this.labels + '不能为空！',
        trigger: 'blur'
      },
      {
        pattern: new RegExp(this.checkRule),
        message: this.errorMessage,
        trigger: 'blur'
      }
      ],
      getNewData: false
    }
  },
  watch: {
    '$store.state.app.huaxiaStandard': {
      handler: function(newVal, oldVal) {
        this.getNewData = true
        var key
        if (this.type === 'hxStandard') {
          key = this.code + '_' + this.version
        } else {
          key = this.code
        }
        if (newVal[key]) {
          this.labels = newVal[key].nameZh
          this.checkRule = newVal[key].checkRule
          this.errorMessage = newVal[key].prompt
          if (newVal[key].regex && newVal[key].replacement) {
            this.regex = newVal[key].regex
            this.replacement = newVal[key].replacement
          }
          this.newRules = [{
            required: this.required,
            message: this.labels + '不能为空！',
            trigger: 'blur'
          },
          {
            pattern: new RegExp(this.checkRule),
            message: this.errorMessage,
            trigger: 'blur'
          }
          ]
        }
      }
    },
    value(nval, oval) {
      if (nval !== oval) {
        this.textareaValue = nval
      }
    },
    textareaValue(nval, oval) {
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
        this.checkRule = this.$store.state.app.huaxiaStandard[key].checkRule
        this.errorMessage = this.$store.state.app.huaxiaStandard[key].prompt
        this.regex = this.$store.state.app.huaxiaStandard[key].regex
        this.replacement = this.$store.state.app.huaxiaStandard[key].replacement
        this.newRules = [{
          required: this.required,
          message: this.labels + '不能为空！',
          trigger: 'blur'
        },
        {
          pattern: new RegExp(this.checkRule),
          message: this.errorMessage,
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    getClassType() {
      var o = this.$refs.textarea.$el.className
      if (o.includes('hxStandard') === true) {
        this.type = 'hxStandard'
      } else {
        this.type = 'dictionary'
      }
    }
  }
}
</script>
