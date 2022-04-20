
import { createElement, createTextNode } from './vnode/create-element'

export function renderMixin(Vue) {
  // 创建元素
  Vue.prototype._c = function () {
    return createElement(...arguments)
  }
  // 创建文本
  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }
  // JSON.stringify
  Vue.prototype._s = function (val) {
    return !val ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }


  // _c创建元素 _v创建文本 _s JSON.stringily
  Vue.prototype._render = function () {
    const vm = this
    const { render } = vm.$options
    let vnode = render.call(vm)
    return vnode
  }

}