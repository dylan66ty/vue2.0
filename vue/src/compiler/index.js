// ast 用对象描述js语法的
// vnode 用对象描述真实的dom节点的

import { parseHTML } from './parser-html'

// {{dawdad}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


// 拼接属性字符串
function genProps(attrs) {
  if (!attrs) return undefined
  let arr = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      const styleObj = attr.value.split(';').reduce((a, v) => {
        const [styleKey, styleValue] = v.split(':')
        if (styleKey) {
          a[styleKey] = styleValue
        }
        return a
      }, {})
      attr.value = styleObj
    }
    arr.push(`${attr.name}:${JSON.stringify(attr.value)}`)
  }

  return `{${arr.join(',')}}`
}


function convertTextExpr(text) {
  const tokens = []
  let prevIndex = 0
  // 正则 lastIndex 问题
  text.replace(defaultTagRE, (...args) => {
    const target = args[0]
    const expr = args[1].trim()
    const startIndex = args[2]
    const leftCode = text.substring(prevIndex, startIndex)
    if (leftCode) {
      tokens.push(`"${leftCode}"`)
    }
    tokens.push(`_s(${expr})`)
    prevIndex = startIndex + target.length
  })
  if (prevIndex !== 0) {
    const rightCode = text.substring(prevIndex)
    if (rightCode) {
      tokens.push(`"${rightCode}"`)
    }
  }
  if (tokens.length) {
    return `_v(${tokens.join('+')})`
  } else {
    return `_v("${text}")`
  }
}

function generate(node) {
  const children = node.children
  let code
  if (node.type === 1) {
    code = `_c("${node.tag}",${genProps(node.attrs)},${children ? children.map(item => generate(item)) : ''})`
  } else if (node.type === 3) {
    // a {{b}} c {{d}} -> _v(a + _s(b) + c + _s(d))
    const text = node.text
    code = convertTextExpr(text)
  }
  return code
}

export function compileToFunction(template) {
  // 1. template 字符串截取 -> ast
  const root = parseHTML(template)
  // 2. ast 生成 render函数 <模板引擎>
  const code = generate(root)
  // _c('div',{id:'app'},_c('p', {} , _v(_s(name))))
  // 模板引擎实现
  const codeWithStr = `with(this){ return ${code}}`
  const render = new Function(codeWithStr)
  return render
}


 // <div id="app" > </div>
 // root= { tag: 'div' , attrs: [], children: []}