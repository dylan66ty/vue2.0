export function patch(oldVnode, vnode) {
  // oldVnode 第一次是真实的标签。
  // 递归创建真实的节点 替换到老的节点
  // 判断是更新还是渲染
  if (!oldVnode) {
    // 通过当前的虚拟节点创建的元素并返回
    return createEle(vnode)
  } else {
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
      const oldEle = oldVnode
      const parentEle = oldEle.parentNode
      const el = createEle(vnode)
      parentEle.insertBefore(el, oldEle.nextSibling)
      parentEle.removeChild(oldEle)
      return el
    } else {
      // 1. 标签不一致直接替换
      if (oldVnode.tag !== vnode.tag) {
        oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el)
      }

      // 2.文本
      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text
        }
      }
      // 3.标签一致而且不是文本（比对属性是否一致）
      const el = vnode.el = oldVnode.el
      updataProperties(vnode, oldVnode.data)

      // 4.比对儿子
      let oldChildren = oldVnode.children || []
      let newChildren = vnode.children || []

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 老的新的都有孩子
        // diff
        updateChildren(el, oldChildren, newChildren)
      } else if (newChildren.length > 0) {
        // 新的有孩子 老的没孩子 新增
        for (let i = 0; i < newChildren.length; i++) {
          let child = newChildren[i]
          el.appendChild(createEle(child))
        }
      } else if (oldChildren.length > 0) {
        // 新的没有孩子 老的有孩子
        el.innerHTML = ''
      } else {

      }
    }
  }

}

function createComponent(vnode) {
  // 需要创建组件的实例 初始化的作用
  const data = vnode.data
  const hook = data.hook
  if (hook && hook.init) {
    hook.init(vnode)
  }
  if (vnode.componentInstance) {
    // 组件
    return vnode.componentInstance.$el
  }

}

function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

// vue diff core
function updateChildren(parent, oldChildren, newChildren) {
  // vue采用的是双指针的方式 

  let oldStartIndex = 0
  let oldStartVnode = oldChildren[oldStartIndex]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[newStartIndex]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]


  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 有一方指针先重合就结束
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 1.头和头相同
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 2.尾和尾相同
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    }



  }

  if (newStartIndex <= newEndIndex) {
    // 将新增的元素直接插入
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // parent.appendChild(createEle(newChildren[i]))
      const target = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      parent.insertBefore(createEle(newChildren[i]), target)
    }

  }





}

export function createEle(vnode) {
  const { tag, children, key, data, text } = vnode
  // 标签
  if (typeof tag === 'string') {
    // tag是普通标签还是组件
    // 实例化组件
    const el = createComponent(vnode)
    if (el) {
      // 这里返回真实的element
      return el
    }
    vnode.el = document.createElement(tag)
    updataProperties(vnode)
    children && children.forEach(child => { // 递归创建节点
      vnode.el.appendChild(createEle(child))
    })
    // 文本
  } else {
    vnode.el = document.createTextNode(vnode.text)
  }
  // 组件
  return vnode.el
}

function updataProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {}
  let el = vnode.el
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}

  for (let oldStyleName in oldStyle) {
    if (!newStyle[oldStyleName]) {
      el.style[oldStyleName] = ''
    }
  }

  // 老的有 新的没有 直接把老的属性删除
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
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