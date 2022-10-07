import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/setup', name: 'setup', component: () => import('../views/SetupView.vue') },
    { path: '/Firebase', name: 'Firebase', component: () => import('../views/FirebaseView.vue') },
    { path: '/Services', name: 'Services', component: () => import('../views/ServicesView.vue') },
    { path: '/Services2', name: 'Services2', component: () => import('../views/Services2View.vue') },
    { path: '/Map', name: 'Map', component: () => import('../views/MapView.vue') },
    { path: '/Sncf', name: 'Sncf', component: () => import('../views/SncfView.vue') },
    { path: '/Bar', name: 'Bar', component: () => import('../views/ChartJs/BarView.vue') },
    { path: '/Line', name: 'Line', component: () => import('../views/ChartJs/LineView.vue') },
    { path: '/Bubble', name: 'Bubble', component: () => import('../views/ChartJs/BubbleView.vue') },
    { path: '/Pie', name: 'Pie', component: () => import('../views/ChartJs/PieView.vue') },
    { path: '/Area', name: 'Area', component: () => import('../views/ChartJs/AreaView.vue') },
    { path: '/Radar', name: 'Radar', component: () => import('../views/ChartJs/RadarView.vue') },
    { path: '/Animation', name: 'Animation', component: () => import('../views/ChartJs/AnimationView.vue') },
  ]
})

export default router
