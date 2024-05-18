<template>
  <div class="w-6 m-auto text-center">
    <ConfirmDialog></ConfirmDialog>
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
import { useOrderStore } from '@/stores/order'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useConfirm } from "primevue/useconfirm"
import router from '@/router'

const orderStore = useOrderStore()
const { service } = storeToRefs(orderStore)
const confirm = useConfirm()

onMounted(() => {
  setTimeout(() => {
    confirm.require({
      message: 'تم الدفع بنجاح',
      header: 'تم الدفع',
      icon: 'pi pi-check-circle',
      rejectClass: 'hidden',
      acceptLabel: 'استمرار',
      onHide: () => {
        router.push(`/new/confirm`)
      },
      accept: () => {
        router.push(`/new/confirm`)
      },
      reject: () => {
      }
    });
  }, 10000)
})
</script>

<style lang="scss" scoped>

</style>