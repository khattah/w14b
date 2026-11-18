
<template>
  <!-- Main container for the Higher or Lower game -->
  <div class="game-page">
    <h1>Higher or Lower Game</h1>

    <!-- Only show the game when the user is logged in -->
    <div v-if="isLoggedIn">
      <h2>Welcome to the Game!</h2>
      <p>Get a number of 50 or higher to win!</p>

      <!-- Display the current point balance -->
      <h2 class="points">
        Your Points: {{ points }}
      </h2>

      <!-- Reusable scoreboard displays wins and losses -->
      <ScoreBoard
        :wins="wins"
        :losses="losses"
      />

      <!-- Allow the player to choose a wager -->
      <div class="wager-section">
        <label for="wager">Enter your wager:</label>

        <input
          id="wager"
          v-model.number="wager"
          type="number"
          min="1"
          step="1"
          :max="points"
          :disabled="loading || points === 0"
        />

        <p class="hint">
          Choose between 1 and {{ points }} points.
        </p>
      </div>

      <!-- Explain when the player has no points left -->
      <p v-if="points === 0" class="error">
        You have no points left to wager.
      </p>

      <!-- Reusable button emits a play event -->
      <GameButton
        :loading="loading || points === 0"
        @play="playGame"
      />

      <!-- Display the random number returned by the API -->
      <h2 v-if="randomNumber !== null">
        Your Number: {{ randomNumber }}
      </h2>

      <!-- Display the win or loss message -->
      <p v-if="resultMessage" class="result">
        {{ resultMessage }}
      </p>

      <!-- Display wager validation and API errors -->
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>

    <!-- Show a login link if no login token exists -->
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

// Import the two required reusable components
import ScoreBoard from '@/components/ScoreBoard.vue'
import GameButton from '@/components/GameButton.vue'

export default {
  name: 'GamePage',

  // Register components used in this page
  components: {
    ScoreBoard,
    GameButton
  },

  // Store all reactive game data
  data() {
    return {
      // Track whether the user has a login token
      isLoggedIn: false,

      // Track wins and losses
      wins: 0,
      losses: 0,

      // New players start with 100 points
      points: 100,

      // Default wager is 10 points
      wager: 10,

      // Store the latest number and messages
      randomNumber: null,
      resultMessage: '',
      errorMessage: '',

      // Prevent multiple requests at the same time
      loading: false
    }
  },

  // Restore saved information when the page opens
  mounted() {
    // Check whether the login token exists
    this.isLoggedIn = Boolean(
      this.$cookies.get('loginToken')
    )

    // Restore saved wins and losses
    this.wins = Number(
      this.$cookies.get('wins')
    ) || 0

    this.losses = Number(
      this.$cookies.get('losses')
    ) || 0

    // Read the saved points cookie
    const savedPoints = this.$cookies.get('points')

    // Start with 100 points only if no points cookie exists
    if (savedPoints === null || savedPoints === undefined) {
      this.points = 100

      // Save the initial balance for seven days
      this.$cookies.set('points', this.points, '7d')
    } else {
      // Convert the saved cookie value to a number
      const parsedPoints = Number(savedPoints)

      // Restore valid balances, including zero points
      if (
        Number.isSafeInteger(parsedPoints) &&
        parsedPoints >= 0
      ) {
        this.points = parsedPoints
      } else {
        // Restore the starting balance for invalid cookies
        this.points = 100
        this.$cookies.set('points', this.points, '7d')
      }
    }

    // Set a valid initial wager for the available balance
    if (this.points > 0) {
      this.wager = Math.min(10, this.points)
    } else {
      this.wager = 0
    }
  },

  methods: {
    // Start a new round when GameButton emits "play"
    async playGame() {
      // Prevent multiple simultaneous requests
      if (this.loading) {
        return
      }

      // Check the login token before each round
      if (!this.$cookies.get('loginToken')) {
        this.isLoggedIn = false
        return
      }

      // Validate the wager before requesting a number
      if (
        !Number.isSafeInteger(this.wager) ||
        this.wager < 1 ||
        this.wager > this.points
      ) {
        this.errorMessage =
          'Enter a valid whole-number wager within your balance.'
        return
      }

      // Store the wager for the current round
      const currentWager = this.wager

      // Reset the previous result and error messages
      this.loading = true
      this.randomNumber = null
      this.resultMessage = ''
      this.errorMessage = ''

      try {
        // Request a random number using Axios
        const response = await axios.get(
          'https://www.randomnumberapi.com/api/v1.0/randomnumber'
        )

        // Extract the number from the API response array
        const number = response.data[0]

        // Verify that the API returned a valid number
        if (
          typeof number !== 'number' ||
          !Number.isFinite(number)
        ) {
          throw new Error('Invalid random number')
        }

        // Display the random number
        this.randomNumber = number

        // A number of 50 or higher wins the round
        if (number >= 50) {
          // Deduct the stake, then return double the wager
          this.points =
            this.points - currentWager + currentWager * 2

          // Increase the number of wins
          this.wins += 1

          // Display the winning result
          this.resultMessage =
            `You Win! Your payout is ${currentWager * 2} points.`
        } else {
          // A number below 50 loses the wager
          this.points -= currentWager

          // Increase the number of losses
          this.losses += 1

          // Display the losing result
          this.resultMessage =
            `You Lose! You lost ${currentWager} points.`
        }

        // Save the updated point balance in cookies
        this.$cookies.set('points', this.points, '7d')

        // Save the updated wins and losses in cookies
        this.$cookies.set('wins', this.wins, '7d')
        this.$cookies.set('losses', this.losses, '7d')

        // Adjust the next wager to the remaining balance
        if (this.points === 0) {
          this.wager = 0
        } else if (this.wager > this.points) {
          this.wager = this.points
        }
      } catch (error) {
        // Do not change the balance when an API request fails
        this.errorMessage =
          'Could not get a random number. Please try again.'

        // Log errors only during development
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
/* Main game page container */
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

/* Highlight the current point balance */
.points {
  color: #15803d;
  font-size: 28px;
}

/* Add spacing around the wager input */
.wager-section {
  margin: 25px 0;
}

/* Style the wager label */
label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

/* Style the number input */
input {
  width: 120px;
  padding: 10px;
  font-size: 18px;
  border: 1px solid #999;
  border-radius: 6px;
}

/* Style the wager instructions */
.hint {
  color: #666;
  font-size: 14px;
}

/* Style the result message */
.result {
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  color: #2563eb;
}

/* Display error messages in red */
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
