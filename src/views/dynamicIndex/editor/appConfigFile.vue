<template>
  <el-row>
    <el-col :span="24" style="padding-bottom:30px">
      <el-collapse accordion style="margin-bottom:30px">
        <el-collapse-item title="新建路由配置">
          <el-card class="form">
            <div slot="header" class="clearfix">
              <span style="font-size:18px">新建路由</span>
            </div>
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
                <el-form-item label="路由指令：" prop="routerText">
                  <div class="json">{{ routerString }}
                    <el-alert type="info" show-icon :closable="false">请手动复制路由指令到指定位置
                    </el-alert>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <!-- 按钮区域 -->
            <!-- <div style="text-align:center">
          <el-button type="primary" size="small" style="margin-bottom:20px" @click="handleCopyRouter">复制路由指令</el-button>
        </div> -->
          </el-card>
        </el-collapse-item>
      </el-collapse>
      <el-card class="form">
        <json-editor ref="JsonEditor" v-model="model" :schema="schema">
          <div style="text-align:center">
            <el-button size="small" @click="goBack">返回</el-button>
            <el-button type="primary" size="small" @click="submitAppEditData">提交</el-button>
          </div>
        </json-editor>
      </el-card>
    </el-col>
    <!-- <el-col :span="8">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>RouterConfig</span>
        </div>
        <pre class="json">{{ jsonString }}</pre>
      </el-card>
    </el-col> -->
    <!-- <el-col :span="24">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Action</span>
        </div>
        <div class="json">{{ routerString }}</div>
      </el-card>
    </el-col> -->
  </el-row>
</template>

<script>
import qs from 'qs'
import axios from 'axios'

import JsonEditor from './editor/JsonEditor'
import { Option } from 'element-ui'

JsonEditor.setComponent('form', 'el-form', ({ vm }) => {
  // vm is the JsonEditor VM
  // console.log(JSON.stringify(vm.data));
  // console.log(JSON.stringify(vm.fields));

  const labelWidth = '120px'
  const model = vm.data
  const rules = {}

  function parseField(fields) {
    Object.keys(fields).forEach((key) => {
      if (key.indexOf('$') === 0 && key !== '$sub') return
      const field = fields[key]
      if (field.$sub) {
        return parseField(field)
      }
      if (!field.name) return
      rules[field.name] = []
      // http://element.eleme.io/#/en-US/component/form#validation
      const type =
        field.schemaType === 'array' && field.type === 'radio'
          ? 'string'
          : field.schemaType
      const required = field.required
      const message = field.title
      const trigger = ['radio', 'checkbox', 'select'].includes(field.type)
        ? 'change'
        : 'blur'
      rules[field.name].push({ type, required, message, trigger })

      if (field.minlength !== undefined || field.maxlength !== undefined) {
        const max = field.maxlength || 255
        const min = field.minlength || 0
        const msg = `Length must between ${min} and ${max}`
        rules[field.name].push({ min, max, message: msg, trigger })
      }
    })
  }

  parseField(vm.fields)

  // returning the form props
  return { labelWidth, rules, model }
})

// http://element.eleme.io/#/en-US/component/form#validation
JsonEditor.setComponent('label', 'el-form-item', ({ field }) => ({
  prop: field.name
}))

JsonEditor.setComponent('email', 'el-input')
JsonEditor.setComponent('url', 'el-input')
JsonEditor.setComponent('number', 'el-input-number')
JsonEditor.setComponent('text', 'el-input')
JsonEditor.setComponent('textarea', 'el-input')
JsonEditor.setComponent('checkbox', 'el-checkbox')
JsonEditor.setComponent('checkboxgroup', 'el-checkbox-group')
JsonEditor.setComponent('radio', 'el-radio')
JsonEditor.setComponent('select', 'el-select')
JsonEditor.setComponent('switch', 'el-switch')
JsonEditor.setComponent('color', 'el-color-picker')
JsonEditor.setComponent('rate', 'el-rate')
// JsonEditor.setComponent("table", "el-table",  ({ field }) => {
//   console.log(JSON.stringify(field))
//   return {
//     ref:"tabssss"
//   };
// });

// You can also use the component object
JsonEditor.setComponent('option', Option)

// By default `<h1/>` is used to render the form title.
// To override this, use the `title` type:
JsonEditor.setComponent('title', 'h2')

// By default `<p/>` is used to render the form title.
// To override this, use the `description` type:
JsonEditor.setComponent('description', 'small')

// By default `<div/>` is used to render the message error.
// To override this, use the `error` type:
JsonEditor.setComponent('error', 'el-alert', ({ vm }) => ({
  type: 'error',
  title: vm.error
}))

import $config from '@/settings/defaultSetting'
import {
  getToken
} from '@/utils/util'
import { editAppCompJsonApi } from '@/api/appComponentApi'
function syncRequestData(url, param) {
  var xmlhttp = new XMLHttpRequest()
  var result = null

  xmlhttp.open('POST', url, false)

  var header = $config.apiUrl.headers
  for (const key in header) {
    xmlhttp.setRequestHeader(key, header[key])
  }
  const token = getToken()
  if (token) {
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token)
  }
  xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xmlhttp.setRequestHeader('Accept', 'application/json,*/*')
  xmlhttp.setRequestHeader('appid', 1552274783265)

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      // 同步请求成功
      // debugger
      result = JSON.parse(xmlhttp.responseText)['data']
    } else {
      result = JSON.parse(xmlhttp.responseText)
    }
  }

  xmlhttp.send(qs.stringify(param))
  return result
}
export default {
  components: { JsonEditor },
  props: {
    appConfigDialog: {
      type: Boolean
    }
  },

  data: () => ({
    schema: {},
    model: {},
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
  }),
  computed: {
    jsonString() {
      return JSON.stringify(this.model, null, 2).trim()
    },
    routerString() {
      var param = this.newRouterForm.param
      var resultStr = ''
      for (var obj in this.newRouterForm) {
        if (obj !== 'param') {
          resultStr += obj + '=' + this.newRouterForm[obj]
          resultStr += '|'
        } else if (obj === 'param') {
          resultStr += 'param:'
          for (var objs in param) {
            resultStr += objs + '=' + param[objs]
            resultStr += '&'
          }
        }
      }
      if (
        resultStr.charAt(resultStr.length - 1) === '|' ||
        resultStr.charAt(resultStr.length - 1) === '&'
      ) {
        resultStr = resultStr.substring(0, resultStr.length - 1)
      }
      return resultStr
    }
  },
  created() {
    // 获取data.schema 的json
    this.schema = syncRequestData('/pmobile/dynamic/comp/getCompJson', {
      compName: this.$store.state.dynamic.dynamicPageData.compName,
      fileName: 'data.schema',
      appId: sessionStorage.getItem('appId')
    })
    // 获取data内容的json
    this.model = syncRequestData('/pmobile/dynamic/comp/getCompJson', {
      compName: this.$store.state.dynamic.dynamicPageData.compName,
      fileName: 'data',
      appId: sessionStorage.getItem('appId')
    })
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    submit() {
      this.$refs.JsonEditor.form().validate((valid) => {
        if (valid) {
          // this.model contains the valid data according your JSON Schema.
          // You can submit your model to the server here

          // eslint-disable-next-line no-console
          console.log('model', JSON.stringify(this.model))

          axios({
            method: 'post',
            url: '/pweb/setModel.do',
            data: this.model
          }).then((response) => {
            this.model = response.data
          })

          this.$refs.JsonEditor.clearErrorMessage()
        } else {
          this.$refs.JsonEditor.setErrorMessage(
            'Please fill out the required fields'
          )
          return false
        }
      })
    },
    submitAppEditData() {
      const params = {
        compName: this.$store.state.dynamic.dynamicPageData.compName,
        fileName: 'data',
        json: JSON.stringify(this.model),
        appId: sessionStorage.getItem('appId'),
        themeId: ''
      }
      editAppCompJsonApi(params).then(res => {
        if (res.returnCode === '000000') {
          this.$message.success('修改成功')
          this.$emit('update:appConfigDialog', false)
        }
      })
    },
    goBack() {
      this.$emit('update:appConfigDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  text-align: left;
  width: 90%;
  margin: auto;
}

h2 {
  font-size: 1.7em;
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.2em;
}

h2 + small {
  display: block;
  text-align: center;
  margin-bottom: 1.2em;
}

small {
  line-height: 20px;
  display: block;
}

.el-alert {
  margin-bottom: 15px;
}

.el-form .sub {
  margin-left: 10%;
}

.json {
  text-align: left;
}
/deep/.el-collapse-item__header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 48px;
    line-height: 48px;
    padding-left: 28px;
    background-color: #FFF;
    color: #303133;
    cursor: pointer;
    border-bottom: 1px solid #EBEEF5;
    font-size: 14px;
    font-weight: 500;
    -webkit-transition: border-bottom-color .3s;
    transition: border-bottom-color .3s;
    outline: 0;
}
/deep/.el-collapse-item__content {
    padding-bottom: 10px;
    padding-top: 30px;
    font-size: 13px;
    color: #303133;
    line-height: 1.769230769230769;
}
</style>
