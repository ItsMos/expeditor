<template>
  <div class="card" v-if="order.id != null">
    <Message v-if="order.status === 0" :closable="false">طلبك قيد المراجعة</Message>
    <Message v-if="order.status === 1" :closable="false">يتم العمل على طلبك</Message>
    <Message v-if="order.status === 2" :closable="false" severity="success">تم الموافقة على طلبك</Message>
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
  </div>
</template>

<script setup>
import axios from '@/axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const order = ref({})
const service = ref({})
const user = ref({})

onMounted(async () => {
  const { data } = await axios.get('orders/' + route.params.id)
  const { data: data2 } = await axios.get('services/' + data.service_id)
  const { data: data3 } = await axios.get('user/' + data.user_id)
  user.value = data3
  service.value = data2
  order.value = data
})
</script>