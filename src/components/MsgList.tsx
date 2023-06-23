/* eslint-disable no-console */
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
export interface IList {
  id: string
  name: string
}

export const List = defineComponent({
  name: 'List',
  props: {
    data: {
      required: true,
      type: Array as PropType<IList[]>,
      validation: (d: any) => d.length > 0,
    },
  },
  emits: {
    submitData(data: IList) {
      return data
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
                emit('submitData', v)
              }}
            >{v.name}</li>
          })}
        </ul>
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
