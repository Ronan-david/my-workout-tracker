import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './assets/styles/main.scss'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/firebase/config';
import { i18n } from '@/assets/i18n/index';

initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);
app.use(i18n);
app.mount('#app');
