import { mergeOptions } from '../utils/index'

function initExtend(Vue) {
  let cid = 0
  Vue.extend = function (extendOptions) {

    // 创建子类继承于父类 扩展时候扩展到自己的属性上
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    Sub.cid = cid++
    Sub.prototype = Object.create(this.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(this.options, extendOptions)
    // Sub.mixin = this.mixin


    return Sub

  }


}

export default initExtend