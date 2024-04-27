import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requireAuth: true },
            children: [
                {
                    path: '/',
                    name: 'orders',
                    component: () => import('@/views/Orders.vue')
                },
                {
                    path: '/orders/:id',
                    name: 'ReviewOrder',
                    component: () => import('@/views/ReviewOrder.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
            meta: { requireGuest: true }
        },
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requireAuth && !authStore.user) {
      next({ name: 'login' })
    } else if (to.meta.requireGuest && authStore.user) {
      next({ name: 'orders' })

    } else {
      next()
    }
})

export default router;
