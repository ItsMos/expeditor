<template>
<div class="w-6 m-auto">
  <Form @submit="submit">
    <template v-if="service?.inputs?.length">
      <h5>بياناتك</h5>
      <div class="field" v-for="input,index in service.inputs">
        <label :for="input.name">{{ input.name }} <span class="text-2xl text-red-500">*</span></label>
        <Field v-slot="{ field, meta }" :name="input.name" :rules="getInputRule(input)" v-model="form.inputs[index]">
          <InputText v-bind="field" :invalid="!meta.valid" :id="input.name" :type="getInputType(input)" />
        </Field>
        <ErrorMessage :name="input.name" class="block" />
      </div>
    </template>

    <Toast />
    <template v-if="service?.documents?.length">
      <p>برجاء رفع المستندات التالية:</p>
      <div v-for="doc,i in service.documents" :key="i">
        <h6 class="mt-2 mb-0">{{ doc }} <span class="text-2xl text-red-500">*</span></h6>
        <FileUpload :ref="(el) => uploaders[i] = el" :showUploadButton="false" accept="image/*, .pdf" :fileLimit="2" :maxFileSize="1000000" chooseLabel="اختر" cancelLabel="إلغاء" invalidFileSizeMessage="حجم الملف كبير">
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
import { useToast } from "primevue/usetoast"

const toast = useToast()
const props = defineProps(['service'])
const emit = defineEmits(['next'])
const loading = ref(false)
const uploaders = ref([])
const form = ref({
  inputs: []
})

async function submit() {
  for (let i = 0; i < uploaders.value.length; i++) {
    const up = uploaders.value[i]
    if (up.files.length !== 1) {
      up.$el.className+= ' border-1 border-red-500'
      toast.add({ severity: "error", summary: "ارفع كامل الملفات", life: 3000 });
      return
    } else {
      up.$el.classList.remove('border-1')
      up.$el.classList.remove('border-red-500')
    }
  }
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
  return { required: true }
}

function getInputType(inputInfo) {
  if (inputInfo.type === 'تاريخ')
    return 'date'
  if (inputInfo.type === 'هاتف')
    return 'tel'
  if (inputInfo.type === 'رقم')
    return 'number'
  return 'text'
}
</script>

<style lang="scss" scoped>

</style>