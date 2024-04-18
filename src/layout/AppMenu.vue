<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'

import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore()
const model = ref([
  {
    items: [
      { label: 'الرئيسية', icon: 'pi pi-fw pi-home', to: '/' },
      { label: 'الخدمات', icon: 'pi pi-fw pi-file', to: '/services' },
      { label: 'من نحن', icon: 'pi pi-fw pi-tag', to: '/about' },
    ]
  }
])

onMounted(() => {
  if (authStore?.user) {
    model.value[0].items.push(
      { label: 'طلباتي', icon: 'pi pi-fw pi-clone', to: '/orders' }
    )
  }
  if (authStore?.user?.admin) {
    model.value.push({
      label: 'الإدارة',
      items: [
        { label: 'الخدمات', icon: 'pi pi-fw pi-wrench', to: '/admin/services' },
        { label: 'جميع الطلبات', icon: 'pi pi-fw pi-copy', to: '/admin/orders' },
      ]
    })
  }
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
