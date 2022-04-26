
export function isObject(data) {
  return typeof data === 'object' && data !== null
}

export function isArray(data) {
  return Array.isArray(data)
}

// 向一个对象添加不可枚举的属性
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    configurable: false,
    enumerable: false,
    value
  })
}

export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}


const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed'
]

const strats = {}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal)
  // child组件先找自身的 再找parent 
  if (childVal) {
    for (let key in child) {
      res[key] = childVal[key]
    }
  }
  return res
}

strats.components = mergeAssets

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }

}

export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }

  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }

  }

  // 默认的合并策略
  function mergeField(key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = { ...parent[key], ...child[key] }
    } else if (child[key] == null) {
      options[key] = parent[key]
    } else {
      options[key] = child[key]
    }
  }

  return options

}

export function isReservedTag(tagName) {
  const tagStr = 'div,p,span,input'
  const obj = {}
  tagStr.split(',').forEach(tag => {
    obj[tag] = true
  })
  return obj[tagName]
}