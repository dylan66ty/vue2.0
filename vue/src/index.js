import { initMixin } from './init'
import { renderMixin } from './render'
import { lifycycleMixin } from './lifycycle'
import { initGlobalApi } from './init-global-api/index'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifycycleMixin(Vue)


//初始化全局的api
initGlobalApi(Vue)

export default Vue


import { compileToFunction } from './compiler/index'
import { patch, createEle } from './vnode/patch'
const vm1 = new Vue({
  data: {
    name: 'vm1'
  }
})
const render1 = compileToFunction('<div id="app" style="color:red;background:red;">{{name}}</div>')
const vnode1 = render1.call(vm1)
const el1 = createEle(vnode1)
document.body.appendChild(el1)

const vm2 = new Vue({
  data: {
    name: 'vm2'
  }
})
const render2 = compileToFunction('<div id="app1" style="color:blue;">{{name}}</div>')
const vnode2 = render2.call(vm2)

setTimeout(() => {
  patch(vnode1, vnode2)

}, 1000);
// 1. diff算法的特点 平级比对 o(n)