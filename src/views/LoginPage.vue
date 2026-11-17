
<template>
  <!-- Main login page container -->
  <div class="login-page">
    <h1>Higher or Lower Game</h1>
    <h2>Login</h2>

    <!-- Prevent the form from refreshing the page -->
    <form @submit.prevent="login">
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Enter your password"
        required
      />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <!-- Display an error when login fails -->
    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
// Axios will send the login request to the API
import axios from 'axios'

export default {
  name: 'LoginPage',

  data() {
    return {
      // Store the values entered by the user
      email: '',
      password: '',
      errorMessage: '',
      loading: false
    }
  },

  methods: {
    // Send login credentials to the ReqRes API
    async login() {
      this.errorMessage = ''
      this.loading = true

      try {
        const response = await axios.post(
          'https://reqres.in/api/login',
          {
            email: this.email,
            password: this.password
          }
        )

        // Save the returned login token in a cookie
        this.$cookies.set('loginToken', response.data.token, '1d')

        // Navigate to the game page after successful login
        this.$router.push('/game')
      } catch (error) {
        // Show an error if the login request fails
        this.errorMessage =
          error.response?.data?.error ||
          'Login failed. Please try again.'
      } finally {
        // Re-enable the login button
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Center the login form */
.login-page {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Style the form fields */
input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* Style the login button */
button {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Display login errors in red */
.error {
  color: #dc2626;
}
</style>
