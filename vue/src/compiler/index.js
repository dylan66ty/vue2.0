// ast 用对象描述js语法的
// vnode 用对象描述真实的dom节点的

import { parseHTML } from './parser-html'
import { generate } from './generate'


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