import { isObject, isArray, def } from '../utils/index'
import { arrayMethods } from './array'
import Dep from '../dep'
class Observe {
  constructor(data) {
    this.dep = new Dep()
    // 给每个劫持过的对象增加个this
    def(data, '__ob__', this)
    // 数组
    if (isArray(data)) {

      this._type = 'array'
      // 避免对数组的索引进行劫持，提升性能
      // 数组里面的是对象在劫持
      // 数组的原型的上的一些方法重写 push pop unshift shift reserve sort splice
      data.__proto__ = arrayMethods
      this.observeArray(data)

    } else {
      // 对象
      this._type = 'object'
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
  const dep = new Dep()
  // 递归实现深度劫持
  const childob = observe(value)
  // 缺点：1.数组length不能劫持 2.对象不存在的属性不能劫持
  Object.defineProperty(data, key, {
    get() {
      // 取值 每个属性都有对应的watcher name: [watcher,watcher ...]
      if (Dep.target) {
        // 如果当前有watcher wacher和dep建立关系 双向依赖
        dep.depend()
        if (childob) {
          // 收集孩子的相关依赖
          childob.dep.depend()

        }

      }
      return value
    },
    set(newVal) {
      if (newVal === value) return
      // 如果newVal是个对象,需要劫持这个对象
      observe(newVal)
      value = newVal
      dep.notify() // 通知watcher更新
    }
  })

}

