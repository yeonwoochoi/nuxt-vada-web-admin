<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0 full-size" style="overflow-y: hidden">
        <v-row align="center" justify="center" class="ma-0 full-size auth-bg-card-color">
          <v-card :width="cardWidth" :height="cardHeight" class="elevation-10 flex-center">
            <Nuxt/>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "auth",
  computed: {
    cardWidth() {
      return `${this.$vuetify.breakpoint.xsOnly ? '100%' : '70%'}`
    },
    cardHeight() {
      return `${this.$vuetify.breakpoint.xsOnly ? '100%' : '600px'}`
    }
  }
}
</script>

<style scoped>
</style>
