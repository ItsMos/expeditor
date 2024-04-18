<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/axios'

const services = ref([])

onMounted(async () => {
    const { data } = await axios.get('services')
    services.value = data
})
</script>

<template>
     <div class="surface-ground px-4 py-8 md:px-6 lg:px-8">
    <div class="text-900 font-bold text-6xl mb-4 text-center">خدماتنا</div>
    <!-- <div class="text-700 text-xl mb-6 text-center line-height-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div> -->

    <div class="grid">
        <div class="col-12 lg:col-4" v-for="service in services" :key="service.id">
            <div class="p-3 h-full">
                <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                    <div class="text-900 font-medium text-xl mb-2">{{ service.title }}</div>
                    <div class="text-600">{{ service.description }}</div>
                    <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                    <div class="flex align-items-center">
                        <i class="pi pi-money-bill ml-2"></i>
                        <span v-if="service.fee" class="font-bold text-2xl text-900">{{ service.fee }} ريال</span>
                        <span v-else class="font-bold text-2xl text-900">مجانًا</span>
                        <!-- <span class="ml-2 font-medium text-600">per month</span> -->
                    </div>
                    <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                    <h6 class="mt-0 psy-1 text-gray-500 font-normal">
                        <i class="pi pi-clock ml-2"></i>
                        وقت التنفيذ: {{ service.time }}
                    </h6>
                    <router-link :to="'/new/'+service.id" style="margin-top: auto">
                        <Button label="اطلب الآن" class="p-3 w-full mt-auto"></Button>
                    </router-link>
                </div>
            </div>
        </div>

    </div>
 </div>
</template>
