<template>
  <div class="w-6 m-auto text-center">
    <h5>الدفع عن طريق تطبيق</h5>
    <img src="/images/sadad.png" alt="">
    <p class="my-4 bg-primary border-round p-3">
      <strong>{{ service.fee }} ريال</strong><br/>
      ادفع لرقم التاجر <strong>12345</strong>
    </p>
    <p>بانتظار الدفع..</p>
    <ProgressBar mode="indeterminate" style="height: 6px"/>
  </div>
</template>

<script setup>

const props = defineProps(['service'])
</script>

<style lang="scss" scoped>

</style>