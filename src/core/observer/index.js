import Dep from './dep'

function Observer(data) {
  this.walk(data)
}

Observer.prototype = {
  walk: function (obj) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        this.walk(obj[key])
      }
      this.defineReactive(obj, key, obj[key])
    })
  },
  defineReactive: function(obj, key, value) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      get () {
        if (Dep.target) {
          dep.addDepend()
        }
        return value
      },
      set (newVal) {
        if (newVal === value) {
          return
        }
        value = newVal
        dep.notify()
      }
    })
  }
}

export default function observer(value) {
  return new Observer(value)
}