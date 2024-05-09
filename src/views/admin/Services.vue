<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from '@/axios';
import { Form, Field, ErrorMessage } from 'vee-validate'

const toast = useToast();

const services = ref([])
const serviceDialog = ref(false);
const deleteDialog = ref(false);
const deleteProductsDialog = ref(false);
const service = reactive({
    conditions: [''],
    documents: [''],
    inputs: [{ name: '', type: '' }]
});
const dt = ref(null);
const filters = ref({});
const totalRecords = ref(0);

onBeforeMount(() => {
    initFilters();
});

async function getData(page = 1) {
    const { data } = await axios.get('services')
    services.value = data
    // totalRecords.value = res.data.data.pagination.total
}
onMounted(async () => {
    getData()
    // const { data } = await axios.get('areas')
    // areas.value = data.data
});

async function onPage(event) {
    getData(event.page)
}

const openNew = () => {
    service.api = ''
    service.title = ''
    service.time = ''
    service.fee = null
    service.description = ''
    service.conditions = ['']
    service.documents = ['']
    service.inputs = [{ name: '', type: '' }]
    serviceDialog.value = true;
};

const hideDialog = () => {
    serviceDialog.value = false;
};

const saveService = async () => {
    if (service.id != null) {
        await axios.post('services/' + service.id, service)
        toast.add({ severity: 'success', summary: 'تم', detail: 'تم التعديل', life: 3000 });
    } else {
        const { data } = await axios.post('services', service)
        console.info(data)
        toast.add({ severity: 'success', summary: 'تم', detail: 'تم الإضافة', life: 3000 });
    }
    getData()
    serviceDialog.value = false;
};

const editService = (editService) => {
    service.id = editService.id+0
    service.api = editService.api+''
    service.title = editService.title+''
    service.description = editService.description+''
    service.time = editService.time+''
    service.fee = editService.fee+0
    service.conditions = [...editService.conditions]
    service.documents = [...editService.documents]
    service.inputs = [...editService.inputs]
    serviceDialog.value = true;
};

const confirmDelete = (editService) => {
    service.id = editService.id;
    deleteDialog.value = true;
};

const deleteService = async () => {
    await axios.delete('services/' + service.id)
    services.value = services.value.filter((val) => val.id !== service.id);
    deleteDialog.value = false;
    service.value = {};
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم الحذف', life: 3000 });
};

const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>

            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="إضافة خدمة" icon="pi pi-plus" class="mr-2" severity="success"
                                @click="openNew" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" /> -->
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="services" lazy :totalRecords="totalRecords" @page="onPage($event)"
                    dataKey="id" :paginator="false" :rows="15" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="{first} إلى {last} من أصل {totalRecords}">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">الخدمات</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                    placeholder="بحث..." />
                            </IconField>
                        </div>
                    </template>

                    <Column field="title" header="الخدمة" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">الخدمة</span>
                            {{ slotProps.data.title }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <router-link :to="'/service/' + slotProps.data.id">
                                <Button icon="pi pi-eye" class="" severity="info" rounded />
                            </router-link> -->
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="editService(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mr-2" severity="warning" rounded
                                @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="serviceDialog" :style="{ width: '450px' }" header="بيانات الخدمة" :modal="true"
                    class="p-fluid">
                    <Form @submit="saveService">
                        <div class="field">
                            <label for="title">اسم الخدمة</label>
                            <Field name="title" v-slot="{ field, meta }" rules="required" v-model.trim="service.title">
                                <InputText v-bind="field" id="title" autofocus :invalid="!meta.valid" />
                            </Field>
                            <ErrorMessage name="title" class="block" />
                        </div>
                        <div class="field">
                            <label for="description">وصف الخدمة</label>
                            <Field name="description" v-slot="{ field, meta }" rules="required"
                                v-model.trim="service.description">
                                <Textarea v-bind="field" :invalid="!meta.valid" id="description"
                                    style="resize: vertical" />
                            </Field>
                            <ErrorMessage name="description" class="block" />
                        </div>
                        <div class="field">
                            <label for="time">وقت التسليم</label>
                            <Field name="time" v-slot="{ field, meta }" rules="required" v-model.trim="service.time">
                                <InputText v-bind="field" :invalid="!meta.valid" id="time" />
                            </Field>
                            <ErrorMessage name="time" class="block" />
                        </div>
                        <div class="field">
                            <label for="fee">رسوم الخدمة</label>
                            <InputGroup>
                                <Field name="fee" v-slot="{ field, meta }" rules="required|numeric"
                                    v-model.number="service.fee">
                                    <InputText v-bind="field" :invalid="!meta.valid" id="fee" />
                                </Field>
                                <InputGroupAddon>
                                    ريال
                                </InputGroupAddon>
                            </InputGroup>
                            <ErrorMessage name="fee" class="block" />
                        </div>

                        <div>
                            <label><strong>الشروط</strong></label>
                            <div class="field" v-for="(con, i, x) in service.conditions" :key="i">
                                <InputText v-model="service.conditions[i]" />
                            </div>
                            <Button icon="pi pi-plus" @click="service.conditions.push('')" />
                        </div>

                        <div class="mt-2">
                            <label><strong>البيانات المطلوبة</strong></label>
                            <InputGroup v-for="(con, i, x) in service.inputs" :key="i">
                                <InputText v-model="service.inputs[i].name" />
                                <InputGroupAddon>
                                    <Dropdown v-model="service.inputs[i].type" :options="['هاتف', 'تاريخ', 'نص', 'رقم']" placeholder="نوع الحقل" />
                                </InputGroupAddon>
                            </InputGroup>
                            <Button icon="pi pi-plus" @click="service.inputs.push({ name: '', type: '' })" />
                        </div>

                        <div class="mt-2">
                            <label><strong>المستندات المطلوبة</strong></label>
                            <div class="field" v-for="(con, i, x) in service.documents" :key="i">
                                <InputText v-model="service.documents[i]" />
                            </div>
                            <Button icon="pi pi-plus" @click="service.documents.push('')" />
                        </div>

                        <div class="field mt-2">
                            <label for="api">API</label>
                            <Field name="api" v-slot="{ field, meta }" v-model.trim="service.api">
                                <InputText v-bind="field" id="api" autofocus :invalid="!meta.valid" />
                            </Field>
                            <ErrorMessage name="api" class="block" />
                        </div>

                        <Button type="submit" label="حفظ" icon="pi pi-check" text class="inline-block" />
                        <Button severity="danger" label="إلغاء" icon="pi pi-times" text @click="hideDialog" class="inline-block" />
                    </Form>

                    <!-- <template #footer>
                    </template> -->
                </Dialog>

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="حذف" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="service">هل تريد حذف <b>{{ service.name }}</b>؟</span>
                    </div>
                    <template #footer>
                        <Button label="لا" icon="pi pi-times" text @click="deleteDialog = false" />
                        <Button label="حذف" icon="pi pi-check" text @click="deleteService" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
</template>
