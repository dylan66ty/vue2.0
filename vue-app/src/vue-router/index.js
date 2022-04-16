import install from "./install"
import createMatcher from './create-matcher'
import Hash from "./history/hash"
import Html5 from './history/html5'

export default class VueRouter {
  constructor(options) {
    this.beforeEachHooks = []
    const routes = options.routes || []

    this.mode = options.mode || 'hash'

    this.genHistoryMode()

    // 1.匹配功能 2.动态添加路由 addRoutes
    this.matcher = createMatcher(routes)
    // 创建历史管理 路由有两种模式 history hash
  }
  init(app) {
    const history = this.history
    // 跳转路径 根据路径获取到记录
    const setupHashListener = () => {
      history.setupHashListener()
    }
    history.transitionTo(history.getCurrentLocation(), setupHashListener)

    history.listen((route) => {
      app._route = route
    })
  }
  match(location) {
    return this.matcher.match(location)
  }
  genHistoryMode() {
    switch (this.mode) {
      case 'hash':
        this.history = new Hash(this)
        break;
      case 'history':
        this.history = new Html5(this)
        break;
    }

  }
  push(location) {
    window.location.hash = location
  }
  beforeEach(hook) {
    this.beforeEachHooks.push(hook)
  }



}

VueRouter.install = install