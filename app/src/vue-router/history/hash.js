import Base from './base'

const ensureSlash = () => {
  if (window.location.hash) {
    return
  }
  window.location.hash = '/'
}

export default class Hash extends Base {
  constructor(router) {
    super(router)
    this.router = router
    // 默认 #/

    ensureSlash()

  }
  getCurrentLocation() {
    return window.location.hash.slice(1)
  }
  setupHashListener() {
    window.addEventListener('hashchange', () => {
      this.transitionTo(this.getCurrentLocation())
    })
  }

}