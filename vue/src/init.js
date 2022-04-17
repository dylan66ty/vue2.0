import { initState } from './state'
import { compileToFunction } from './compiler/index'
import { mountComponent } from './lifycycle'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 初始化 
    const vm = this
    vm.$options = options
    initState(vm)


    // el存在,实现挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }

  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = typeof el === 'string' ? document.querySelector(el) : el
    //优先级
    // render
    // template
    // el
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
        // template 转换成render函数
        // 1.0 纯字符串 正则匹配 (性能不高)
        // 2.0 vnode dom diff 

        // 模板编译 htmlStr->ast->render函数
        const render = compileToFunction(template)
        options.render = render
      }
    }
    // 挂载组件
    mountComponent(vm, el)

  }
}

