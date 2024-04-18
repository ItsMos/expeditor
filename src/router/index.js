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
                        }
                    ]
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/Input.vue')
                },
                {
                    path: '/uikit/floatlabel',
                    name: 'floatlabel',
                    component: () => import('@/views/uikit/FloatLabel.vue')
                },
                {
                    path: '/uikit/invalidstate',
                    name: 'invalidstate',
                    component: () => import('@/views/uikit/InvalidState.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/Button.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/List.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/Tree.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/Panels.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/Overlay.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/Media.vue')
                },
                {
                    path: '/uikit/menu',
                    component: () => import('@/views/uikit/Menu.vue'),
                    children: [
                        {
                            path: '/uikit/menu',
                            component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                        },
                        {
                            path: '/uikit/menu/seat',
                            component: () => import('@/views/uikit/menu/SeatDemo.vue')
                        },
                        {
                            path: '/uikit/menu/payment',
                            component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                        },
                        {
                            path: '/uikit/menu/confirmation',
                            component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                        }
                    ]
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/Messages.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/File.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/Misc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/pages/timeline',
                    name: 'timeline',
                    component: () => import('@/views/pages/Timeline.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
            meta: { requireGuest: true }
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
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
