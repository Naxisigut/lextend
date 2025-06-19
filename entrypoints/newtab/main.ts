import '@unocss/reset/tailwind-compat.css'
import 'uno.css'
import './style/index.scss'
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './routers/index';
import liquidGlass from './plugins/liquidGlass/index';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
createApp(App).use(router).use(liquidGlass).use(ContextMenu).mount('#app');
