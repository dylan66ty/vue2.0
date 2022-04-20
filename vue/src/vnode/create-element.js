export function createElement(tag, data, ...children) {
  let key = data.key
  if (key) {
    delete data.key
  }
  return vnode(tag, data, key, children, undefined)

}


export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
  return {
    componentOptions: {},
    tag, data, key, children, text
  }
}

// template -> ast语法树 -> render函数 -> 虚拟dom -> 真实的dom
// update 新旧vnode patch 到真实的dom上





