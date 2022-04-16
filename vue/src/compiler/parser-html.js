// 匹配属性 
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 匹配 aa-dd 
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// ?: 匹配不捕获      aa:ababddwda 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 标签开始 <div 
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 结束标签 >
const startTagClose = /^\s*(\/?)>/
// 标签结尾 </div> div
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// {{dawdad}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

let root = null
let currentParent = null // 表示当前父亲是谁
let stack = [] // leetcode 有效的括号
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}
// 开始标签
function start(tagName, attrs) {
  if (!tagName) return
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element // 标记当前元素为父级
  stack.push(element)
}
// 文本 3
function charts(text) {
  text = text.replace(/\s/g, '')
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE,
      parent: currentParent,
    })
  }

}

// [div,p] 
function end(tagName) {
  if (!tagName) return
  const element = stack.pop()
  const tag = element.tag
  // 标识这个tagName属于谁
  currentParent = stack[stack.length - 1]
  if (currentParent && tag === tagName) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}

export function parseHTML(html) {
  while (html) {
    let textIndex = html.indexOf('<')
    if (textIndex === 0) {
      const startMatch = parseStartTag()
      start(startMatch.tagName, startMatch.attrs)
      const endMatch = html.match(endTag)
      if (endMatch) {
        advance(endMatch[0].length)
        end(endMatch[1])
        continue
      }
    }
    let text
    if (textIndex > 0) {
      text = html.substring(0, textIndex)
    }
    if (text) {
      advance(text.length)
      charts(text)
    }
  }

  function parseStartTag() {
    let start = html.match(startTagOpen)
    const match = {
      tagName: '',
      attrs: []
    }
    if (start) {
      match.tagName = start[1]
      advance(start[0].length)
    }
    let end
    let attr
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      const name = attr[1]
      const value = attr[3] || attr[4] || attr[5]
      match.attrs.push({ name, value })
      advance(attr[0].length)
    }
    if (end) {
      advance(end.length)
    }
    return match
  }

  function advance(n) {
    html = html.substring(n)
  }

  return root
}