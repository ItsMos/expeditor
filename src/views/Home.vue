<template>
  <div class="card">

    <div class="grid grid-nogutter surface-section text-800" dir="ltr">
      <div class="col-12 md:col-6 p-6 text-center md:text-right flex align-items-center ">
        <section dir="rtl">
          <div class="text-6xl text-primary font-bold mb-3">سهل وسريع:</div>
          <span class="block text-6xl font-bold mb-1">استخرج تصاريحك وأوراقك إلكترونيًا</span>
          <p class="mt-4 mb-4 text-700 line-height-3">موقع "المعقب الإلكتروني" يغير طريقة حصولك على الخدمات الحكومية. يوفر الموقع تجربة سهلة وسريعة و آمنة لجميع المستخدمين. يتميز الموقع بسهولة الاستخدام وسرعة إنجاز المعاملات مع الدعم المستمر</p>
          <router-link to="/services">
            <Button label="ابدأ الآن" type="button" class="p-button-raised"></Button>
          </router-link>
        </section>
      </div>
      <div class="col-12 md:col-6 overflow-hidden">
        <img src="/images/people.jpeg" alt="Image"
          class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%); max-height: 600px;" />
      </div>
    </div>


    <div class="surface-section px-4 py-8 md:px-6 lg:px-8 text-center">
      <div class="mb-3 mb-6 font-bold text-3xl">
        <span class="text-900">مكان واحد,</span>
        <span class="text-blue-600"> جميع معاملاتك</span>
      </div>
      <div class="grid">
        <div class="col-12 md:col-4 mb-4 px-5">
          <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
            <i class="pi pi-desktop text-4xl text-blue-500"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">سهولة الاستخدام</div>
          <span class="text-700 line-height-3"> يتميز موقع "المعقب الإلكتروني" بواجهة سهلة الاستخدام وبسيطة، مما يجعله سهل الاستخدام لأي شخص، بغض النظر عن خبرته التقنية.</span>
        </div>
        <div class="col-12 md:col-4 mb-4 px-5">
          <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
            <i class="pi pi-lock text-4xl text-blue-500"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">سرعة إنجاز المعاملات</div>
          <span class="text-700 line-height-3">يلتزم موقع "المعقب الإلكتروني" بتقديم خدمات سريعة وفعالة. تتم معالجة جميع المعاملات في أقصر وقت ممكن، مما يوفر عليك الوقت والجهد.</span>
        </div>
        <div class="col-12 md:col-4 mb-4 px-5">
          <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
            <i class="pi pi-check-circle text-4xl text-blue-500"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">دعم متميز</div>
          <span class="text-700 line-height-3"> يقدم موقع "المعقب الإلكتروني" فريق دعم عملاء متميزًا جاهزًا لمساعدتك في أي وقت. يمكنك التواصل معنا عبر البريد الإلكتروني أو عن طريق الرسائل.</span>
        </div>

      </div>
    </div>
  </div>

</template>