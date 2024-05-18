<template>
  <div className="card">
    <h5>تسجيل حساب جديد</h5>

    <Form @submit="register">
      <div class="field grid">
        <label for="name" class="col-12 mb-2 md:col-2 md:mb-0">الاسم رباعي</label>
        <div class="col-12 md:col-10">
          <Field v-slot="{ field, meta }" name="الاسم" rules="required|name" v-model="form.name">
            <InputText v-bind="field" :invalid="!meta.valid" id="name" type="text" />
          </Field>
          <ErrorMessage name="الاسم" />
        </div>
      </div>

      <div class="field grid">
        <label for="email" class="col-12 mb-2 md:col-2 md:mb-0">البريد الالكتروني</label>
        <div class="col-12 md:col-10">
          <Field v-slot="{ field, meta }" name="الايميل" rules="required|email" v-model="form.email">
            <InputText v-bind="field" :invalid="!meta.valid" id="email" />
          </Field>
          <ErrorMessage name="الايميل" />
        </div>
      </div>
      <div class="field grid">
        <label for="password" class="col-12 mb-2 md:col-2 md:mb-0">كلمة المرور</label>
        <div class="col-12 md:col-10">
          <Field v-slot="{ field, meta }" name="كلمة المرور" rules="required|min:8" v-model="form.password">
            <Password v-model="form.password" :invalid="!meta.valid" :feedback="false" id="password" />
          </Field>
          <ErrorMessage name="كلمة المرور" />
        </div>
      </div>
      <div class="field grid">
        <label for="password2" class="col-12 mb-2 md:col-2 md:mb-0">تأكيد كلمة المرور</label>
        <div class="col-12 md:col-10">
          <Field v-slot="{ field, meta }" name="تأكيد كلمة المرور" :rules="{ required: true, min: 8, is: form.password }" v-model="form.password2">
            <Password v-model="form.password2" :invalid="!meta.valid" :feedback="false" id="password2" />
          </Field>
          <ErrorMessage name="تأكيد كلمة المرور" />
        </div>
      </div>
      <div class="field grid">
        <label for="nationalId" class="col-12 mb-2 md:col-2 md:mb-0">رقم الهوية</label>
        <div class="col-12 md:col-10">
          <Field v-slot="{ field, meta }" name="رقم الهوية" rules="required|numeric|min:10|max:10" v-model="form.nationalId">
            <InputText v-bind="field" :invalid="!meta.valid" id="nationalId" type="number" />
          </Field>
          <ErrorMessage name="رقم الهوية" />
        </div>
      </div>
      <Button :loading="loading" label="تسجيل" type="submit" />
    </Form>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ref } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast';

const toast = useToast()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref({})
async function register() {
  loading.value = true
  try {
    const { data } = await axios.post('register', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      nationalId: form.value.nationalId,
    })
    authStore.login(data.token)

    toast.add({ severity: 'success', summary: 'تم الستجيل', life: 3000 });
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)

  } catch (error) {
    console.info(error.response.data)
  }
}
</script>