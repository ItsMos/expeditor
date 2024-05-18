<template>
  <div class="card">
    <ConfirmDialog></ConfirmDialog>
    <Message v-if="order.status === 1" :closable="false">تم إرسال الطلب للجهة المناسبة</Message>
    <Message v-if="order.status === 2" :closable="false" severity="success">الطلب مكتمل</Message>
    <Message v-if="order.status === 3" :closable="false" severity="error">الطلب مرفوض</Message>
    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">رقم الطلب</label>
      <div class="col-12 md:col-10">
        <InputText v-model="order.id" readonly />
      </div>
    </div>

    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">اسم العميل</label>
      <div class="col-12 md:col-10">
        <InputText v-model="user.name" readonly />
      </div>
    </div>

    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">الخدمة</label>
      <div class="col-12 md:col-10">
        <InputText v-model="service.title" readonly />
      </div>
    </div>

    <div class="field grid">
      <label class="col-12 mb-2 md:col-2 md:mb-0">وقت الطلب</label>
      <div class="col-12 md:col-10">
        <InputText :value="new Date(order.created_at).toLocaleString()" readonly />
      </div>
    </div>

    <template v-if="service?.inputs?.length">
      <h5>البيانات</h5>
      <div class="field grid" v-for="input,index in service.inputs" :key="index">
        <label class="col-12 mb-2 md:col-2 md:mb-0">{{ input.name }}</label>
        <div class="col-12 md:col-10">
          <InputText v-model="order.inputs[index]" readonly />
        </div>
      </div>
    </template>

    <template v-if="service?.documents?.length">
      <h5>المستندات</h5>
      <div class="field grid" v-for="document,index in service.documents" :key="index">
        <label class="col-12 mb-2 md:col-2 md:mb-0">{{ document }}</label>
        <div class="col-12 md:col-10">
          <a :href="'/'+order.documents[index]" target="_blank">مشاهدة</a>
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

    <div class="flex gap-2">
      <Button @click="accept" v-if="order.status === 0" label="إرسال الطلب للجهة"/>
      <Button @click="deny" v-if="order.status === 0" severity="danger" label="إرسال للتعديل"/>
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
const service = ref({})
const user = ref({})
const confirm = useConfirm()

onMounted(async () => {
  const { data } = await axios.get('orders/' + route.params.id)
  const { data: data2 } = await axios.get('services/' + data.service_id)
  const { data: data3 } = await axios.get('user/' + data.user_id)
  user.value = data3
  service.value = data2
  order.value = data
})

async function accept() {
  await axios.post('acceptOrder', { orderId: order.value.id })
  order.value.status = 1
  confirm.require({
    message: 'تم إرسال الطلب للجهة المعنية بنجاح',
    header: 'تم',
    icon: 'pi pi-check-circle',
    rejectClass: 'hidden',
    acceptLabel: 'استمرار',
  })
}

async function deny() {
  await axios.post('denyOrder', { orderId: order.value.id })
  order.value.status = 3 
}
</script>