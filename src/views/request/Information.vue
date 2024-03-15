<template>
<div class="w-6 m-auto">
  <h5>Your Information</h5>
  <div class="field">
    <label for="name1">Full Name</label>
    <InputText id="name1" type="text" />
  </div>
  <div class="field">
    <label for="email1">National ID</label>
    <InputText id="email1" type="text" />
  </div>
  <div class="field">
    <label>Birthdate</label>
    <Calendar :showIcon="true" :showButtonBar="true" v-model="birthdate"></Calendar>
  </div>
  <Button @click="$emit('kk')" label="Submit" class="w-2"></Button>
</div>
</template>

<script setup>
import { ref } from 'vue'

const birthdate = ref(null)
</script>

<style lang="scss" scoped>

</style>