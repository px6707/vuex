export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])
  // vue2.0之上的版本，可以使用mixin
  if (version >= 2) {
    // 在beforeCreate生命周期中调用vuex init
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    // 获取配置上的store
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 获取父组件的store，传递给当前组件，使得$store在真个vue树上可用
      this.$store = options.parent.$store
    }
  }
}
