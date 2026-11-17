
<template>
  <!-- Main game page -->
  <div class="game-page">
    <h1>Higher or Lower Game</h1>

    <!-- Only show the game when a login token exists -->
    <div v-if="isLoggedIn">
      <h2>Welcome to the Game!</h2>
      <p>Get a number of 50 or higher to win!</p>

      <!-- Display wins and losses using ScoreBoard -->
      <ScoreBoard
        :wins="wins"
        :losses="losses"
      />

      <!-- GameButton emits the play event to GamePage -->
      <GameButton
        :loading="loading"
        @play="playGame"
      />

      <!-- Display the number returned by the API -->
      <h2 v-if="randomNumber !== null">
        Your Number: {{ randomNumber }}
      </h2>

      <!-- Display whether the player won or lost -->
      <p v-if="resultMessage" class="result">
        {{ resultMessage }}
      </p>

      <!-- Display errors if the API request fails -->
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>

    <!-- Show an error and login link if no token exists -->
    <div v-else>
      <p class="error">
        You must log in before playing the game.
      </p>

      <router-link to="/login">
        Go to Login Page
      </router-link>
    </div>
  </div>
</template>

<script>
// Import Axios to request random numbers from the API
import axios from 'axios'

// Import the required reusable components
import ScoreBoard from '@/components/ScoreBoard.vue'
import GameButton from '@/components/GameButton.vue'

export default {
  name: 'GamePage',

  // Register the components used by this page
  components: {
    ScoreBoard,
    GameButton
  },

  // Define the data used by the game
  data() {
    return {
      // Track whether the user has a login token
      isLoggedIn: false,

      // Store the number of wins and losses
      wins: 0,
      losses: 0,

      // Store the latest number and result messages
      randomNumber: null,
      resultMessage: '',
      errorMessage: '',

      // Prevent multiple requests at the same time
      loading: false
    }
  },

  // Run when the GamePage is opened
  mounted() {
    // Check whether the login token exists
    this.isLoggedIn = Boolean(
      this.$cookies.get('loginToken')
    )

    // Restore previously saved wins and losses
    this.wins = Number(
      this.$cookies.get('wins')
    ) || 0

    this.losses = Number(
      this.$cookies.get('losses')
    ) || 0
  },

  methods: {
    // Called when GameButton emits the play event
    async playGame() {
      // Prevent multiple simultaneous API requests
      if (this.loading) {
        return
      }

      // Prevent playing without a login token
      if (!this.$cookies.get('loginToken')) {
        this.isLoggedIn = false
        return
      }

      // Reset messages before starting a new game
      this.loading = true
      this.errorMessage = ''
      this.resultMessage = ''
      this.randomNumber = null

      try {
        // Request a random number using Axios
        const response = await axios.get(
          'https://www.randomnumberapi.com/api/v1.0/randomnumber'
        )

        // The API returns an array containing a number
        const number = response.data[0]

        // Validate the number returned by the API
        if (
          typeof number !== 'number' ||
          !Number.isFinite(number)
        ) {
          throw new Error('Invalid number received')
        }

        // Display the random number
        this.randomNumber = number

        // Numbers 50 or higher count as wins
        if (number >= 50) {
          this.wins += 1
          this.resultMessage = 'You Win!'
        } else {
          // Numbers below 50 count as losses
          this.losses += 1
          this.resultMessage = 'You Lose!'
        }

        // Save the updated scores in browser cookies
        this.$cookies.set('wins', this.wins, '7d')
        this.$cookies.set('losses', this.losses, '7d')
      } catch (error) {
        // Do not update scores when an API error occurs
        this.errorMessage =
          'Could not get a random number. Please try again.'

        // Log API errors during development only
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Random number API error:', error)
        }
      } finally {
        // Enable the Play Game button again
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Main game container */
.game-page {
  max-width: 500px;
  margin: 70px auto;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Main heading */
h1 {
  color: #2563eb;
}

/* Style the game result message */
.result {
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  color: #2563eb;
}

/* Display errors in red */
.error {
  color: #dc2626;
  font-weight: bold;
}

/* Style the login link */
a {
  color: #2563eb;
  font-weight: bold;
}
</style>
