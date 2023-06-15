# 메시지박스 작동원리
## 목적
모달 컴포넌트를 `<template>`에서 사용하면 각 태그마다 선언되는 emit, event, 반응형 변수를 선언하며
많은 양의 코드와 컴포넌트 인스턴스를 소비하게 됩니다.  

이에 `<script>` 내에서 함수를 호출하는 형태로 위 문제를 해결 할 수 있습니다.



## Promise를 반환하는 이벤트를 필드 값으로 가지고 있는 Modal 객체를 생성 하는 원리
호출시 vnode를 생성 하는 Promise를 반환 vue 이벤트 발생 전 까지는 resolve 되지 않습니다.  
전역 메모리 객체로 vnode 를 수동으로 관리하고,  이벤트 발생시 삭제하는 원리입니다.
[레포지터리 및 폴더 주소](https://github.com/element-plus/element-plus/tree/dev/packages/components/message-box/src)

MessageBox는 Vue 파일을 컴파일한 VNode를 관리 및 대리하는 오브젝트입니다.
다음 예제는 MessageBoxConstructor 를 컴파일하여 VNode 객체로 관리하고 있습니다.  

```ts
import MessageBoxConstructor from './index.vue'
const initInstance = (
  props: any,
  container: HTMLElement,
  appContext: AppContext | null = null
) => {
  const vnode = createVNode(
    // vue template file
    MessageBoxConstructor,
    props,
    isFunction(props.message) || isVNode(props.message)
      ? {
          default: isFunction(props.message)
            ? props.message
            : () => props.message,
        }
      : null
  )
  vnode.appContext = appContext
  render(vnode, container)
  getAppendToElement(props).appendChild(container.firstElementChild!)
  return vnode.component
}
```

props.message(`func || VNode || others`)를 default slot로 가지고 있는 VNode를 생성 후,
container(props.appendTo || document.body)의 첫번째 자식으로 VNode를 추가합니다.


```ts
const messageInstance = new Map<
  ComponentPublicInstance<{ doClose: () => void }>, // marking doClose as function
  {
    options: any
    callback: Callback | undefined
    resolve: (res: any) => void
    reject: (reason?: any) => void
  }
>()
function MessageBox(
  options: ElMessageBoxOptions | string | VNode,
  appContext: AppContext | null = null
): Promise<{ value: string; action: Action } | Action> {
  return new Promise((resolve, reject) => {
    // 
    const vm = showMessage(
      options,
      appContext ?? (MessageBox as IElMessageBox)._context
    )
    // collect this vm in order to handle upcoming events.
    messageInstance.set(vm, {
      options,
      callback, // (value, action: 'confirm' | 'close' | 'cancel')
      resolve,
      reject,
    })
  })
}
```
messageInstances 는 이전 생성한 VNode를 `Map<VNode, {[k: string]: func}>` 형태로 단순히 메모리에 저장하고 있습니다.  

MessageBox 함수는 props | VNode를 받아 Promise를 반환하고 messageInstance resolve(반환, 에러, 삭제) 되는 콜백은  messageInstance에게 위탁합니다.

이후 MessageBoxConstructor 에 이벤트 Listener를 추가합니다. 
- _keyword: options.onVanish_
  - emits(vanish)에 따라 resolve 를 진행하고 VNode를 메모리에서 삭제합니다.
- _keyword: options.onAction_
  - emits(action) 일경우 props 의 callback을 실행하고 resolve 또는 reject하여 messageInstances 내 vm의  Promise를 반환합니다.

```ts
const MESSAGE_BOX_VARIANTS = ['alert', 'confirm', 'prompt'] as const
const MESSAGE_BOX_DEFAULT_OPTS: Record<
  typeof MESSAGE_BOX_VARIANTS[number],
  Partial<ElMessageBoxOptions>
> = {
  alert: { closeOnPressEscape: false, closeOnClickModal: false },
  confirm: { showCancelButton: true },
  prompt: { showCancelButton: true, showInput: true },
}

MESSAGE_BOX_VARIANTS.forEach((boxType) => {
  ;(MessageBox as IElMessageBox)[boxType] = messageBoxFactory(
    boxType
  ) as ElMessageBoxShortcutMethod
})
function messageBoxFactory(boxType: typeof MESSAGE_BOX_VARIANTS[number]) {
  return (
    message: string | VNode,
    title: string | ElMessageBoxOptions,
    options?: ElMessageBoxOptions,
    appContext?: AppContext | null
  ) => {
    let titleOrOpts = ''
    if (isObject(title)) {
      options = title as ElMessageBoxOptions
      titleOrOpts = ''
    } else if (isUndefined(title)) {
      titleOrOpts = ''
    } else {
      titleOrOpts = title as string
    }

    return MessageBox(
      Object.assign(
        {
          title: titleOrOpts,
          message,
          type: '',
          ...MESSAGE_BOX_DEFAULT_OPTS[boxType],
        },
        options,
        {
          boxType,
        }
      ),
      appContext
    )
  }
}
```
`'alert', 'confirm', 'prompt'`  variant 모달은 단순히 기존 `MessageBox` 함수의 변형을 variant마다 커스텀된 옵션값으로 렌더링하는 함수를 담고있습니다..



## 결과
- **TSX** 문법을 사용하여 해당 컴포넌트 구현 가능
- **TSX** 문법을 사용하여 해당 컴포넌트 사용 가능
- `'alert', 'confirm', 'prompt'` 와같은 다양한 variant를 추가로 구성가능
- 인스턴스수를 사용되는 만큼만 생성
  
## 코드량을 줄여 사용 될 예제
[예제 파일 참고](src/pages/index.vue)


### 더보면 좋을 문서
- [Modal 기본 UI (JS)](http://yoonbumtae.com/?p=3632)
