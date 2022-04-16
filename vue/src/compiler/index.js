// ast 用对象描述js语法的
// vnode 用对象描述真实的dom节点的

import { parseHTML } from './parser-html'

// 拼接属性字符串
function genProps(attrs) {
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

function generate(el) {
  let code = `_c("${el.tag}",${genProps(el.attrs)})
  
  `
  return code

}

export function compileToFunction(template) {
  // 1. template 字符串截取 -> ast
  const root = parseHTML(template)
  // 2. ast 生成 render函数 <模板引擎>
  const code = generate(root)
  // _c('div',{id:'app'},_c('p', {} , _v(_s(name))))
  console.log(root)
  console.log(code)
  return function render() {

  }
}


 // <div id="app" > </div>
 // root= { tag: 'div' , attrs: [], children: []}