<!-- eslint-disable no-console -->
<script setup lang="ts">
import { List } from '~/components/MsgList'

const MsgForm = defineAsyncComponent(() => import('~/components/MsgForm.vue'))
const user = useUserStore()
const name = $ref(user.savedName)

const router = useRouter()
function go() {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}
const { t } = useI18n()

const { showFromNode, showFromFile } = useReturnMessage()

async function openElElement() {
  const checked = ref<boolean | string | number>(false)
  const vNode = h(ElSwitch, {
    'modelValue': checked.value,
    'onUpdate:modelValue': (val: boolean | string | number) => {
      checked.value = val
    },
    submitData() {
      return checked.value
    },
  })
  const result = await showFromNode(vNode)
  console.log('result: ', result)
}

async function openVueFile() {
  const result = await showFromFile(MsgForm)
  console.log('result: ', result)
}

async function openTsx() {
  const vNode = h(List, {
    data: [
      { id: '1', name: 'sp' },
      { id: '2', name: 'hi' },
    ],
  }, {})
  const result = await showFromNode(vNode)
  console.log('result: ', result)
}
</script>

<template>
  <div>
    <el-button plain @click="openElElement">
      open with ElElement
    </el-button>
    <el-button plain @click="openVueFile">
      open with Vue File
    </el-button>
    <el-button plain @click="openTsx">
      open with Tsx Form
    </el-button>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      <a rel="noreferrer" href="https://github.com/socketbear/vue-dev-guide" target="_blank">
        <span class="font-bold text-green-600">Vue Dev Guide</span> With Vitesse
      </a>
    </p>
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>

    <RouterLink class="icon-btn mx-2" to="/guide" :title="t('button.guide')">
      <div class="flex items-center mt-2">
        <p class="mr-1">
          가이드로 가기
        </p> <div i-carbon-link />
      </div>
    </RouterLink>

    <div py-4 />

    <input
      id="input"
      v-model="name"
      :placeholder="t('intro.whats-your-name')"
      :aria-label="t('intro.whats-your-name')"
      type="text"
      autocomplete="false"
      p="x4 y2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @keydown.enter="go"
    >
    <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

    <div>
      <button
        btn m-3 text-sm
        :disabled="!name"
        @click="go"
      >
        {{ t('button.go') }}
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
