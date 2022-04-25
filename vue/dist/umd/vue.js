(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function isObject(data) {
    return typeof data === 'object' && data !== null
  }

  function isArray(data) {
    return Array.isArray(data)
  }

  // 向一个对象添加不可枚举的属性
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: false,
      value
    });
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key]
      },
      set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }


  const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destoryed'
  ];

  const strats = {};

  LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook;
  });

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        return [childVal]
      }
    } else {
      return parentVal
    }

  }

  function mergeOptions(parent, child) {
    const options = {};
    for (let key in parent) {
      mergeField(key);
    }

    for (let key in child) {
      if (!parent.hasOwnProperty(key)) {
        mergeField(key);
      }

    }

    // 默认的合并策略
    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key])
      }
      if (isObject(parent[key]) && isObject(child[key])) {
        options[key] = { ...parent[key], ...child[key] };
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options

  }

  const originArrayMethods = Array.prototype;
  const arrayMethods = Object.create(originArrayMethods);

  const methods = ['push', 'pop', 'unshift', 'shift', 'reserve', 'sort', 'splice'];

  methods.forEach(method => {
    arrayMethods[method] = function (...args) {
      const result = originArrayMethods[method].apply(this, args);
      // 添加的元素是对象 继续劫持
      let inserted;
      let ob = this.__ob__;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':  // 修改 删除 新增 arr.splice(index,1,{a:1})
          inserted = args.slice(2);
          break
      }

      if (inserted) {
        ob.observeArray(inserted); // 将新增的属性继续劫持
      }

      ob.dep.notify();

      return result
    };

  });

  let id$1 = 0;
  class Dep {
    constructor() {
      this.id = id$1++;
      this.subs = [];
    }
    depend() {
      Dep.target.addDep(this); // 观察者模式
      //this.subs.push(Dep.target)  
    }
    notify() {
      this.subs.forEach(watcher => watcher.update());
    }
    addSub(watcher) {
      this.subs.push(watcher);
    }


  }

  // 计算属性依赖这个stack
  const stack$1 = [];

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack$1.push(watcher);
  }

  function popTarget() {
    stack$1.pop();
    Dep.target = stack$1[stack$1.length - 1];
  }

  class Observe {
    constructor(data) {
      this.dep = new Dep();
      // 给每个劫持过的对象增加个this
      def(data, '__ob__', this);
      // 数组
      if (isArray(data)) {

        this._type = 'array';
        // 避免对数组的索引进行劫持，提升性能
        // 数组里面的是对象在劫持
        // 数组的原型的上的一些方法重写 push pop unshift shift reserve sort splice
        data.__proto__ = arrayMethods;
        this.observeArray(data);

      } else {
        // 对象
        this._type = 'object';
        this.walk(data);
      }


    }
    walk(data) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = data[key];
        defineReactive(data, key, value);
      }
    }
    observeArray(data) {
      for (let i = 0; i < data.length; i++) {
        // 监控数组的每一项
        observe(data[i]);
      }
    }
  }

  function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
      const current = value[i]; // 将数组中每一个都取出来，数据变化后也去更新视图
      current.__ob__ && current.__ob__.dep.depend();
      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }


  function observe(data) {
    if (!isObject(data)) return
    return new Observe(data)
  }

  function defineReactive(data, key, value) {
    const dep = new Dep();
    // 递归实现深度劫持
    const childob = observe(value);
    // 缺点：1.数组length不能劫持 2.对象不存在的属性不能劫持
    Object.defineProperty(data, key, {
      get() {
        // 取值 每个属性都有对应的watcher name: [watcher,watcher ...]
        if (Dep.target) {
          // 如果当前有watcher wacher和dep建立关系 双向依赖
          dep.depend();
          if (childob) {
            // 数组的依赖收集
            childob.dep.depend();
            // 如果数组中还有数组的情况下
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set(newVal) {
        if (newVal === value) return
        // 如果newVal是个对象,需要劫持这个对象
        observe(newVal);

        value = newVal;
        dep.notify(); // 通知watcher更新
      }
    });

  }

  function initState(vm) {
    const opts = vm.$options;
    // $options{ props, data,watch,computed,methods...} 
    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;

  }


  function initData(vm) {
    // 初始化数据
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    // vm._data 代理到 vm上 
    for (const key in data) {
      proxy(vm, '_data', key);
    }
    // 对象劫持
    observe(data);
  }

  // 匹配属性 
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // 匹配 aa-dd 
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
  // ?: 匹配不捕获      aa:ababddwda 
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  // 标签开始 <div 
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  // 结束标签 >
  const startTagClose = /^\s*(\/?)>/;
  // 标签结尾 </div> div
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

  let root = null;
  let currentParent = null; // 表示当前父亲是谁
  let stack = []; // leetcode 有效的括号
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }
  // 开始标签
  function start(tagName, attrs) {
    if (!tagName) return
    let element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    currentParent = element; // 标记当前元素为父级
    stack.push(element);
  }
  // 文本 3
  function charts(text) {
    text = text.trim();
    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE,
        parent: currentParent,
      });
    }

  }

  // [div,p] 
  function end(tagName) {
    if (!tagName) return
    const element = stack.pop();
    const tag = element.tag;
    // 标识这个tagName属于谁
    currentParent = stack[stack.length - 1];
    if (currentParent && tag === tagName) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function parseHTML(html) {
    while (html) {
      let textIndex = html.indexOf('<');
      if (textIndex === 0) {
        const startMatch = parseStartTag();
        start(startMatch.tagName, startMatch.attrs);
        const endMatch = html.match(endTag);
        if (endMatch) {
          advance(endMatch[0].length);
          end(endMatch[1]);
          continue
        }
      }
      let text;
      if (textIndex >= 0) {
        text = html.substring(0, textIndex);
      }
      if (text) {
        advance(text.length);
        charts(text);
      }
    }

    function parseStartTag() {
      let start = html.match(startTagOpen);
      const match = {
        tagName: '',
        attrs: []
      };
      if (start) {
        match.tagName = start[1];
        advance(start[0].length);
      }
      let end;
      let attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        const name = attr[1];
        const value = attr[3] || attr[4] || attr[5];
        match.attrs.push({ name, value });
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
      }
      return match
    }

    function advance(n) {
      html = html.substring(n);
    }

    return root
  }

  // {{dawdad}}
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;


  // 拼接属性字符串
  function genProps(attrs) {
    if (!attrs) return undefined
    let arr = [];
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (attr.name === 'style') {
        const styleObj = attr.value.split(';').reduce((a, v) => {
          const [styleKey, styleValue] = v.split(':');
          if (styleKey) {
            a[styleKey] = styleValue;
          }
          return a
        }, {});
        attr.value = styleObj;
      }
      arr.push(`${attr.name}:${JSON.stringify(attr.value)}`);
    }

    return `{${arr.join(',')}}`
  }


  function convertTextExpr(text) {
    const tokens = [];
    let prevIndex = 0;
    // 正则 lastIndex 问题
    text.replace(defaultTagRE, (...args) => {
      const target = args[0];
      const expr = args[1].trim();
      const startIndex = args[2];
      const leftCode = text.substring(prevIndex, startIndex);
      if (leftCode) {
        tokens.push(`"${leftCode}"`);
      }
      tokens.push(`_s(${expr})`);
      prevIndex = startIndex + target.length;
    });
    if (prevIndex !== 0) {
      const rightCode = text.substring(prevIndex);
      if (rightCode) {
        tokens.push(`"${rightCode}"`);
      }
    }
    if (tokens.length) {
      return `_v(${tokens.join('+')})`
    } else {
      return `_v("${text}")`
    }
  }

  function generate(node) {
    const children = node.children;
    let code;
    if (node.type === 1) {
      code = `_c("${node.tag}",${genProps(node.attrs)},${children ? children.map(item => generate(item)) : ''})`;
    } else if (node.type === 3) {
      // a {{b}} c {{d}} -> _v(a + _s(b) + c + _s(d))
      const text = node.text;
      code = convertTextExpr(text);
    }
    return code
  }

  // ast 用对象描述js语法的


  function compileToFunction(template) {
    // 1. template 字符串截取 -> ast
    const root = parseHTML(template);
    // 2. ast 生成 render函数 <模板引擎>
    const code = generate(root);
    // _c('div',{id:'app'},_c('p', {} , _v(_s(name))))
    // 模板引擎实现
    const codeWithStr = `with(this){ return ${code}}`;
    const render = new Function(codeWithStr);
    return render
  }


   // <div id="app" > </div>
   // root= { tag: 'div' , attrs: [], children: []}

  const callbacks = [];
  let actived;

  function flashCallback() {
    callbacks.forEach(cb => cb());
    callbacks.length = 0;
    actived = false;
  }



  function nextTick(callback) {
    callbacks.push(callback);
    if (actived) return
    actived = true;
    setTimeout(flashCallback, 0);



  }

  let queue = [];
  let has = {};

  function flushSchedulerQueue() {
    queue.forEach(watcher => watcher.run());
    queue.length = 0;
    has = {};
  }

  // 批量处理
  function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true;
      // vue.nextTick = promise mutaitionObserver setImmediate setTimeout
      nextTick(flushSchedulerQueue);
    }

  }

  let id = 0;
  class Watcher {
    constructor(vm, exprOrFn, callback, options) {
      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.getter = exprOrFn;
      this.id = id++;
      this.depsId = new Set();
      this.deps = [];
      this.get(); // 调用get方法会让渲染watcher执行。
    }
    get() {
      pushTarget(this); // 把watcher存起来 Dep.target
      this.getter(); // 渲染watch的执行 render 取值操作 -> 依赖收集
      popTarget(); // 移除watcher  
    }
    update() {
      // 每次调用update都会更新。
      // 优化 先把watcher存到队列中去 等同步代码执行完成后再依次执行
      queueWatcher(this);
      // this.get()
    }
    addDep(dep) { // watcher里不能放重复的dep dep里面也不能放重复的watcher
      const id = dep.id;
      if (!this.depsId.has(id)) {
        this.depsId.add(id);
        this.deps.push(dep);
        dep.addSub(this);
      }
    }
    run() {
      this.get();
    }

  }

  function patch(oldVnode, vnode) {
    // oldVnode 第一次是真实的标签。
    // 递归创建真实的节点 替换到老的节点
    // 判断是更新还是渲染
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
      const oldEle = oldVnode;
      const parentEle = oldEle.parentNode;
      const el = createEle(vnode);
      parentEle.insertBefore(el, oldEle.nextSibling);
      parentEle.removeChild(oldEle);
      return el
    }
  }

  function createEle(vnode) {
    const { tag, children, key, data, text } = vnode;
    // 标签
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updataProperties(vnode);
      children.forEach(child => { // 递归创建节点
        vnode.el.appendChild(createEle(child));
      });
      // 文本
    } else {
      vnode.el = document.createTextNode(vnode.text);
    }
    // 组件
    return vnode.el
  }

  function updataProperties(vnode) {
    let newProps = vnode.data || {};
    let el = vnode.el;
    for (let key in newProps) {
      if (key === 'style') {
        for (let styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps.class;
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }

  }

  function lifycycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // vnode -> 真实的dom
      const vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }


  function mountComponent(vm, el) {

    vm.$options;
    vm.$el = el;
    callHook(vm, 'beforeMount');
    // watcher 渲染的
    // vm._render 渲染出vnode _c _v _s
    // vm._update vnode创建真实的dom  
    // 渲染页面
    let updateComponent = () => {
      console.log('update');
      // 返回的是虚拟dom
      vm._update(vm._render());
    };

    // 渲染watch true表示渲染watch
    new Watcher(vm, updateComponent, () => { }, true);
    callHook(vm, 'mounted');
  }


  function callHook(vm, hook) {
    const handlers = vm.$options[hook];
    if (handlers) {
      for (let i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin$1(Vue) {
    Vue.prototype._init = function (options) {
      // 初始化 
      const vm = this;
      vm.$options = options;
      // 将用户传的和全局在做一个合并
      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');

      // el存在,实现挂载
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }

    };

    Vue.prototype.$mount = function (el) {
      const vm = this;
      const options = vm.$options;
      el = typeof el === 'string' ? document.querySelector(el) : el;
      //优先级
      // render
      // template
      // el
      if (!options.render) {
        let template = options.template;
        if (!template && el) {
          template = el.outerHTML;
          // template 转换成render函数
          // 1.0 纯字符串 正则匹配 (性能不高)
          // 2.0 vnode dom diff 

          // 模板编译 htmlStr->ast->render函数
          const render = compileToFunction(template);
          options.render = render;
        }
      }
      // 挂载组件
      mountComponent(vm, el);

    };

    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(tag, data, ...children) {
    let key = data.key;
    if (key) {
      delete data.key;
    }
    return vnode(tag, data, key, children, undefined)

  }


  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
  }

  function vnode(tag, data, key, children, text) {
    return {
      componentOptions: {},
      tag, data, key, children, text
    }
  }

  // template -> ast语法树 -> render函数 -> 虚拟dom -> 真实的dom
  // update 新旧vnode patch 到真实的dom上

  function renderMixin(Vue) {
    // 创建元素
    Vue.prototype._c = function () {
      return createElement(...arguments)
    };
    // 创建文本
    Vue.prototype._v = function (text) {
      return createTextNode(text)
    };
    // JSON.stringify
    Vue.prototype._s = function (val) {
      return !val ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
    };


    // _c创建元素 _v创建文本 _s JSON.stringily
    Vue.prototype._render = function () {
      const vm = this;
      const { render } = vm.$options;
      let vnode = render.call(vm);
      return vnode
    };

  }

  function initMixin(Vue) {

    Vue.mixin = function (mixin) {
      // 如何实现两个对象的合并
      this.options = mergeOptions(this.options, mixin);

    };
    // 生命周期合并策略 [beforeCreate,beforeCreate]
  }

  const ASSETS_TYPE = [
    'component',
    'filter',
    'directive'
  ];

  function initAssetsRegisters(Vue) {
    ASSETS_TYPE.forEach(type => {
      Vue[type] = function (id, definition) {
        if (type === 'component') {
          // 注册全局组件
          // 使用extend方法将对象变成构造函数
          // 子组件可能也有Vue.component方法
          definition = this.options._base.extend(definition);

        }
        this.options[type + 's'][id] = definition;
      };
    });

  }

  function initExtend(Vue) {
    Vue.extend = function (extendOptions) {
      // 创建子类继承于父类 扩展时候扩展到自己的属性上


    };

  }

  function initGlobalApi(Vue) {
    Vue.options = {};
    // 初始化的全局过滤器 指令 组件 都放在Vue.options中
    initMixin(Vue);
    ASSETS_TYPE.forEach(type => {
      Vue.options[type + 's'] = {};
    });

    Vue.options._base = Vue; // _base是Vue的构造函数
    initExtend(Vue);
    initAssetsRegisters(Vue);


  }

  function Vue(options) {
    this._init(options);
  }

  initMixin$1(Vue);
  renderMixin(Vue);
  lifycycleMixin(Vue);


  //初始化全局的api
  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
