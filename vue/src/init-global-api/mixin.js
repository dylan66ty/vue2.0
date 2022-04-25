import { mergeOptions } from '../utils/index'
function initMixin(Vue) {

  Vue.mixin = function (mixin) {
    // 如何实现两个对象的合并
    this.options = mergeOptions(this.options, mixin)

  }
  // 生命周期合并策略 [beforeCreate,beforeCreate]
}


export default initMixin