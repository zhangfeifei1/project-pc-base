<script>
import Sortable from './Sortable'

var isCreate = false

import { loadFields } from './parser'
import { initChild, getChild, setVal, deepClone } from './utils'
const option = { native: true }
const components = {
  title: { component: 'h1', option },
  description: { component: 'p', option },
  error: { component: 'div', option },
  form: { component: 'form', option },
  file: { component: 'input', option },
  label: { component: 'label', option },
  input: { component: 'input', option },
  radio: { component: 'input', option },
  select: { component: 'select', option },
  option: { component: 'option', option },
  table: { component: 'table', option },
  button: {
    component: 'button',
    option: {
      ...option,
      type: 'submit',
      label: 'Submit'
    }
  },
  checkbox: { component: 'input', option },
  textarea: { component: 'textarea', option },
  radiogroup: { component: 'div', option },
  checkboxgroup: { component: 'div', option }
}
const defaultInput = { component: 'input', option }
const defaultGroup = { component: 'div', option }

/**
 * Edit JSON in UI form with JSON Schema and Vue.js `<json-editor>` component.
 *
 * @author Yourtion
 * @license MIT
 */
export default {
  name: 'JsonEditor',
  props: {
    /**
     * The JSON Schema object. Use the `v-if` directive to load asynchronous schema.
     */
    schema: { type: Object, required: true },
    /**
     * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
     * @model
     * @default {}
     */
    value: { type: Object, default: () => ({}) },
    /**
     * This property indicates whether the value of the control can be automatically completed by the browser. Possible values are: `off` and `on`.
     */
    autoComplete: { type: String },
    /**
     * This Boolean attribute indicates that the form is not to be validated when submitted.
     */
    noValidate: { type: Boolean },
    /**
     * Define the inputs wrapping class. Leave `undefined` to disable input wrapping.
     */
    inputWrappingClass: { type: String }
  },
  data() {
    return {
      default: {},
      fields: {},
      error: null,
      data: {}
    }
  },
  created() {
    console.log('created')
    loadFields(this, deepClone(this.schema))
    this.default = deepClone(this.value)
    this.data = this.value
  },
  mounted() {
    this.reset()
  },
  methods: {
    /**
     * @private
     */
    optionValue(field, target, item = {}) {
      // 获取字段的option
      return typeof target === 'function'
        ? target({ vm: this, field, item })
        : target
    },
    /**
     * @private
     */
    elementOptions(element, extendingOptions = {}, field = {}, item = {}) {
      // 获取节点option对象
      const attrName = element.option.native ? 'attrs' : 'props'
      const elementProps =
        typeof element.option === 'function'
          ? element.option
          : { ...element.option, native: undefined }
      const options = this.optionValue(field, elementProps, item)
      return { [attrName]: { ...extendingOptions, ...options }}
    },
    /**
     * @private
     */
    changed(e) {
      /**
       * Fired when a change to the element's value is committed by the user.
       */
      this.$emit('change', e)
    },
    /**
     * Get a form input reference
     */
    input(name) {
      if (!this.$refs[name]) {
        throw new Error(`Undefined input reference '${name}'`)
      }
      return this.$refs[name][0]
    },
    /**
     * Get the form reference
     */
    form() {
      return this.$refs.__form
    },
    /**
     * Checks whether the form has any constraints and whether it satisfies them. If the form fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns false.
     */
    checkValidity() {
      return this.$refs.__form.checkValidity()
    },
    /**
     * @private
     */
    invalid(e) {
      /**
       * Fired when a submittable element has been checked and doesn't satisfy its constraints. The validity of submittable elements is checked before submitting their owner form, or after the `checkValidity()` of the element or its owner form is called.
       */
      this.$emit('invalid', e)
    },
    /**
     * Reset the value of all elements of the parent form.
     */
    reset() {
      for (const key in this.data) {
        const ns = key.split('.')
        const n = ns.pop()
        const ret = ns.length > 0 ? initChild(this.data, ns) : this.data
        const value = getChild(this.default, key.split('.'))
        this.$set(ret, n, value)
      }
    },
    /**
     * Send the content of the form to the server
     */
    submit(event) {
      if (this.checkValidity()) {
        /**
         * Fired when a form is submitted
         */
        this.$emit('submit', event)
      }
    },
    /**
     * Set a message error.
     */
    setErrorMessage(message) {
      this.error = message
    },
    /**
     * clear the message error.
     */
    clearErrorMessage() {
      this.error = null
    }
  },
  render(createElement) {
    console.log('render')

    const nodes = [] // 最外层node
    if (this.schema.title) {
      nodes.push(createElement(components.title.component, this.schema.title))
    }
    if (this.schema.description) {
      nodes.push(
        createElement(components.description.component, this.schema.description)
      )
    }
    if (this.error) {
      const errorOptions = this.elementOptions(components.error)
      const errorNodes = []
      if (components.error.option.native) {
        errorNodes.push(this.error)
      }
      nodes.push(
        createElement(components.error.component, errorOptions, errorNodes)
      )
    }
    const allFormNodes = [] // form的所有节点
    const formNode = {
      // form的内部节点
      root: {}
    }
    function createForm(fields, sub) {
      let createFormInstance
      if (sub) {
        createFormInstance = setVal(formNode, sub.pop(), {})
      } else {
        createFormInstance = formNode.root
      }

      if (Object.keys(fields).length) {
        Object.keys(fields).forEach((key) => {
          const innerFormNodes = []
          if (key.indexOf('$') === 0) return
          const field = fields[key]
          if (field.$sub) {
            // 如果是子节点，递归创建子节点
            return createForm.call(this, field, sub ? [...sub, key] : [key])
          }
          const fieldName = field.name

          const fieldValue = getChild(this.value, fieldName.split('.'))
          if (!field.value) {
            field.value = fieldValue
          }
          // 如果有自定义组件节点则初始化自定义组件
          const customComponent = field.component
            ? { component: field.component, option: {}}
            : undefined
          // eslint-disable-next-line
          const element = field.component
            ? customComponent
            : field.hasOwnProperty('items') && field.type !== 'select'
              ? components[`${field.type}group`] || defaultGroup
              : components[field.type] || defaultInput
          const fieldOptions = this.elementOptions(element, field, field)
          const children = []
          const input = {
            ref: fieldName,
            domProps: {
              value: fieldValue
            },
            on: {
              input: (event) => {
                if (event instanceof Object) {
                  if (event.target && event.target.id) {
                    return
                    console.log(event.target.value)
                    // this.$nextTick(() => {
                    var typegroup = event.target.id.split(':')
                    var objgroup = typegroup[0].split('.')
                    if (objgroup.length == 1) {
                      this.$set(
                        this.data[objgroup[0]][typegroup[1]],
                        typegroup[2],
                        event.target.value
                      )
                    } else if (objgroup.length == 2) {
                      // this.data[objgroup[0]][objgroup[1]][typegroup[1]][typegroup[2]] = event.target.value;
                      this.$set(
                        this.data[objgroup[0]][objgroup[1]][typegroup[1]],
                        typegroup[2],
                        event.target.value
                      )
                    } else if (objgroup.length == 3) {
                      this.$set(
                        this.data[objgroup[0]][objgroup[1]][objgroup[2]][
                          typegroup[1]
                        ],
                        typegroup[2],
                        event.target.value
                      )
                    } else if (objgroup.length == 4) {
                      this.$set(
                        this.data[objgroup[0]][objgroup[1]][objgroup[2]][
                          objgroup[3]
                        ][typegroup[1]],
                        typegroup[2],
                        event.target.value
                      )
                    } else if (objgroup.length == 5) {
                      this.$set(
                        this.data[objgroup[0]][objgroup[1]][objgroup[2]][
                          objgroup[3]
                        ][objgroup[4]][typegroup[1]],
                        typegroup[2],
                        event.target.value
                      )
                    } else if (objgroup.length == 6) {
                      this.$set(
                        this.data[objgroup[0]][objgroup[1]][objgroup[2]][
                          objgroup[3]
                        ][objgroup[4]][objgroup[5]][typegroup[1]],
                        typegroup[2],
                        event.target.value
                      )
                    }
                    // });
                    // debugger;
                    console.log(event.target.value)
                    console.log(event.target.id)

                    return
                  }
                }
                const value =
                  event && event.target ? event.target.value : event
                const ns = fieldName.split('.')
                const n = ns.pop()
                const ret =
                  ns.length > 0 ? initChild(this.data, ns) : this.data
                this.$set(ret, n, value)
                /**
                 * Fired synchronously when the value of an element is changed.
                 */
                this.$emit('input', this.data)
              },
              change: this.changed
            },
            ...fieldOptions
          }
          delete field.value
          switch (field.type) {
            case 'table':
              console.log('table:' + field.name)

              var tableDataObj = {}
              var objgroup = fieldName.split('.')
              if (objgroup.length == 1) {
                tableDataObj = deepClone(this.data[objgroup[0]])
              } else if (objgroup.length == 2) {
                tableDataObj = deepClone(this.data[objgroup[0]][objgroup[1]])
              } else if (objgroup.length == 3) {
                tableDataObj = deepClone(
                  this.data[objgroup[0]][objgroup[1]][objgroup[2]]
                )
              }
              // console.log(JSON.stringify(tableDataObj,null,4));

              if (field.hasOwnProperty('items')) {
                // console.log(JSON.stringify(field,null,4))
                // console.log(JSON.stringify(field.properties,null,4))
                var fieldData = new Array()
                for (var i = 0; i < tableDataObj.length; i++) {
                  var itemObj = {}
                  for (var obj in field.properties) {
                    itemObj[obj] = tableDataObj[i][obj]
                  }
                  fieldData.push(itemObj)
                }
                console.log(JSON.stringify(fieldData, null, 4))
                var titleArray = new Array()
                for (var obj in field.properties) {
                  titleArray.push({
                    label: field.properties[obj].title,
                    prop: obj
                  })
                }
                console.log(JSON.stringify(field.properties, null, 4))

                var _that = this
                if (!field.required) {
                  children.push(
                    createElement({
                      // el-table-column  :key="`col_${index}`"

                      template: `
                          <el-table :id="tableid"
                            size="small"
                            :default-sort="{ prop: 'sortNum', order: 'ascending' }"
                            :data="tableData"
                            border
                            align="left"
                          >
                            <el-table-column
                              show-overflow-tooltip
                              v-for="(item, index) in tableTitle"
                              :prop="tableTitle[index].prop"
                              :label="item.label"
                            >
                              <template slot-scope="scope">
                                <p v-if="item.label === '操作'">
                                  <el-button size="mini" icon="el-icon-sort" type="primary">拖动可排序</el-button>
                                </p>
                                <p v-else>
                                  <el-input placeholder="请输入内容" :id="tableid+':'+scope.$index+':'+tableTitle[index].prop" @blur="blurAction" v-model="scope.row[tableTitle[index].prop]"></el-input>
                                </p>  
                              </template>
                            </el-table-column>
                          </el-table>
                        `,
                      props: {
                        tableid: { type: String, default: field.name }
                      },
                      data: () => {
                        titleArray.push({ label: '操作', prop: '' })
                        return {
                          tableTitle: titleArray,
                          tableData: fieldData
                        }
                      },
                      mounted() {
                        console.log('mounted')
                        this.$nextTick(() => {
                          this.rowDrop()
                        })
                      },
                      methods: {
                        blurAction(event) {
                          if (event.target && event.target.id) {
                            var typegroup = event.target.id.split(':')
                            var objgroup = typegroup[0].split('.')
                            if (objgroup.length == 1) {
                              _that.$set(
                                _that.data[objgroup[0]][typegroup[1]],
                                typegroup[2],
                                event.target.value
                              )
                            } else if (objgroup.length == 2) {
                              _that.$set(
                                _that.data[objgroup[0]][objgroup[1]][
                                  typegroup[1]
                                ],
                                typegroup[2],
                                event.target.value
                              )
                            } else if (objgroup.length == 3) {
                              _that.$set(
                                _that.data[objgroup[0]][objgroup[1]][
                                  objgroup[2]
                                ][typegroup[1]],
                                typegroup[2],
                                event.target.value
                              )
                            } else if (objgroup.length == 4) {
                              _that.$set(
                                _that.data[objgroup[0]][objgroup[1]][
                                  objgroup[2]
                                ][objgroup[3]][typegroup[1]],
                                typegroup[2],
                                event.target.value
                              )
                            } else if (objgroup.length == 5) {
                              _that.$set(
                                _that.data[objgroup[0]][objgroup[1]][
                                  objgroup[2]
                                ][objgroup[3]][objgroup[4]][typegroup[1]],
                                typegroup[2],
                                event.target.value
                              )
                            } else if (objgroup.length == 6) {
                              _that.$set(
                                _that.data[objgroup[0]][objgroup[1]][
                                  objgroup[2]
                                ][objgroup[3]][objgroup[4]][objgroup[5]][
                                  typegroup[1]
                                ],
                                typegroup[2],
                                event.target.value
                              )
                            }
                            return
                          }
                        },
                        rowDrop() {
                          console.log(field.name)
                          const tbody = document
                            .getElementById(field.name)
                            .querySelector('.el-table__body-wrapper tbody')
                          Sortable.create(tbody, {
                            onEnd: (evt) => {
                              this.tableData.splice(
                                evt.newIndex,
                                0,
                                this.tableData.splice(evt.oldIndex, 1)[0]
                              )
                              var newArray = this.tableData.slice(0)
                              this.tableData = []
                              this.$nextTick(() => {
                                this.tableData = newArray
                                var objgroup = fieldName.split('.')
                                if (objgroup.length == 1) {
                                  _that.$set(
                                    _that.data,
                                    [objgroup[0]],
                                    newArray
                                  )
                                } else if (objgroup.length == 2) {
                                  _that.$set(
                                    _that.data[objgroup[0]],
                                    [objgroup[1]],
                                    newArray
                                  )
                                } else if (objgroup.length == 3) {
                                  _that.$set(
                                    _that.data[objgroup[0]][objgroup[1]],
                                    [objgroup[2]],
                                    newArray
                                  )
                                }
                              })
                            }
                          })
                        }
                      }
                    })
                  )

                  this.$nextTick(() => {
                    return
                    console.log('初始化排序组件' + field.name)
                    var table = document.getElementById(field.name)
                    console.log(table.innerHTML)
                    var sortable = new Sortable(table, {
                      delay: 0,
                      animation: 0,
                      onEnd: (evt) => {
                        console.log('onEnd')
                        for (var i = 0; i < titleArray.length; i++) {
                          var oldID =
                            fieldName +
                            ':' +
                            evt.oldIndex +
                            ':' +
                            titleArray[i]
                          var newID =
                            fieldName +
                            ':' +
                            evt.newIndex +
                            ':' +
                            titleArray[i]
                          var oldDom = document.getElementById(oldID)
                          var newDom = document.getElementById(newID)
                          newDom.id = 'temp'
                          oldDom.id = newID
                          newDom.id = oldID
                        }
                        // return;
                        var newArray = deepClone(fieldData)
                        // console.log(JSON.stringify(newArray,null,4));
                        var tempValue = newArray[evt.oldIndex]
                        newArray[evt.oldIndex] = newArray[evt.newIndex]
                        newArray[evt.newIndex] = tempValue
                        // console.log(JSON.stringify(newArray,null,4));

                        // this.$nextTick(() => {
                        console.log('执行更新拖拽后的数据')

                        var objgroup = fieldName.split('.')
                        if (objgroup.length == 1) {
                          // this.data[objgroup[0]] = newArray;
                          // this.$set(this.data,[objgroup[0]],newArray);
                        } else if (objgroup.length == 2) {
                          // this.data[objgroup[0]][objgroup[1]] = newArray;

                          // var tempValue = this.data[objgroup[0]][objgroup[1]][evt.oldIndex];
                          // this.data[objgroup[0]][objgroup[1]][evt.oldIndex] = this.data[objgroup[0]][objgroup[1]][evt.newIndex];
                          // this.data[objgroup[0]][objgroup[1]][evt.newIndex] = tempValue;

                          this.$set(
                            this.data[objgroup[0]],
                            [objgroup[1]],
                            newArray
                          )
                          this.$emit('input', this.data)
                        } else if (objgroup.length == 3) {
                          // this.data[objgroup[0]][objgroup[1]][objgroup[2]] = newArray;
                          this.$set(
                            this.data[objgroup[0]][objgroup[1]],
                            [objgroup[2]],
                            newArray
                          )
                        }
                        // });

                        // console.log(JSON.stringify(this.data,null, 4));
                      }
                    })
                  })
                }
              }
              break
            case 'textarea':
              if (element.option.native) {
                input.domProps.innerHTML = fieldValue
              }
              break
            case 'radio':
            case 'checkbox':
              if (field.hasOwnProperty('items')) {
                field.items.forEach((item) => {
                  const itemOptions = this.elementOptions(
                    components[field.type],
                    item,
                    item,
                    item
                  )
                  children.push(
                    createElement(
                      components[field.type].component,
                      itemOptions,
                      item.label
                    )
                  )
                })
              }
              break
            case 'select':
              if (!field.required) {
                children.push(createElement(components.option.component))
              }
              field.items.forEach((option) => {
                const optionOptions = this.elementOptions(
                  components.option,
                  {
                    value: option.value
                  },
                  field
                )
                children.push(
                  createElement(
                    components.option.component,
                    {
                      domProps: {
                        value: option.value
                      },
                      ...optionOptions
                    },
                    option.label
                  )
                )
              })
              break
          }
          const inputElement = createElement(
            element.component,
            input,
            children
          )

          const formControlsNodes = []
          if (field.label && !option.disableWrappingLabel) {
            const labelOptions = this.elementOptions(
              components.label,
              field,
              field
            )
            const labelNodes = []
            if (components.label.option.native) {
              labelNodes.push(
                createElement(
                  'span',
                  {
                    attrs: {
                      'data-required-field': field.required ? 'true' : 'false'
                    }
                  },
                  field.label
                )
              )
            }
            labelNodes.push(inputElement)
            if (field.description) {
              labelNodes.push(createElement('br'))
              labelNodes.push(createElement('small', field.description))
            }
            formControlsNodes.push(
              createElement(
                components.label.component,
                labelOptions,
                labelNodes
              )
            )
          } else {
            formControlsNodes.push(inputElement)
            if (field.description) {
              formControlsNodes.push(createElement('br'))
              formControlsNodes.push(createElement('small', field.description))
            }
          }
          if (this.inputWrappingClass) {
            innerFormNodes.push(
              createElement(
                'div',
                {
                  class: this.inputWrappingClass
                },
                formControlsNodes
              )
            )
          } else {
            formControlsNodes.forEach((createFormInstance) =>
              innerFormNodes.push(createFormInstance)
            )
          }
          createFormInstance[key] = innerFormNodes[0]
        })
      }
    }
    createForm.call(this, this.fields) // 相当于针对当前组件JsonEditor调用createForm方法并传入this.fields用schema转换后的数据数据

    function createNode(fields, sub) {
      const createNodeInnerNodes = []
      const subName = sub && sub.pop()
      if (fields.$title) {
        createNodeInnerNodes.push(
          createElement(
            'div',
            {
              class: 'sub-title'
            },
            fields.$title
          )
        )
      }
      Object.keys(fields).forEach((key) => {
        if (key.indexOf('$') === 0) return
        const field = fields[key]
        if (field.$sub) {
          const createNodeInstance = createNode.call(
            this,
            field,
            sub ? [...sub, key] : [key]
          )
          createNodeInnerNodes.push(
            createElement(
              'div',
              {
                class: 'sub'
              },
              createNodeInstance
            )
          )
        } else if (subName) {
          createNodeInnerNodes.push(
            getChild(formNode, subName.split('.'))[key]
          ) // 将form节点插入node节点
        } else {
          createNodeInnerNodes.push(formNode.root[key]) // 将form节点插入node节点
        }
      })
      return createNodeInnerNodes
    }
    const formNodes = createNode.call(this, this.fields)
    allFormNodes.push(formNodes)

    const labelOptions = this.elementOptions(components.label)
    const button = this.$slots.hasOwnProperty('default') // 获得插槽节点
      ? { component: this.$slots.default, option }
      : components.button
    if (button.component instanceof Array) {
      allFormNodes.push(
        createElement(
          components.label.component,
          labelOptions,
          button.component
        )
      )
    } else {
      const buttonOptions = this.elementOptions(button)
      const buttonElement = createElement(
        button.component,
        buttonOptions,
        button.option.label
      )
      allFormNodes.push(
        createElement(components.label.component, labelOptions, [buttonElement])
      )
    }
    const formOptions = this.elementOptions(components.form, {
      autocomplete: this.autocomplete,
      novalidate: this.novalidate
    })
    nodes.push(
      createElement(
        components.form.component,
        {
          ref: '__form',
          on: {
            submit: (event) => {
              event.stopPropagation()
              this.submit(event)
            },
            invalid: this.invalid
          },
          ...formOptions
        },
        allFormNodes
      )
    )
    return createElement('div', nodes)
  },
  setComponent(type, component, option = {}) {
    // 绑定UI组件库到基础组件做组件映射
    components[type] = { component, option }
  }
}
</script>
