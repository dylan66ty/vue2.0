import { isObject, isReservedTag } from '../utils/index'
export function createElement(vm, tag, data, ...children) {
  let key = data.key
  if (key) {
    delete data.key
  }
  // 以前表示的是标签 现在是组件
  if (isReservedTag(tag)) {
    // 原始标签
    return vnode(tag, data, key, children, undefined)

  } else {
    // 组件的构造函数
    const Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, key, children, Ctor)
  }


}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init(vnode) {
      const child = vnode.componentInstance = new Ctor({ _isComponent: true })
      child.$mount()
    },
    inserted() {

    }
  }
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, { Ctor, children })
}


export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag, data, key, children, text, componentOptions
  }
}

// template -> ast语法树 -> render函数 -> 虚拟dom -> 真实的dom
// update 新旧vnode patch 到真实的dom上





