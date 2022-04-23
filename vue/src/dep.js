let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    Dep.target.addDep(this) // 观察者模式
    //this.subs.push(Dep.target)  
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }


}

// 计算属性依赖这个stack
const stack = []

export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep