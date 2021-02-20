import observer from "../observer";
const LIFECYCLE_HOOKS = [
  'created',
  'mounted'
]
export default function initOptions (vm) {
  vm._data = vm.$options.data;
  vm.methods = vm.$options.methods;
  observer(vm._data)
  LIFECYCLE_HOOKS.forEach(hook => {
    vm.$options[hook] = vm.$options[hook] || function () {}
  })
}
