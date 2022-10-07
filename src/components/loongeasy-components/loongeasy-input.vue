<template>
  <el-form-item
    ref="input"
    :label="labels+' : '"
    :prop="propName"
    :rules="newRules"
    :code="code"
    :version="version"
    :label-width="labelWidth"
  >
    <el-input
      v-show="showMaskInput === false"
      v-model="inputValue"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      :autofocus="autofocus"
      :size="size"
    >
      <i
        v-show="regex !== '' &&replacement !== '' && isMasking === true"
        slot="suffix"
        class="el-icon-view"
        @click="showMask"
      />
    </el-input>
    <el-input
      v-show="showMaskInput === true"
      v-model="maskValue"
      :size="size"
      readonly
    >
      <i
        v-show="regex !== '' &&replacement !== '' && isMasking === true"
        slot="suffix"
        class="el-icon-view"
        @click="showMask"
      />
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'LoongeasyInput',
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
    size: {
      type: String,
      default: 'small'
    },
    isMasking: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      type: '',
      propName: this.prop,
      inputValue: '',
      maskValue: '',
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
      getNewData: false,
      showMaskInput: false
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
        this.inputValue = nval
      }
    },
    inputValue(nval, oval) {
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
    showMask() {
      if (this.showMaskInput === false) {
        this.maskValue = this.inputValue
        const string1 = '^' + this.regex + '$'
        const newString1 = new RegExp(string1)
        const string2 = this.replacement
        this.maskValue = this.maskValue.replace(newString1, string2)
        debugger
        if (this.maskValue !== this.inputValue) {
          this.showMaskInput = true
        } else {
          this.showMaskInput = false
        }
      } else {
        this.showMaskInput = false
      }
    },
    getClassType() {
      var o = this.$refs.input.$el.className
      if (o.includes('hxStandard') === true) {
        this.type = 'hxStandard'
      } else {
        this.type = 'dictionary'
      }
    }
  }
}
</script>
