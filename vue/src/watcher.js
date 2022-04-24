import { pushTarget, popTarget } from './dep.js'
import { queueWatcher } from './observe/scheduler'

let id = 0
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.callback = callback
    this.options = options
    this.getter = exprOrFn
    this.id = id++
    this.depsId = new Set()
    this.deps = []
    this.get() // 调用get方法会让渲染watcher执行。
  }
  get() {
    pushTarget(this) // 把watcher存起来 Dep.target
    this.getter() // 渲染watch的执行 render 取值操作 -> 依赖收集
    popTarget() // 移除watcher  
  }
  update() {
    // 每次调用update都会更新。
    // 优化 先把watcher存到队列中去 等同步代码执行完成后再依次执行
    queueWatcher(this)
    // this.get()
  }
  addDep(dep) { // watcher里不能放重复的dep dep里面也不能放重复的watcher
    const id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  run() {
    this.get()
  }

}



export default Watcher

