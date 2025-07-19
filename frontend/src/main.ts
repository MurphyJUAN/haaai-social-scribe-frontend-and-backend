import { createApp } from 'vue'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import { initializeAnalytics } from './utils/analytics'

import Lara from '@/primevue-presets/lara'
import 'primeicons/primeicons.css'
import './style.css'

const pinia = createPinia()
pinia.use(piniaPersistedstate)

initializeAnalytics()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
