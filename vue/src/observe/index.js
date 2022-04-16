import { isObject, isArray, def } from '../utils/index'
import { arrayMethods } from './array'
class Observe {
  constructor(data) {
    // 给每个劫持过的对象增加个this
    def(data, '__ob__', this)
    // 数组
    if (isArray(data)) {
      // 避免对数组的索引进行劫持，提升性能
      // 数组里面的是对象在劫持
      // 数组的原型的上的一些方法重写 push pop unshift shift reserve sort splice
      data.__proto__ = arrayMethods
      this.observeArray(data)

    } else {
      // 对象
      this.walk(data)
    }


  }
  walk(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = data[key]
      defineReactive(data, key, value)
    }
  }
  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      // 监控数组的每一项
      observe(data[i])
    }
  }
}


export function observe(data) {
  if (!isObject(data)) return
  return new Observe(data)
}

function defineReactive(data, key, value) {
  // 递归实现深度劫持
  observe(value)
  // 缺点：1.数组length不能劫持 2.对象不存在的属性不能劫持
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) {
      if (newVal === value) return
      console.log('更新数据')
      // 如果newVal是个对象,需要劫持这个对象
      observe(newVal)
      value = newVal
    }
  })

}

