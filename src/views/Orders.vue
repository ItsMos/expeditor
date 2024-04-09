<template>
  <div class="card">
    <h5>All Orders</h5>
    <DataView :value="dataviewValue" :paginator="true" :rows="9">
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
              :class="{ 'border-top-1 surface-border': index !== 0 }">

              <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                  <div>
                    <div class="text-lg font-medium text-900 mt-2">{{ item.name }}</div>
                    <span class="font-medium text-secondary text-sm">{{ (new Date()).toLocaleDateString() }}</span>
                  </div>

                  <div>
                    <Tag class="mr-2" severity="primary" value="Paid"></Tag>
                    <Tag v-if="item.status === 'done'" class="mr-2" severity="success" value="Delivered"></Tag>
                    <Tag v-else class="mr-2" severity="info" value="Pending Review"></Tag>
                  </div>

                </div>
                <div class="flex flex-column md:align-items-end gap-5">
                  <!-- <span class="text-xl font-semibold text-900">$2</span> -->
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <!-- <Button icon="pi pi-heart" outlined></Button> -->
                    <Button label="View" :disabled="item.status !== 'done'"
                      class="flex-auto md:flex-initial white-space-nowrap"></Button>
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
import ProductService from '@/service/ProductService'

const dataviewValue = ref([
  { name: 'Service', status: 'done' },
  { name: 'Service 2' },
  { name: 'Service 3' },
]);

const productService = new ProductService();

const getSeverity = (product) => {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
</script>