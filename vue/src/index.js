import { initMixin } from './init'
import { renderMixin } from './render'
import { lifycycleMixin } from './lifycycle'
function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifycycleMixin(Vue)

export default Vue