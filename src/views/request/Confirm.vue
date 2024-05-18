<template>
  <div class="card">
    <h5>تم استلام طلبك</h5>
    <p>رقم الطلب: {{ orderId }}</p>
    <router-link to="/orders">
      <Button class="w-2" label="مراجعة حالة الطلب"/>
    </router-link>
  </div>
</template>

<script setup>
import { useOrderStore } from '@/stores/order'
import { storeToRefs } from 'pinia'

const orderStore = useOrderStore()
const { orderId } = storeToRefs(orderStore)
</script>

<style lang="scss" scoped>

</style>