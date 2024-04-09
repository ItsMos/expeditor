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

  <p>Upload the following docuemnts:</p>
  <ul>
    <li>Document</li>
    <li>Document</li>
    <li>Document</li>
    <li>Document</li>
  </ul>
  <FileUpload :showUploadButton="false" name="demo[]"  url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*, .pdf" :fileLimit="3" :maxFileSize="1000000">
    <template #empty>
      <p>Drag and drop files to here to upload.</p>
    </template>
  </FileUpload>
  <Button @click="$emit('next')" label="Submit" class="mt-2 w-2"></Button>
</div>
</template>

<script setup>
import { ref } from 'vue'

const birthdate = ref(null)
</script>

<style lang="scss" scoped>

</style>