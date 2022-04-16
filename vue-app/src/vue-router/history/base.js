export const createRoute = (record, location) => {
  const matched = []
  if (record) {
    while (record) {
      matched.unshift(record)
      record = record.parent
    }

  }

  return {
    ...location,
    matched
  }
}

const runQueue = (queue, iterator, complete) => {
  const next = (index) => {
    const hook = queue[index]
    if (index >= queue.length) {
      complete()
    } else {
      iterator(hook, () => {
        next(index + 1)
      })
    }

  }
  next(0)
}

export default class Base {
  constructor(router) {
    this.router = router
    // {path: / , matched: []}
    this.current = createRoute(null, { path: '/' })

  }
  transitionTo(location, complete) {
    // 通过路径拿到对应的记录 -> 找到对应的
    const current = this.router.match(location)
    if (this.current && this.current.path === location && this.current.matched.length === current.matched.length) return

    const queue = this.router.beforeEachHooks
    const iterator = (hook, next) => {
      hook(this.current, current, next)
    }
    runQueue(queue, iterator, () => {
      this.current = current
      this.cb && this.cb(this.current)
    })
    complete && complete()
  }

  listen(cb) {
    this.cb = cb
  }
}