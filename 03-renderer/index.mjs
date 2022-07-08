import browserAppConfig from "./browserAppConfig.mjs";
import createRenderer from "./createRenderer.mjs";

const browserApp = createRenderer(browserAppConfig)

// const { effect, ref } = VueReactivity;
// const bol = ref(false)

// effect(() => {
//   const vnode = {
//     type: 'div',
//     props: bol.value ? {
//       onClick: () => {
//         alert("父元素 clicked")
//       }
//     } : {},
//     children: [
//       {
//         type: 'p',
//         props: {
//           onClick: () => {
//             bol.value = true
//           }
//         },
//         children: 'text'
//       }
//     ]
//   }
  
//   browserApp.render(vnode, document.querySelector('#app'))
// })


// const nodeApp = createRenderer({
//   createElement(tag) {
//     console.log(`创建元素 ${tag}`)
//     return { tag }
//   },
//   setElement(el, text) {
//     console.log(`设置 ${JSON.stringify(el)} 的文本内容：${text}`)
//     el.text = text
//   },
//   insert(el, parent, anchor = null) {
//     console.log(`将 ${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`)
//     parent.children = el
//   }
// })

const vnode = {
  type: 'div',
  props: {
    id: 'foo',
  },
  children: [
    {
      type: 'p',
      props: {
        class: [
          'baz',
          {
            bar: true,
            cool: false
          }
        ],
        style: [{
          color: 'red'
        },{
          'font-size': '24px'
        }],
        onClick: [() => {
          alert('clicked')
        },() => {
          console.log('clicked')
        }],
        onMouseEnter: () => {
          console.log('enter!')
        },
        onMouseLeave: () => {
          console.log('leave!')
        }
      },
      children: 'hello'
    }
  ]
}

// 自定义容器
// const container = {
//   type: 'root'
// }

browserApp.render(vnode, document.querySelector('#app'))
// nodeApp.render(vnode, container)
