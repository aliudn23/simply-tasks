import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes.js'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// Creating Vue App
const simplyApp = createApp(App);

simplyApp.use(router);
simplyApp.mount('#app');
