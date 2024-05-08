<template>
<div class="w-6 m-auto">
  <Form @submit="submit">
    <template v-if="service?.inputs?.length">
      <h5>بياناتك</h5>
      <div class="field" v-for="input,index in service.inputs">
        <label :for="input.name">{{ input.name }}</label>
        <Field v-slot="{ field, meta }" :name="input.name" :rules="getInputRule(input)" v-model="form.inputs[index]">
          <InputText v-bind="field" :invalid="!meta.valid" :id="input" :type="input.type == 'تاريخ' ? 'date' : ''" />
        </Field>
        <ErrorMessage :name="input.name" class="block" />
      </div>
    </template>

    <template v-if="service?.documents?.length">
      <p>برجاء رفع المستندات التالية:</p>
      <div v-for="doc,i in service.documents" :key="i">
        <h6 class="mt-2 mb-0">{{ doc }}</h6>
        <FileUpload :ref="(el) => uploaders[i] = el" :showUploadButton="false" name="demo[]"  url="/api/upload" @upload="onAdvancedUpload($event)" accept="image/*, .pdf" :fileLimit="1" :maxFileSize="1000000" chooseLabel="اختر" cancelLabel="إلغاء">
          <template #empty>
            <p>اسحب {{ doc }} هنا</p>
          </template>
        </FileUpload>
      </div>
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
const uploaders = ref([])
const form = ref({
  inputs: []
})

async function submit() {
  if (uploaders.value.length && uploaders.value.some(el => el.files.length !== 1))
  return
  // if (uploader.value.files.length < props.service.documents.length)
  loading.value = true

  const formData = new FormData()
  formData.append('serviceId', props.service.id)
  form.value.inputs.forEach(i => {
    formData.append('inputs[]', i)
  })
  uploaders.value.forEach(uploader => {
    formData.append('documents[]', uploader.files[0])
  })
  const { data } = await axios.post('order', formData)
  emit('next', data.id)
}

function getInputRule(inputInfo) {
  if (inputInfo.type == 'هاتف')
    return { numeric: true, max: 10, min: 7, required: true }
  if (inputInfo.type == 'نص')
    return { alpha: true, required: true }
  return { required: true }
}
</script>

<style lang="scss" scoped>

</style>