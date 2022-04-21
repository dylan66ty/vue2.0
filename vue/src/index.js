import { initMixin } from './init'
import { renderMixin } from './render'
import { lifycycleMixin } from './lifycycle'
import { initGlobalApi } from './init-global-api/index'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifycycleMixin(Vue)


//初始化全局的api
initGlobalApi(Vue)

export default Vue