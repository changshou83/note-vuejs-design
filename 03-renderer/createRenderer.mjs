import { Text, Comment } from './NodeType.mjs'

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
    patchProps,
    createText,
    setText,
    createComment,
    setComment,
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
   * 更新元素
   * @param node 老节点
   * @param newNode 新节点
   */
  function patchElement(node, newNode) {
    const el = newNode.el = node.el
    const oldProps = node.props
    const newProps = newNode.props

    // 更新props
    for(const key in newProps) {
      // 更新
      if(newProps[key] !== oldProps[key]) patchProps(el, key, oldProps[key], newProps[key])
    }
    for(const key in oldProps) {
      // 继承
      if(!(key in newProps)) patchProps(el, key, oldProps[key], null)
    }

    // 更新children
    patchChild(node, newNode, el)
  }

  /**
   * 更新子节点
   * @param {*} node 老节点
   * @param {*} newNode 新节点
   * @param {*} container 容器
   */
  function patchChild(node, newNode, container) {
    if(typeof newNode.children === 'string') {
      if(Array.isArray(node.children)) node.children.forEach(component => unmount(component))
      // 旧节点是文本节点或者空节点
      setElement(container, newNode.children)
    } else if(Array.isArray(newNode.children)) {
      if(Array.isArray(node.children)) {
        // 新旧节点都是一组子节点，涉及核心 Diff 算法
        /* 暂时 */
        node.children.forEach(component => unmount(component))
        newNode.children.forEach(component => patch(component))
        /* 暂时 */
      } else {
        // 旧节点是文本节点或者空节点
        // 先清空容器
        setElement(container, '')
        // 再更新新节点
        newNode.children.forEach(component => patch(component))
      }
    } else {
      // 新子节点不存在
      if(Array.isArray(node.children)) node.children.forEach(component => unmount(component))
      else if(typeof node.children === 'string') setElement(container, '')
    }
  }
  
  /**
   * 在应用挂载or更新时打补丁
   * @param node 旧结构
   * @param newNode 新结构
   * @param container 容器元素
   */
  function patch(node, newNode, container) {
    if(node && (node.type !== newNode.type)) {
      // 如果新旧节点不同就直接卸载旧节点
      unmount(node);
      node = null;
    }
    
    // 根据vnode的类型调用组建相关的挂载与更新方法
    const { type } = newNode;
    if(typeof type === 'string') {
      // 普通标签元素
      if(!node) {
        mountElement(newNode, container)
      } else {
        patchElement(node, newNode)
      }
    } else if(typeof type === 'object') {
      // 组件
    } else if(type === Text) {
      if(!node) {
        const el = newNode.el = createText(newNode.children)
        insert(el, container)
      } else {
        const el = newNode.el = node.el
        if(newNode.children !== node.children) setText(el, newNode.children)
      }
    } else if(type === Comment) {
      if(!node) {
        const el = newNode.el = createComment(newNode.children)
        insert(el, container)
      } else {
        const el = newNode.el = node.el
        if(newNode.children !== node.children) setComment(el, newNode.children)
      }
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

