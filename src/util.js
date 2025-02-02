/**
 * Create a actual callable action function.
 *
 * @param {String|Function} action
 * @param {Vuex} store
 * @return {Function} [description]
 */

export function createAction (action, store) {
  if (typeof action === 'string') {
    // simple action string shorthand
    // action是字符串，拼写成函数
    return (...payload) => store.dispatch(action, ...payload)
  } else if (typeof action === 'function') {
    // normal action
    // 如果是函数，则执行它，并把当前store作为第一个参数
    return (...payload) => action(store, ...payload)
  }
}

/**
 * Validates hot api - unassigns any methods
 * that do not exist.
 *
 * @param {Object} currentMethods
 * @param {Object} newMethods
 */

export function validateHotModules (currentMethods, newMethods) {
  Object.keys(currentMethods).forEach(name => {
    if (!newMethods[name]) {
      delete currentMethods[name]
    }
  })
}

/**
 * Merge an array of objects into one.
 *
 * @param {Array<Object>} arr
 * @param {Boolean} allowDuplicate
 * @return {Object}
 */

export function mergeObjects (arr, allowDuplicate) {
  return arr.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const existing = prev[key]
      if (existing) {
        // allow multiple mutation objects to contain duplicate
        // handlers for the same mutation type
        if (allowDuplicate) {
          // 允许方法同名的情况下，合并handler成为数组
          if (Array.isArray(existing)) {
            existing.push(obj[key])
          } else {
            prev[key] = [prev[key], obj[key]]
          }
        } else {
          // 如果多个action方法名相同，则警告
          console.warn(`[vuex] Duplicate action: ${ key }`)
        }
      } else {
        // action不存在，则直接赋值
        prev[key] = obj[key]
      }
    })
    return prev
  }, {})
}

/**
 * Deep clone an object. Faster than JSON.parse(JSON.stringify()).
 *
 * @param {*} obj
 * @return {*}
 */

export function deepClone (obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepClone)
  } else if (obj && typeof obj === 'object') {
    var cloned = {}
    var keys = Object.keys(obj)
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i]
      cloned[key] = deepClone(obj[key])
    }
    return cloned
  } else {
    return obj
  }
}
