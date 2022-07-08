function shouldSetAsProps(el, key, value) {
  // 如果要设置的属性无法设置对应的 DOM Properties ，则使用 setAttribute 设置属性，例如 form 属性
  if(key === 'form' && el.tagName === 'INPUT') return false;
  return key in el;
}

function normalizeClass(classProp) {
  const type = typeof classProp;
  if(type === 'string') {
    return classProp;
  } else if(Array.isArray(classProp)) {
    return classProp.map(name => normalizeClass(name)).join(' ');
  } else if(type === 'object' && classProp !== null) {
    const result = [];
    Object.keys(classProp).forEach(name => {
      if(classProp[name] === true) result.push(name);
    })
    
    return result.join(' ');
  }
}

function normalizeStyle(styleProp) {
  if(Array.isArray(styleProp)) {
    return styleProp.reduce((result, name) => result + normalizeStyle(name), '');
  } else if(typeof styleProp === 'object' && styleProp !== null) {
    return Object
            .keys(styleProp)
            .reduce((result, name) => result + `${name}: ${styleProp[name]};`, '');
  }
}

export default {
  createElement(tag) {
    return document.createElement(tag)
  },
  setElement(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  patchProps(el, key, value, newValue) {
    if(/^on/.test(key)) {
      // {onClick: ()=>{}, onChange: [()=>{}]}
      const invokers = el._vei || (el._vei = {})
      let invoker = invokers[key]

      const name = key.slice(2).toLowerCase()
      
      if(newValue) {
        if(invoker) {
          // update
          invoker.value = newValue;
        } else {
          // mount
          invoker = el._vei[key] = (e) => {
            // 当事件触发事件早于事件绑定事件时，阻止事件处罚，
            // 以避免事件冒泡导致刚绑定的事件处理函数被执行
            if(e.timeStamp < invoker.attached) return false;
            if(Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }

          invoker.value = newValue
          // 获取函数被绑定的时间
          invoker.attached = performance.now();
          el.addEventListener(name, invoker)
        }
      } else if(invoker) {
        // unmount
        el.removeEventListener(name, invoker)
      }
    } else if(key === 'class') {
      // 选择性能最优的方法设置class
      el.className = normalizeClass(newValue)
    } else if(key === 'style') {
      el.setAttribute('style', normalizeStyle(newValue));
    } else if(shouldSetAsProps(el, key, newValue)) {
      // 获取 DOM properties 的类型
      const type = typeof el[key]
      if(type === 'boolean' && newValue === '') {
        // 矫正 disabled 的 prop 的值
        el[key] = true
      } else {
        el[key] = newValue
      }
    } else {
      el.setAttribute(key, newValue)
    }
  }
}
