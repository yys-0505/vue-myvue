import { popTarget, pushTarget } from './dep'

export default function Watcher (vm, exp, cb){
  this.vm = vm
  this.cb = cb
  this.exp = exp
  this.value = this.get(); // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  get: function() {
    pushTarget(this); // 缓存自己
    let val = this.vm
    this.exp.split('.').forEach((key) => {
      val = val[key] // 强制执行监听器里的get函数
    })
    popTarget();  // 释放自己
    return val
  },
  addDep: function(dep) {
    dep.addSub(this)
  },
  update: function() {
    let val = this.vm
    this.exp.split('.').forEach((key) => {
      val = val[key]
    })
    this.cb.call(this.vm, val, this.value)
  }
}