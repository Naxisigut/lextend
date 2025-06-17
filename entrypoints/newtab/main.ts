import '@unocss/reset/tailwind-compat.css'
import 'uno.css'
import './style/index.scss'
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './routers/index';
import liquidGlass from './plugins/liquidGlass/index';


createApp(App).use(router).use(liquidGlass).mount('#app');
