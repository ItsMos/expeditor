<template>
  <div class="card">
    <div class="w-6 m-auto" :class="{ 'p-disabled': done }">
      <Form @submit="submit">
        <h5>تواصل معنا</h5>
        <div class="field">
          <label for="orderNo">رقم الطلب</label>
          <Field v-slot="{ field, meta }" name="رقم الطلب" rules="required|numeric" v-model="form.orderNo">
            <InputText v-bind="field" :invalid="!meta.valid" id="orderNo" />
          </Field>
          <ErrorMessage name="رقم الطلب" class="block" />
        </div>
        <div class="field">
          <label for="message">الرسالة</label>
          <Field v-slot="{ field, meta }" name="الرسالة" rules="required" v-model="form.message">
            <Textarea v-bind="field" :invalid="!meta.valid" id="message" style="resize: vertical" />
          </Field>
          <ErrorMessage name="الرسالة" class="block" />
        </div>
        <Button type="submit" :loading="loading" label="إرسال" class="mt-2 w-3"></Button>
      </Form>
    </div>
    <h6 v-if="done" class="text-primary text-center" style="font-size: 1.5rem;">
      <i class="pi pi-check-circle ml-2"></i>
      تم إرسال رسالتك وسيتم الرد عاجلأ
    </h6>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import axios from '@/axios'

const loading = ref(false)
const done = ref(false)
const form = ref({})

async function submit() {
  loading.value = true
  await axios.post('message', form.value)
  done.value = true
  loading.value = false
}
</script>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
}
</style>