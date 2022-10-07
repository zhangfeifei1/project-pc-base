<template>
  <el-form-item
    ref="tree"
    :label="labels+' : '"
    :prop="propName"
    :label-width="labelWidth"
    :code="code"
    :version="version"
    :rules="newRules"
    class="treeClass"
  >
    <el-tree
      ref="treeModel"
      v-model="treeValue"
      show-checkbox
      :data="options"
      node-key="value"
      @check-change="handleCheckChange"
    />
  </el-form-item>
</template>

<script>
export default {
  name: 'Loongeasytree',
  props: {
    code: {
      required: true,
      type: String
    },
    value: {
      type: Array
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
      options: [],
      propName: this.prop,
      treeValue: this.value,
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
        this.treeValue = nval
      }
    },
    treeValue(nval, oval) {
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
        this.$refs.tree.clearValidate()
      })
    },
    getClassType() {
      var o = this.$refs.tree.$el.className
      if (o.includes('hxStandard') === true) {
        this.type = 'hxStandard'
      } else {
        this.type = 'dictionary'
      }
    },
    handleCheckChange() {
      var tree = this.$refs.treeModel
      this.treeValue = tree.getCheckedKeys().concat(tree.getHalfCheckedKeys())
    }
  }
}
</script>
<style scoped>
 .treeClass .el-tree{
   width: 100%;
   max-height: 300px;
   overflow-y: auto;
 }
</style>
