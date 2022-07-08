/**
 * 创建渲染器
 * @param options 自定义渲染器的选项
 * @returns 包含渲染函数的对象
 */
export default function createRenderer(options) {
  const {
    createElement,
    insert,
    setElement,
    patchProps
  } = options

  /**
   * 使用自定义API来挂载元素，以此来达到跨平台的目的
   * @param vnode 
   * @param container 
   */
  function mountElement(vnode, container) {
    const el = vnode.el = createElement(vnode.type);
    
    // 处理children
    if(typeof vnode.children === 'string') {
      setElement(el, vnode.children)
    } else if(Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        // 挂载子节点
        patch(null, child, el)
      });
    }
    
    // 处理props
    if(vnode.props) {
      for(const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key])
      }
    }


    insert(el, container);
  }
  
  /**
   * 在应用挂载or更新时打补丁
   * @param node 旧结构
   * @param newNode 新结构
   * @param container 容器元素
   */
  function patch(node, newNode, container) {
    if(!node) {
      // 挂载
      mountElement(newNode, container)
    } else {
      // 打补丁
    }
  }
  /**
   * 卸载元素
   * @param vnode 虚拟节点
   */
  function unmount(vnode) {
    const parent = vnode.el.parentNode
    if(parent) parent.removeElement(el)
  }
  /**
   * 执行渲染任务
   * @param vnode 要渲染的结构
   * @param container 容器元素
   */
  function render(vnode, container) {
    if(vnode) {
      // 挂载 or 打补丁
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode) {
        // 卸载
        unmount(container._vnode)
      }
    }

    container._vnode = vnode;
  }

  return {
    render
  }
}

