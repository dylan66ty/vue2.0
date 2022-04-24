import { nextTick } from '../utils/nextTick'
let queue = []
let has = {}

function flushSchedulerQueue() {
  queue.forEach(watcher => watcher.run())
  queue.length = 0
  has = {}
}

// 批量处理
export function queueWatcher(watcher) {
  const id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    // vue.nextTick = promise mutaitionObserver setImmediate setTimeout
    nextTick(flushSchedulerQueue)
  }

}