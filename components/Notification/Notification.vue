<template>
  <v-snackbar v-model="show" :color="color" top style="padding-top: 80px;">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <p class="white--text mb-0 pl-6" style="font-size: 1rem;">{{ message }}</p>
      <v-btn text @click="show = false">Close</v-btn>
    </div>
  </v-snackbar>
</template>

<script>
export default {
  name: "Notification",
  data: () => ({
    show: false,
    message: '',
    color: 'error'
  }),
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'alert/showMessage') {
        this.message = state.alert.content
        this.color = state.alert.color
        this.show = true
      }
    })
  }
}
</script>

<style scoped>

</style>
