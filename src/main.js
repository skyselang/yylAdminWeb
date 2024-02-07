import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { setupStore } from '@/store'
import 'default-passive-events'

import '@/permission'

import 'virtual:svg-icons-register'

import i18n from '@/lang/index'

import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import 'uno.css'

const app = createApp(App)
setupStore(app)
app.use(router)
app.use(i18n)
app.mount('#app')
