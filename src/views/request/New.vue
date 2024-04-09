<template>
<div class="card">
  <h3>{{ service.title }}</h3>
  <p>{{ service.description }}</p>
  <h5>وقت التنفيذ</h5>
  <p>{{ service.time }}</p>
  <h5>الشروط</h5>
  <ul v-if="service?.conditions?.length">
    <li v-for="c in service.conditions">
      {{ c }}
    </li>
  </ul>
  <p v-else>لا يوجد</p>
  <h5>المستندات المطلوبة</h5>
  <ul v-if="service?.documents?.length">
    <li v-for="d in service.documents">
      {{ d }}
    </li>
  </ul>
  <p v-else>لا يوجد</p>
</div>

<Steps class="mb-4" v-model:activeStep="activeStep" :model="stepsRoutes" />

<div class="card p-fluid">
  <router-view @next="next" :service="service" />
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import axios from '@/axios'
import { useToast } from 'primevue/usetoast'

const serviceId = router.currentRoute.value.params.serviceId
const activeStep = ref(0)
const service = ref({})
const toast = useToast()

onMounted(async () => {
  const { data } = await axios.get('services/' + serviceId)
  service.value = data
})

function next(orderId) {
  activeStep.value = 1
  router.push(`/new/${serviceId}/payment`)

  setTimeout(() => {
    service.value.orderId = orderId
    toast.add({ severity: 'success', summary: 'تم الدفع', life: 3000 })
    activeStep.value = 2
    router.push(`/new/${serviceId}/confirm`)
  }, 10000)
}

const stepsRoutes = ref([
  {
    label: 'البيانات',
    // to: '/new'
  },
  {
    label: 'الدفع',
    // to: '/new/payment'
  },
  {
    label: 'التأكيد',
    // to: '/new/confirm'
  }
]);
</script>