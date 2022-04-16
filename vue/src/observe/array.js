const originArrayMethods = Array.prototype
export const arrayMethods = Object.create(originArrayMethods)

const methods = ['push', 'pop', 'unshift', 'shift', 'reserve', 'sort', 'splice']

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = originArrayMethods[method].apply(this, args)
    // 添加的元素是对象 继续劫持
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':  // 修改 删除 新增 arr.splice(index,1,{a:1})
        inserted = args.slice(2)
        break
    }

    if (inserted) {
      ob.observeArray(inserted) // 将新增的属性继续劫持
    }



    return result
  }

})