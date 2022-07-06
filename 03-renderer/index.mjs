import createRenderer from "./createRenderer.mjs";

const browserApp = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElement(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  }
})

const nodeApp = createRenderer({
  createElement(tag) {
    console.log(`创建元素 ${tag}`)
    return { tag }
  },
  setElement(el, text) {
    console.log(`设置 ${JSON.stringify(el)} 的文本内容：${text}`)
    el.text = text
  },
  insert(el, parent, anchor = null) {
    console.log(`将 ${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`)
    parent.children = el
  }
})

const vnode1 = {
  type: 'h1',
  children: 'hello'
}

// 自定义容器
const container = {
  type: 'root'
}

browserApp.render(vnode1, document.querySelector('#app'))
nodeApp.render(vnode1, container)
