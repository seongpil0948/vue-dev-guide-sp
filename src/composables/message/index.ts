import type { ElMessageBoxOptions } from 'element-plus'
import type { Component, VNode, VNodeArrayChildren, VNodeProps } from 'vue'

export function useReturnMessage() {
  const showFromNode = <T>(vNode: VNode, title?: string | ElMessageBoxOptions | undefined) => new Promise<T>((resolve, reject) => {
    ElMessageBox({
      title,
      beforeClose: (action, instance, done) => {
        done()
      },
      message: () => h(vNode, {
        onSubmit: (data: T) => {
          resolve(data)
          ElMessageBox.close()
        },
        onClose: () => {
          reject(new Error('close emitted'))
          ElMessageBox.close()
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onVnodeBeforeUnmount(vNode) {
          reject(new Error('close without keyword emitted'))
        },
      }),
    })
  })

  const showFromFile = <T>(p: IFromFile<T>) => showFromNode<T>(h(p.component, p.props, p.children), p.title)

  return {
    showFromNode,
    showFromFile,
  }
}

type RawProps = VNodeProps & {
  __v_isVNode?: never
  [Symbol.iterator]?: never
} & Record<string, any>

interface IFromFile<T> {
  component: Component
  props?: RawProps & T
  children?: RawChildren | RawSlots
  title?: string | ElMessageBoxOptions | undefined
}
type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any)

interface RawSlots {
  [name: string]: unknown
  $stable?: boolean
  /* removed internal: _ctx */
  /* removed internal: _ */
}
