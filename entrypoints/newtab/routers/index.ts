import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import WebSites from '../views/WebSites.vue'
import TestDialog from '../views/TestDialog.vue'
import TestDialog3 from '../views/TestDialog3.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/websites', component: WebSites },
  { path: '/testDialog', component: TestDialog },
  { path: '/testDialog3', component: TestDialog3 },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})