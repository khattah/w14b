
<template>
  <!-- Button that starts a new game -->
  <button
    @click="handleClick"
    :disabled="loading"
  >
    {{ loading ? 'Loading...' : 'Play Game' }}
  </button>
</template>

<script>
export default {
  name: 'GameButton',

  // Receive loading status from GamePage
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  // Declare the event sent to the parent component
  emits: ['play'],

  methods: {
    // Notify GamePage when the button is clicked
    handleClick() {
      this.$emit('play')
    }
  }
}
</script>

<style scoped>
/* Style the Play Game button */
button {
  padding: 14px 30px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

/* Disable the button while waiting for the API */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
