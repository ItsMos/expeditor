<template>
<div class="w-6 m-auto">
  <Form @submit="submit">
    <template v-if="service?.inputs?.length">
      <h5>بياناتك</h5>
      <div class="field" v-for="input,index in service.inputs">
        <label :for="input">{{ input }}</label>
        <Field v-slot="{ field, meta }" :name="input" rules="required" v-model="form.inputs[index]">
          <InputText v-bind="field" :invalid="!meta.valid" :id="input" />
        </Field>
        <ErrorMessage :name="input" class="block" />
      </div>
    </template>

    <template v-if="service?.documents?.length">
      <p>برجاء رفع المستندات التالية:</p>
      <ul>
        <li v-for="doc in service.documents">{{ doc }}</li>
      </ul>
      <FileUpload ref="uploader" :showUploadButton="false" name="demo[]"  url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*, .pdf" :fileLimit="service.documents.length" :maxFileSize="1000000" chooseLabel="اختر" cancelLabel="إلغاء">
        <template #empty>
          <p>اسحب الملفات هنا</p>
        </template>
      </FileUpload>
    </template>
    <Button type="submit" :loading="loading" label="قدم الطلب" class="mt-2 w-3"></Button>
  </Form>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import axios from '@/axios'

const props = defineProps(['service'])
const emit = defineEmits(['next'])
const loading = ref(false)
const uploader = ref()
const form = ref({
  inputs: []
})

async function submit() {
  if (uploader.value.files.length < props.service.documents.length)
  return
  loading.value = true

  const formData = new FormData()
  formData.append('serviceId', props.service.id)
  form.value.inputs.forEach(i => {
    formData.append('inputs[]', i)
  })
  uploader.value.files.forEach(f => {
    formData.append('documents[]', f)
  })
  const { data } = await axios.post('order', formData)
  emit('next', data.id)
}
</script>

<style lang="scss" scoped>

</style>