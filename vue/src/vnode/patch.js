export function patch(oldVnode, vnode) {
  // oldVnode 第一次是真实的标签。
  // 递归创建真实的节点 替换到老的节点
  // 判断是更新还是渲染
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldEle = oldVnode
    const parentEle = oldEle.parentNode
    const el = createEle(vnode)
    parentEle.insertBefore(el, oldEle.nextSibling)
    parentEle.removeChild(oldEle)
    return el
  }
}

function createEle(vnode) {
  const { tag, children, key, data, text } = vnode
  // 标签
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updataProperties(vnode)
    children.forEach(child => { // 递归创建节点
      vnode.el.appendChild(createEle(child))
    })
    // 文本
  } else {
    vnode.el = document.createTextNode(vnode.text)
  }
  // 组件
  return vnode.el
}

function updataProperties(vnode) {
  let newProps = vnode.data || {}
  let el = vnode.el
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }

}