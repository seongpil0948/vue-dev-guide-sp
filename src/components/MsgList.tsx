/* eslint-disable no-console */
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
export interface IListItem {
  id: string
  name: string
}

export const List = defineComponent({
  name: 'List',
  props: {
    data: {
      required: true,
      type: Array as PropType<IListItem[]>,
      validation: (d: any) => d.length > 0,
    },
  },
  emits: {
    submit(data: IListItem) {
      return data
    },
    close() {
      console.log('cancel in msg list')
      return true
    },
  },
  setup(props, { emit }) {
    return () => (
      <div>
        <strong>List</strong>
        <ul>
          {vFor(props.data, (v) => {
            return <li
              key={v.id}
              onClick={() => {
                console.log(v)
                emit('submit', v)
              }}
            >{v.name}</li>
          })}
        </ul>
        <button onClick={() => emit('close')}>닫기</button>
      </div>
    )
  },
  methods: {
    dataLen() {
      return this.data.length
    },
  },
  expose: ['dataLen'],
})

function vFor<T>(arr: T[], callback: (children: T, index: number) => any) {
  return arr.map((v, index) => {
    return callback(v, index)
  })
}
