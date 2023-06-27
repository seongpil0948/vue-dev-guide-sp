<!-- eslint-disable no-console -->
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

interface IFormData {
  domains: DomainItem[]
  email: string
}
interface DomainItem {
  key: number
  value: string
}

const props = defineProps<{ initialData: Partial<IFormData> }>()
const emit = defineEmits<{
  (e: 'submit', value: IFormData): void
  (e: 'cancel'): void
}>()

const formRef = ref<FormInstance>()
const defaultForm: IFormData = {
  domains: [
    {
      key: 1,
      value: '',
    },
  ],
  email: '',
}

const formData = reactive<IFormData>(defaultForm)
watchEffect(() => {
  formData.email = props.initialData.email ?? formData.email
})

const removeDomain = (item: DomainItem) => {
  const index = formData.domains.indexOf(item)
  if (index !== -1)
    formData.domains.splice(index, 1)
}

const addDomain = () => {
  formData.domains.push({
    key: Date.now(),
    value: '',
  })
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl)
    return
  formEl.validate((valid) => {
    if (valid) {
      emit('submit', formData)
    }
    else {
      console.log('error submit!')
      return false
    }
  })
}

defineExpose({ formData })
</script>

<template>
  <el-form ref="formRef" :model="formData" label-width="120px" class="demo-dynamic">
    <el-form-item
      prop="email" label="Email" :rules="[
        {
          required: true,
          message: 'Please input email address',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: 'Please input correct email address',
          trigger: ['blur', 'change'],
        },
      ]"
    >
      <el-input v-model="formData.email" />
    </el-form-item>
    <el-form-item
      v-for="(domain, index) in formData.domains" :key="domain.key" :label="`Domain${index}`"
      :prop="`domains.${index}.value`" :rules="{
        required: true,
        message: 'domain can not be null',
        trigger: 'blur',
      }"
    >
      <el-input v-model="domain.value" />
      <el-button class="mt-2" @click.prevent="removeDomain(domain)">
        Delete
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addDomain">
        도메인 추가
      </el-button>
      <el-button type="primary" @click="submitForm(formRef)">
        제출
      </el-button>
      <el-button @click="() => $emit('cancel')">
        닫기
      </el-button>
    </el-form-item>
  </el-form>
</template>
