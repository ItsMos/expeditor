<template>
<div class="card">
  <h3>Service Name</h3>
  <p>Service description.</p>
  <h5>Delivery Time</h5>
  <p>2 Days</p>
  <h5>Required Documents</h5>
  <ul>
    <li>Document</li>
    <li>Document</li>
    <li>Document</li>
    <li>Document</li>
  </ul>
</div>

<Steps class="mb-4" v-model:activeStep="activeStep" :model="stepsRoutes" />

<div class="card p-fluid">
  <router-view @next="next" />
</div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'

console.log(router.currentRoute.value.params.service)
const activeStep = ref(0)

function next() {
  activeStep.value = 1
  router.push('/new/service/payment')

  setTimeout(() => {
    activeStep.value = 2
    router.push('/new/service/confirm')
  }, 10000)
}

const stepsRoutes = ref([
  {
    label: 'Information',
    // to: '/new'
  },
  {
    label: 'Payment',
    // to: '/new/payment'
  },
  {
    label: 'Confirmation',
    // to: '/new/confirm'
  }
]);
</script>