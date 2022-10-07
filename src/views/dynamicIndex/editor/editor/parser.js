'use strict';
const { initChild, getChild } = require('./utils');

const ARRAY_KEYWORDS = ['anyOf', 'oneOf', 'enum'];

function setCommonFields(schema, field, schemaName) {//用schema的数据对field进行初始化，用于生成表单字段
  // eslint-disable-next-line no-nested-ternary
  field.value = schema.hasOwnProperty('default') ? schema.default : field.hasOwnProperty('value') ? field.value : '';

  field.component = schema.component;
  field.schemaType = schema.type;
  field.label = schema.title || '';
  field.description = schema.description || '';
  field.required = schema.required || false;
  field.disabled = schema.disabled || false;
  field.name = schemaName;
}

function setFormValue(vm, field) {//用命名空间对应初始化的值进行赋值，在没接入model的情况下用schema中的值初始化vue组件的model值
  const ns = field.name.split('.');
  const vmValue = getChild(vm.value, ns);
  if (vm.value && !vmValue) {
    const n = ns.pop();
    const ret = ns.length > 0 ? initChild(vm.value, ns) : vm.value;
    vm.$set(ret, n, field.value);
  }
}

export function parseBoolean(vm, schema, schemaName) {
  const field = schema.attrs || {};

  setCommonFields(schema, field, schemaName);

  if (!field.type) {
    field.type = 'checkbox';
  }

  field.checked = schema.checked || false;

  if (schema.name) {
    field.name = schemaName;

    setFormValue(vm, field);
  }

  return field;
}

export function parseString(vm, schema, schemaName) {
  const field = schema.attrs || {};

  if (schema.format) {
    switch (schema.format) {
    case 'email':
      if (!field.type) {
        field.type = 'email';
      }
      break;
    case 'uri':
      if (!field.type) {
        field.type = 'url';
      }
      break;
    case 'regex':
      if (!field.type) {
        field.type = 'text';
      }

      field.pattern = schema.pattern;
      break;
    }
  }

  if (!field.type) {
    switch (schema.type) {
    case 'number':
    case 'integer':
      field.type = 'number';
      break;
    default:
      field.type = 'text';
    }
  }

  setCommonFields(schema, field, schemaName);

  if (schema.name) {
    field.name = schemaName;

    setFormValue(vm, field);
  }

  if (schema.minLength) {
    field.minlength = schema.minLength;
  }

  if (schema.maxLength) {
    field.maxlength = schema.maxLength;
  }

  return field;
}

export function parseItems(items) {//针对单选，多选，下拉选存在schema中的数据内容进行处理
  return items.map(item => {
    if (typeof item !== 'object') {
      return { value: item, label: item };
    }
    return item;
  });
}

export function parseArray(vm, schema, schemaName) {
  const field = schema.attrs || {};

  setCommonFields(schema, field, schemaName);

  field.multiple = schema.minItems > 1;
  field.items = [];

  if (schema.hasOwnProperty("items")&&schema.items.type === "object") {//判断是object数组类型当table处理，并且将schema保留
    field.type = 'table'
    field.properties = schema.items.properties;
    field.component = "div";
    // field.option = {"attrs":{"id":schemaName}};
  }

  for (const keyword of ARRAY_KEYWORDS) {//处理数组单选，多选，下拉选
    if (schema.hasOwnProperty(keyword)) {
      switch (keyword) {
      case 'enum':
        if (!field.type) {
          field.type = 'select';
        }
        field.value = field.value || '';
        field.items = parseItems(schema[keyword]);
        break;

      case 'oneOf':
        field.type = 'radio';
        field.value = field.value || '';
        field.items = parseItems(schema[keyword]);
        break;

      case 'anyOf':
        field.type = 'checkbox';
        field.value = field.value || [];
        field.items = parseItems(schema[keyword]);
        break;
      }
    }
  }
  if (!field.type) {
    field.type = schema.type;
    field.value = field.value || [];
    field.items = [];
  }

  if (schema.name) {
    field.name = schemaName;

    setFormValue(vm, field);
  }
  return field;
}

export function loadFields(vm, schema, fields = vm.fields, sub) {
  if (!schema || schema.visible === false) return;

  const schemaName = sub ? sub.join('.') : schema.name;

  switch (schema.type) {
  case 'object'://顶层是object对object下所有的子对象进行处理
    for (const key in schema.properties) {
      schema.properties[key].name = key;

      if (schema.required) {
        for (const field of schema.required) {
          if (schema.properties[field]) {
            schema.properties[field].required = true;//对required必须出现的字段进行条件字段赋值
          }
        }
      }
      if (schema.name && !fields[schemaName]) {//如果包含子对象判断属性进行赋值
        fields[schemaName] = {
          $sub: true,
          $title: schema.title,
          $description: schema.description,
        };
      }
      loadFields(//递归每个子对象都进行转换（用schema转换成filed）
        vm,
        schema.properties[key],
        schema.name ? fields[schemaName] : undefined,
        sub ? [...sub, key] : [key]
      );
    }
    break;

  case 'boolean':
    fields[schemaName] = parseBoolean(vm, schema, schemaName);
    break;

  case 'array':
    fields[schemaName] = parseArray(vm, schema, schemaName);
    break;

  case 'integer':
  case 'number':
  case 'string':
    for (const keyword of ARRAY_KEYWORDS) {//针对多选，单选，下拉选转义成数组
      if (schema.hasOwnProperty(keyword)) {
        schema.items = {
          type: schema.type,
          enum: schema[keyword],
        };
        fields[schemaName] = parseArray(vm, schema, schemaName);
        return;
      }
    }
    fields[schemaName] = parseString(vm, schema, schemaName);
    break;
  default:
    fields[schemaName] = parseString(vm, schema, schemaName);
  }
}
