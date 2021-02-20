export default function Compiler(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.init();
}

Compiler.prototype = {
  init: function() {
    if (this.el) {
      this.compileElement(this.el, this.vm)
    } else {
      console.error('Dom元素不存在');
    }
  },
  compileElement: function (frag, vm) {
    Array.from(frag.childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{(.*?)\}\}/g;   // 正则匹配{{}}
      if (this.isElementNode(node)) {  
        this.compileNode(node);
      } else if (this.isTextNode(node) && reg.test(text)) { // 即是文本节点又有大括号的情况{{}}
        this.compileText(node);
      }

      // 如果还有子节点，继续递归compileElement
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node, vm);
      }
    })
  },
  compileNode: function(node) {
    const nodeAttr = node.attributes; // 获取dom上的所有属性,是个类数组
    Array.from(nodeAttr).forEach(attr => {
      const name = attr.name;
      const exp = attr.value;

      if (this.isDirective(name)) { // v-
        var dir = name.substring(2);
        if (this.isEventDirective(dir)) {  // v-on:click 事件指令
          this.compileEvent(node, this.vm, exp, dir);
        } else {  // v-model 指令
          this.compileModel(node, this.vm, exp);
        }
        node.removeAttribute(name); // dom中不显示
      }
    });
  },
  compileText: function(node) {
    let arr = RegExp.$1.split('.');
    let val = this.vm;
    arr.forEach(key => {
      val = val[key];
    });
    this.updateText(node, val);
    this.vm.$watch(RegExp.$1, (newVal) => {
      this.updateText(node, newVal);
    })
  },
  compileEvent: function (node, vm, exp, dir) {
    var eventType = dir.split(':')[1];
    var cb = vm.methods && vm.methods[exp];
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  },
  compileModel: function (node, vm, exp) {
    let nowVal = vm[exp];
    this.modelUpdater(node, nowVal);
    // 监听变化
    vm.$watch(exp, (newVal) => {
      this.modelUpdater(node, newVal);
    });

    node.addEventListener('input', e => {
      let newVal = e.target.value;
      let arr = exp.split('.')
      let val = vm;
      if (nowVal === newVal) {
        return;
      }
      arr.forEach((key, i)=> {
        if (i === arr.length - 1) {
          val[key] = newVal;
          nowVal = newVal;
          return
        }
        val = val[key];
      });
    });
  },
  updateText: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  modelUpdater: function(node, value) {
    node.value = typeof value == 'undefined' ? '' : value;
  },
  isDirective: function(attr) {
    return attr.indexOf('v-') === 0;
  },
  isEventDirective: function(dir) {
    return dir.indexOf('on:') === 0;
  },
  isElementNode: function (node) {
    return node.nodeType === 1;
  },
  isTextNode: function(node) {
    return node.nodeType === 3;
  }
}