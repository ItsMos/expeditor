<template>
<div class="card">
  <h3>{{ service.title }}</h3>
  <p>{{ service.description }}</p>
  <h5>وقت التنفيذ</h5>
  <p>{{ service.time }}</p>
  <h5>الشروط</h5>
  <ul>
    <li v-for="c in service.conditions">
      {{ c }}
    </li>
  </ul>
  <h5>المستندات المطلوبة</h5>
  <ul>
    <li v-for="d in service.documents">
      {{ d }}
    </li>
  </ul>
</div>

<Steps class="mb-4" v-model:activeStep="activeStep" :model="stepsRoutes" />

<div class="card p-fluid">
  <router-view @next="next" />
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import axios from '@/axios'

const serviceId = router.currentRoute.value.params.serviceId
const activeStep = ref(0)
const service = ref({})

onMounted(async () => {
  const { data } = await axios.get('services/' + serviceId)
  service.value = data
})

function next() {
  activeStep.value = 1
  router.push(`/new/${serviceId}/payment`)

  setTimeout(() => {
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