
<template>
  <!-- Display the current wins and losses -->
  <div class="scoreboard">
    <div class="score">
      <h3>Wins</h3>
      <p>{{ wins }}</p>
    </div>

    <div class="score">
      <h3>Losses</h3>
      <p>{{ losses }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreBoard',

  // Receive the scores from the parent GamePage
  props: {
    wins: {
      type: Number,
      required: true
    },
    losses: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
/* Arrange the scores side by side */
.scoreboard {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin: 25px 0;
  padding: 15px;
  background-color: #eef2ff;
  border-radius: 10px;
}

/* Style each score section */
.score {
  flex: 1;
}

/* Make the score numbers larger */
.score p {
  font-size: 32px;
  font-weight: bold;
  color: #2563eb;
  margin: 10px 0;
}
</style>
