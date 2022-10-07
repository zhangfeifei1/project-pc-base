//返回深度拷贝
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
//obj是对象，n是属性字段名，initIt是是否进行初始化
export function getExtendibleLeaf(obj, n, initIt) {//排斥数组类型的属性字段 obj[n] 值
  const v = obj[n];
  if (v && typeof v === 'object' && !Array.isArray(v)) {//“对象obj”下的“属性字段n”是object类型并且不是数组类型返回 obj的属性字段n的值
    return v;
  }
  if (initIt && v === undefined) {//如果进行初始化当 obj的属性字段n的值 为未定义的时候返回空对象 如果不初始化不返回值
    return (obj[n] = {});
  }
}
//获取数据data中属性字段ns数组的值（排除数组字段属性的值被清空的字段值）
export function getChild(data, ns) { //数据data 和 属性字段数组ns
  if (ns.length === 1) {
    return data[ns[0]];  //属性字段数组ns 只有一个key则 直接返回 data的属性字段ns[0]的值（只有一个属性直接返回）
  }
  let obj = data[ns[0]];
  if (obj === undefined) return obj; //属性字段数组ns不为单值 data的属性字段ns[0]第一个的值 为空 直接返回（第一个为空直接返回）
  let i = 1;
  const end = ns.length - 1;
  for (; i < end; i++) {
    obj = getExtendibleLeaf(obj, ns[i], false);//不进行初始化操作保留undefined，“对象obj”下的“属性字段ns[i]”是object类型并且不是数组类型返回 obj的属性字段n的值
    if (obj === undefined) return obj; //中间间隔空值直接返回空（中间间隔空直接返回）
  }
  return obj[ns[i]]; //遍历对象中间没有空值返回第一个值（值都正常返回第一个）
}
//
export function initChild(data, ns) {
  if (ns.length === 1) {//属性字段只有一个值的数组
    const ret = getExtendibleLeaf(data, ns[0], true);
    if (ret === undefined) {
      throw new TypeError('fail to init because namespace ' + ns[0] + ' = ' + data[ns[0]]);//排斥数组类型的属性字段 data[ns[0]] 值
    }
    return ret;//字段数组只有一个值直接返回
  }
  let parent = data;
  let obj = data[ns[0]];
  if (obj === undefined) obj = data[ns[0]] = {}; //属性字段数组ns不为单值 data的属性字段ns[0]第一个的值 为空 进行初始化（第一个为空直接初始化）
  for (let i = 1; i < ns.length; i++) {
    const n = ns[i];
    const ret = getExtendibleLeaf(obj, n, true);
    if (ret === undefined) {
      throw new TypeError('fail to init because namespace ' + ns.join('.') + ' = ' + obj + '(' + typeof obj + ')');//排斥数组类型的属性字段 obj[n] 值
    }
    parent = obj;
    obj = ret;
    if (parent[n] === undefined) {
      throw new TypeError('fail to init because namespace ' + ns.slice(0, i).join('.') + ' = ' + parent);//排斥数组类型的属性字段 obj[n] 值
    }
  }
  return obj;//字段数组多个值返回最后一个，并检查之前所有的对象不为数组对象（检查 属性字段数组 的值有数组类型则抛出异常）
}

export function setVal(data, n, v) {//n是字段属性数组则用v初始化 data[数组n最后一个值]的数据 ，n是字符串则进行切割初始化字符串代表的最后一个命名空间的值
  const ns = Array.isArray(n) ? n : n.split('.');//n为数组则用 字段属性数组 如果n为字符串则用“.”切割为数组
  // eslint-disable-next-line
  n = ns.pop();
  const ret = ns.length > 0 ? initChild(data, ns) : data;//n是数组或字符串n可以切割成数组有多个值则都进行初始化，否则初始化单个值
  ret[n] = v;//对 字段属性数组n 或命名空间字符串n 最后一个值进行初始化赋值 v
  return v; //返回传入的值v
}
