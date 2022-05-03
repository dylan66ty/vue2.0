// 广度优先搜索
/*
   1
  2 3
 45 67
  output -> 1,2,3,4,5,6
*/

const data = require('./treeData')

const bfs = (data) => {
  const queue = [...data]
  const result = []
  while (queue.length) {
    const current = queue.shift()
    result.push(current.id)
    const children = current.children
    if (!children) continue
    for (let i = 0; i < children.length; i++) {
      queue.push(children[i])
    }
  }
  return result
}

console.log(bfs(data));



