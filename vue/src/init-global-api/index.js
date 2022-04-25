
import initMixin from './mixin'
import initAssetsRegisters from './assets'
import initExtend from './extend'
import { ASSETS_TYPE } from './constant'




export function initGlobalApi(Vue) {
  Vue.options = {}
  // 初始化的全局过滤器 指令 组件 都放在Vue.options中
  initMixin(Vue)
  ASSETS_TYPE.forEach(type => {
    Vue.options[type + 's'] = {}
  })

  Vue.options._base = Vue // _base是Vue的构造函数
  initExtend(Vue)
  initAssetsRegisters(Vue)


}