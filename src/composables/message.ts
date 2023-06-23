import type { ElMessageBoxOptions } from 'element-plus'
import type { Component, VNode } from 'vue'

export function useReturnMessage() {
  const showFromNode = <T>(vNode: VNode, title?: string | ElMessageBoxOptions | undefined) => new Promise<T>((resolve, reject) => {
    ElMessageBox({
      title,
      beforeClose: (action, instance, done) => {
        done()
      },
      message: () => h(vNode, {
        onSubmitData: (data: T) => {
          resolve(data)
          ElMessageBox.close()
        },
        onVnodeBeforeUnmount(vNode) {
          reject(new Error(`close without return ${vNode.key?.toString()}`))
        },
      }),
    })
  })

  const showFromFile = <T>(instance: Component, title?: string | ElMessageBoxOptions | undefined) => showFromNode<T>(h(instance), title)

  return {
    showFromNode,
    showFromFile,
  }
}
