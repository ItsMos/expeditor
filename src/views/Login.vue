<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { Form, Field, ErrorMessage } from 'vee-validate'
import axios from '@/axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast';

const toast = useToast()
const { layoutConfig } = useLayout();
const authStore = useAuthStore()
const email = ref('');
const password = ref('');
const loading = ref(false)

const logoUrl = computed(() => {
  return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

async function login() {
  loading.value = true
  try {
    const { data } = await axios.post('login', {
      email: email.value,
      password: password.value,
    })
    authStore.login(data.token)
    toast.add({ severity: 'success', summary: 'تم تسجيل الدخول', life: 3000 })
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)

  } catch (error) {
    toast.add({ severity: 'error', summary: 'خطأ', life: 3000 })
    loading.value = false
    // console.info(error.response.data)
  }
}
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div> -->
            <span class="text-600 font-medium">سجل الدخول</span>
          </div>

          <Form @submit="login">
            <label for="email" class="block text-900 text-xl font-medium mb-2">البريد الإلكتروني</label>
            <div class="mb-5">
              <Field v-slot="{ field, meta }" name="email" rules="required|email" v-model="email">
                <InputText v-bind="field" :invalid="!meta.valid" id="email" type="text" class="w-full md:w-30rem"
                  style="padding: 1rem" />
              </Field>
              <ErrorMessage name="email" class="block" />
            </div>

            <div class="mb-3">
              <label for="password" class="block text-900 font-medium text-xl mb-2">كلمة المرور</label>
              <Field v-slot="{ field, meta }" name="password" rules="required" v-model="password">
                <Password v-model="password" :invalid="!meta.valid" id="password" class="w-full" :feedback="false" inputClass="w-full"
                  :inputStyle="{ padding: '1rem' }"></Password>
              </Field>
              <ErrorMessage name="password" class="block" />
            </div>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <!-- <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label> -->
              </div>
            </div>
            <Button :loading="loading" type="submit" label="دخول" class="w-full p-3 text-xl"></Button>
          </Form>
        </div>
      </div>
    </div>
  </div>
  <Toast />
  <AppConfig simple />
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
