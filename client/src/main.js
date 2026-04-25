
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Cubo from './components/Cubo.vue'


createApp(App).use(createPinia()).mount('#app')
