
import { createRouter, createWebHistory } from 'vue-router'

// Import the two pages for our Higher or Lower game
import LoginPage from '../views/LoginPage.vue'
import GamePage from '../views/GamePage.vue'

// Define the routes available in our application
const routes = [
  {
    // Redirect visitors to the login page
    path: '/',
    redirect: '/login'
  },
  {
    // Display the login page
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    // Display the Higher or Lower game
    path: '/game',
    name: 'game',
    component: GamePage
  }
]

// Create the Vue Router using history mode
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Export the router so main.js can use it
export default router
