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



      return result
    };

  });

  class Observe {
    constructor(data) {
      // 给每个劫持过的对象增加个this
      def(data, '__ob__', this);
      // 数组
      if (isArray(data)) {
        // 避免对数组的索引进行劫持，提升性能
        // 数组里面的是对象在劫持
        // 数组的原型的上的一些方法重写 push pop unshift shift reserve sort splice
        data.__proto__ = arrayMethods;
        this.observeArray(data);

      } else {
        // 对象
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


  function observe(data) {
    if (!isObject(data)) return
    return new Observe(data)
  }

  function defineReactive(data, key, value) {
    // 递归实现深度劫持
    observe(value);
    // 缺点：1.数组length不能劫持 2.对象不存在的属性不能劫持
    Object.defineProperty(data, key, {
      get() {
        return value
      },
      set(newVal) {
        if (newVal === value) return
        console.log('更新数据');
        // 如果newVal是个对象,需要劫持这个对象
        observe(newVal);
        value = newVal;
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
    text = text.replace(/\s/g, '');
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
      if (textIndex > 0) {
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
        advance(end.length);
      }
      return match
    }

    function advance(n) {
      html = html.substring(n);
    }

    return root
  }

  // ast 用对象描述js语法的

  // 拼接属性字符串
  function genProps(attrs) {
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

  function generate(el) {
    let code = `_c("${el.tag}",${genProps(el.attrs)})
  
  `;
    return code

  }

  function compileToFunction(template) {
    // 1. template 字符串截取 -> ast
    const root = parseHTML(template);
    // 2. ast 生成 render函数 <模板引擎>
    const code = generate(root);
    // _c('div',{id:'app'},_c('p', {} , _v(_s(name))))
    console.log(root);
    console.log(code);
    return function render() {

    }
  }


   // <div id="app" > </div>
   // root= { tag: 'div' , attrs: [], children: []}

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 初始化 
      const vm = this;
      vm.$options = options;
      initState(vm);


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

    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
