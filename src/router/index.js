
import { createRouter, createWebHistory } from 'vue-router'

// Import the Login and Game views
import LoginPage from '../views/LoginPage.vue'
import GamePage from '../views/GamePage.vue'

// Define the application routes and their metadata
const routes = [
  {
    // Redirect the home page to the login page
    path: '/',
    redirect: '/login'
  },
  {
    // Login page route
    path: '/login',
    name: 'login',
    component: LoginPage,

    // Unique metadata for the Login Page
    meta: {
      title: 'W14B - Login',
      author: 'Omer',
      description: 'Log in to play the Higher or Lower game.',
      keywords: 'login, authentication, Vue, W14B'
    }
  },
  {
    // Game page route
    path: '/game',
    name: 'game',
    component: GamePage,

    // Unique metadata for the Game Page
    meta: {
      title: 'W14B - Higher or Lower Game',
      author: 'Omer',
      description:
        'Play Higher or Lower, wager points, and track your score.',
      keywords: 'higher or lower, game, wager, points, Vue'
    }
  }
]

// Create the Vue Router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Update document metadata after each route change
router.afterEach((to) => {
  // Change the browser tab title
  document.title = to.meta.title || 'W14B Higher or Lower'

  // Update or create a named meta tag
  const updateMetaTag = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`)

    // Create the tag if it does not already exist
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', name)
      document.head.appendChild(tag)
    }

    // Set the metadata for the current page
    tag.setAttribute('content', content || '')
  }

  // Update the required meta tags
  updateMetaTag('author', to.meta.author)
  updateMetaTag('description', to.meta.description)
  updateMetaTag('keywords', to.meta.keywords)
})

export default router
