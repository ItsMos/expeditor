<template>
  <div class="card">
    <DataTable :value="messages" tableStyle="min-width: 50rem">
      <Column>
        <template #body="slotProps">
          <Badge :severity="slotProps.data.seen? 'contrast':'info'" :class="{ 'opacity-0': slotProps.data.seen }" />
        </template>
      </Column>
      <Column field="order_no" header="رقم الطلب"></Column>
      <Column field="created_at" header="وقت الاستلام">
        <template #body="slotProps">
          {{ new Date(slotProps.data.created_at).toLocaleString() }}
        </template>
      </Column>
      <Column field="name" header="الاسم"></Column>
      <Column field="email" header="البريد الالكتروني"></Column>
      <Column>
        <template #body="{ index }">
          <Button @click="openMessage(index)" rounded icon="pi pi-eye"/>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="messageDialog" :style="{ width: '450px' }" header="رسالة" :modal="true"
      class="p-fluid">
      <h6>{{ messageViewed.email }}</h6>
      <h6>{{ messageViewed.name }}</h6>
      <p>{{ messageViewed.message }}</p>
    </Dialog>
  </div>
</template>

<script setup>
import axios from '@/axios'
import { ref, onMounted } from 'vue'

const messages = ref([])
const messageDialog = ref(false)
const messageViewed = ref({})
onMounted(async () => {
  const { data } = await axios.get('messages')
  messages.value = data
})

async function openMessage(index) {
  messageViewed.value = messages.value[index]
  messageViewed.value.seen = 1
  messageDialog.value = true
  axios.get('messages/'+messageViewed.value.id)
}
</script>

<style lang="scss" scoped>
:deep(.p-datatable td) {
  text-align: right;
}
</style>