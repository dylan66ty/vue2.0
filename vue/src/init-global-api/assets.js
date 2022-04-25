import { ASSETS_TYPE } from './constant'
function initAssetsRegisters(Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function (id, definition) {
      if (type === 'component') {
        // 注册全局组件
        // 使用extend方法将对象变成构造函数
        // 子组件可能也有Vue.component方法
        definition = this.options._base.extend(definition)

      } else if (type === 'filter') {

      } else if (type === 'directive') {

      }
      this.options[type + 's'][id] = definition
    }
  })

}

export default initAssetsRegisters