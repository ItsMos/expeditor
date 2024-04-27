<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    items: [
      { label: 'مراجعة الطلبات', icon: 'pi pi-fw pi-clone', to: '/' },
    ]
  }
])
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
