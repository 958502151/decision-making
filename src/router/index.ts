import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/making',
        name: 'making',
        component: () => import('@/layout/index.vue'),
        children: [
            { path: '/', component: () => import('@/views/start.vue') },
            {
                path: '/start',
                name: 'start',
                component: () => import('@/views/start.vue')
            },
            {
                path: '/view',
                name: 'view',
                component: () => import('@/views/view.vue')
            },
            {
                path: '/history',
                name: 'history',
                component: () => import('@/views/history.vue'),
            },
            {
                path: '/makingView',
                name: 'makingView',
                component: () => import('@/views/making.vue')
            },
            // 测试fabirc性能
            {
                path: '/test',
                name: 'test',
                component: () => import('@/views/test.vue')
            },
            // 测试canvas性能
            {
                path: '/canvas',
                name: 'canvas',
                component: () => import('@/views/canvas.vue')
            }
        ]
    }
]

const router = createRouter({history: createWebHashHistory(), routes})

export default router