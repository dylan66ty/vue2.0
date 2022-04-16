
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