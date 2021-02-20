import proxy from './instance/proxy'
import initOptions from './instance/init'
import Compiler from "./compile";
import Watcher from "./observer/watcher"
import { callHook } from "./instance/lifecycle"

export default function IVue(options) {
  let vm = this
  vm.$options = options
  vm.$watch = function (key, cb) {
    new Watcher(vm, key, cb)
  }
  initOptions(vm)
  for (let key in vm._data) {
    proxy(vm, '_data', key)
  }
  callHook(vm, 'created')
  new Compiler(vm.$options.el, vm)
  callHook(vm, 'mounted'); // 所有事情处理好后执行mounted函数
}