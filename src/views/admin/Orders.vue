<template>
  <div class="card">
    <h5>جميع الطلبات</h5>
    <DataView :value="orders" :paginator="false" v-if="!loading">
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
              :class="{ 'border-top-1 surface-border': index !== 0 }">

              <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                  <div>
                    <div class="text-lg font-medium text-900 mt-2">
                      {{ item.service.title }}
                      <small>رقم الطلب {{ item.id }}</small>
                    </div>
                    <span class="font-medium text-secondary text-sm">{{ new Date(item.created_at).toLocaleDateString() }}</span>
                  </div>

                  <div>
                    <Tag class="mr-2" severity="primary" value="تم الدفع"></Tag>
                    <Tag v-if="item.status === 1" class="mr-2" severity="info" value="يتم التنفيذ"></Tag>
                    <Tag v-else-if="item.status === 2" class="mr-2" severity="success" value="تم التنفيذ"></Tag>
                    <Tag v-else-if="item.status === 3" class="mr-2" severity="danger" value="رفض"></Tag>
                    <Tag v-else class="mr-2" severity="info" value="يتم مراجعة الطلب"></Tag>
                  </div>

                </div>
                <div class="flex flex-column md:align-items-end gap-5">
                  <!-- <span class="text-xl font-semibold text-900">$2</span> -->
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <router-link v-if="item.status !== 3" :to="{ name: 'ReviewOrder', params: { id: item.id } }">
                      <Button label="مراجعة"
                        class="flex-auto md:flex-initial white-space-nowrap"/>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await axios.get('allOrders')
  for (let i = 0; i < data.length; i++) {
    const { data: service } = await axios.get('services/'+data[i].service_id)
    data[i].service = service
  }
  orders.value = data
  loading.value = false
})
</script>