import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './assets/styles/main.scss'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/firebase/config';

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(router)

app.mount('#app')
