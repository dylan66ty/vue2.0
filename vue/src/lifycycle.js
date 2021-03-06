import Watcher from './watcher'
import { patch } from './vnode/patch'
export function lifycycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // vnode -> 真实的dom
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}


export function mountComponent(vm, el) {

  const options = vm.$options
  vm.$el = el
  callHook(vm, 'beforeMount')
  // watcher 渲染的
  // vm._render 渲染出vnode _c _v _s
  // vm._update vnode创建真实的dom  
  // 渲染页面
  let updateComponent = () => {
    console.log('update')
    // 返回的是虚拟dom
    vm._update(vm._render())
  }

  // 渲染watch true表示渲染watch
  new Watcher(vm, updateComponent, () => { }, true)
  callHook(vm, 'mounted')
}


export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
