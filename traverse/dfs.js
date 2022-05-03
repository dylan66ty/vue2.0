const data = require('./treeData')

const dfs = (data) => {
  const stack = [...data]
  const result = []
  while (stack.length) {
    const item = stack.shift()
    result.push(item.id)
    const children = item.children || []
    for (let i = children.length - 1; i >= 0; i--) {
      stack.unshift(children[i])
    }
  }
  return result
}


const dfs1 = (data, arr = []) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    arr.push(item.id)
    if (item.children) {

      dfs1(item.children, arr)
    }
  }
  return arr
}

console.log(dfs(data));


// leetcode 有效的括号

const str = '{{{([])}}}'

const valid = (str) => {
  const stack = []
  const map = {
    '{': '}',
    '[': ']',
    '(': ')'
  }
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (map[char]) {
      stack.push(map[char])
      continue
    }
    if (char !== stack.pop()) {
      return false
    }
  }

  return stack.length === 0

}
