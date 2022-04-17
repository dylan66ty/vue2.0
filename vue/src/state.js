import { observe } from './observe/index'
import { proxy } from './utils/index'
export function initState(vm) {
  const opts = vm.$options
  // $options{ props, data,watch,computed,methods...} 
  if (opts.props) {
    initProps(vm)
  }

  if (opts.methods) {
    initMethods(vm)
  }

  if (opts.data) {
    initData(vm)
  }

  if (opts.computed) {
    initComputed()
  }

  if (opts.watch) {
    initWatch()
  }

}

function initProps() {

}

function initMethods() {

}


function initData(vm) {
  // 初始化数据
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data
  // vm._data 代理到 vm上 
  for (const key in data) {
    proxy(vm, '_data', key)
  }
  // 对象劫持
  observe(data)
}

function initComputed() {

}
function initWatch() {

}