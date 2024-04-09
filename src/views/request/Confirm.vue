<template>
  <div>
    <h5>تم استلام طلبك</h5>
    <p>رقم الطلب: {{ service.orderId }}</p>
    <router-link to="/orders">
      <Button class="w-2" label="مراجعة حالة الطلب"/>
    </router-link>
  </div>
</template>

<script setup>

const props = defineProps(['service'])
</script>

<style lang="scss" scoped>

</style>