import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import WebSites from '../views/WebSites.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/websites', component: WebSites },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})