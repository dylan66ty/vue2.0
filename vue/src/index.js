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
const render1 = compileToFunction(`<div id="app">
   <div key="A" style="background:red;">A</div>
   <div key="B" style="background:yellow;">B</div>
   <div key="C" style="background:blue;">C</div>
   <div key="D" style="background:green;">D</div>
</div>`)
const vnode1 = render1.call(vm1)
const el1 = createEle(vnode1)
document.body.appendChild(el1)

const vm2 = new Vue({
  data: {
    name: 'vm2'
  }
})
const render2 = compileToFunction(`<div id="app">
   <div  key="A" style="background:red;">A</div>
   <div  key="B" style="background:yellow;">B</div>
   <div  key="C" style="background:blue;">C</div>
   <div  key="D" style="background:green;">D</div>
   <div  key="E" style="background:green;">E</div>
</div>`)
const vnode2 = render2.call(vm2)

setTimeout(() => {
  patch(vnode1, vnode2)

}, 1000);
// 1. diff算法的特点 平级比对 o(n)