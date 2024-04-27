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
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: () => import('@/views/Home.vue')
                },
                {
                    path: '/about',
                    name: 'about',
                    component: () => import('@/views/About.vue')
                },
                {
                    path: '/services',
                    name: 'services',
                    component: () => import('@/views/Services.vue')
                },
                {
                    path: '/new/:serviceId',
                    name: 'NewRequest',
                    component: () => import('@/views/request/New.vue'),
                    meta: { requireAuth: true },
                    children: [
                        {
                            path: '/new/:serviceId',
                            component: () => import('@/views/request/Information.vue')
                        },
                        {
                            path: '/new/:serviceId/payment',
                            component: () => import('@/views/request/Payment.vue')
                        },
                        {
                            path: '/new/:serviceId/confirm',
                            component: () => import('@/views/request/Confirm.vue')
                        },
                    ]
                },
                {
                    path: '/register',
                    name: 'register',
                    component: () => import('@/views/Register.vue'),
                    meta: { requireGuest: true }
                },
                {
                    path: '/orders',
                    name: 'orders',
                    component: () => import('@/views/Orders.vue'),
                    meta: { requireAuth: true }
                },
                {
                    path: '/orders/:id',
                    name: 'order',
                    props: true,
                    component: () => import('@/views/Order.vue'),
                    meta: { requireAuth: true }
                },
                {
                    path: '/help',
                    name: 'help',
                    component: () => import('@/views/Help.vue'),
                    meta: { requireAuth: true }
                },
                {
                    path: '/admin',
                    meta: { admin: true },
                    children: [
                        {
                            path: '/admin/services',
                            name: 'ManageServices',
                            component: () => import('@/views/admin/Services.vue')
                        },
                        {
                            path: '/admin/orders',
                            name: 'ManageOrders',
                            component: () => import('@/views/admin/Orders.vue')
                        },
                        {
                            path: '/admin/orders/:id',
                            name: 'ReviewOrder',
                            component: () => import('@/views/admin/ReviewOrder.vue')
                        },
                        {
                            path: '/admin/messages',
                            name: 'Messages',
                            component: () => import('@/views/admin/Messages.vue')
                        }
                    ]
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
            meta: { requireGuest: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requireAuth && !authStore.user) {
      next({ name: 'login' })
    } else if (to.meta.requireGuest && authStore.user) {
      next({ name: 'home' })
    
    } else if (to.meta.admin && !authStore.user?.admin) {
      next({ name: 'home' })

    } else {
      next()
    }
})

export default router;
