
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import vue-cookies to store login tokens and game scores
import VueCookies from 'vue-cookies'

// Create the Vue application
const app = createApp(App)

// Register Vue Router for navigation between pages
app.use(router)

// Register vue-cookies for saving and reading cookies
app.use(VueCookies)

// Mount the application to the HTML element with id="app"
app.mount('#app')
