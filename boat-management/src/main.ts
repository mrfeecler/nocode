/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import router from './router'
import store from './store'
import { PDFPlugin } from 'vue3-pdfmake';

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);
app.provide("$store", store);
registerPlugins(app)
app.use(router)
app.use(store)
app.use(PDFPlugin);

app.mount('#app')
