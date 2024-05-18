<template>
  <div class="card">
    <ConfirmDialog></ConfirmDialog>
    <Message v-if="order.status === 1" :closable="false" severity="success">الطلب مكتمل</Message>
    <Message v-if="order.status === 2" :closable="false" severity="error">الطلب مرفوض</Message>
    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">رقم الطلب</label>
      <div class="col-12 md:col-10">
        <InputText v-model="order.external_id" readonly />
      </div>
    </div>

    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">ملاحظات</label>
      <div class="col-12 md:col-10">
        <InputText v-model="order.note" readonly />
      </div>
    </div>

    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">اسم العميل</label>
      <div class="col-12 md:col-10">
        <InputText v-model="order.user_name" readonly />
      </div>
    </div>

    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">وقت الطلب</label>
      <div class="col-12 md:col-10">
        <InputText :value="new Date(order.created_at).toLocaleString()" readonly />
      </div>
    </div>

    <template v-if="order?.data?.length">
      <h5>البيانات</h5>
      <div class="field grid" v-for="data,index in order.data" :key="index">
        <label class="col-12 mb-2 md:col-2 md:mb-0">{{ data.name }}</label>
        <div class="col-12 md:col-10">
          <InputText v-model="order.data[index].value" readonly />
        </div>
      </div>
    </template>

    <template v-if="order?.files?.length">
      <h5>المستندات</h5>
      <div class="field grid" v-for="document,index in order.files" :key="index">
        <label class="col-12 mb-2 md:col-2 md:mb-0">{{ document.name }}</label>
        <div class="col-12 md:col-10">
          <a :href="'/'+order.files[index].path" target="_blank">مشاهدة</a>
        </div>
      </div>
    </template>

    <template v-if="order?.result_file">
      <hr/>
      <div class="field grid">
        <label class="col-12 mb-2 md:col-2 md:mb-0">المرفقات</label>
        <div class="col-12 md:col-10">
          <a :href="'/'+order.result_file" target="_blank">مشاهدة</a>
        </div>
      </div>
    </template>

    <FileUpload v-if="order.status == 0" class="mb-2" customUpload mode="basic" accept="image/*,.pdf" :maxFileSize="1000000" chooseLabel="إرفاق ملف" ref="uploader" />

    <div class="flex gap-2">
      <Button @click="accept" v-if="order.status === 0" :disabled="uploader?.files?.length === 0" label="إكمال الطلب"/>
      <Button @click="deny" v-if="order.status === 0" severity="danger" label="رفض الطلب"/>
    </div>
  </div>
</template>

<script setup>
import axios from '@/axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useConfirm } from "primevue/useconfirm"

const route = useRoute()
const order = ref({})
const uploader = ref()
const confirm = useConfirm()

onMounted(async () => {
  const { data } = await axios.get('orders/' + route.params.id)
  order.value = data
})

async function accept() {
  const form = new FormData()
  form.append('id', order.value.id)
  form.append('result_file', uploader.value.files[0])
  await axios.post('acceptOrder', form)
  order.value.status = 1
  confirm.require({
    message: 'تم إكمال الطلب',
    icon: 'pi pi-check-circle',
    rejectClass: 'hidden',
    acceptLabel: 'استمرار',
  })
}

async function deny() {
  await axios.post('denyOrder', { id: order.value.id })
  order.value.status = 2 
}
</script>