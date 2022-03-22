<template>
  <fade-transition :duration="200" mode="out-in">
    <v-container fluid>
      <v-row align="start" justify="center">
        <v-card
          flat
          width="100%"
          height="fit-content"
          class="mx-8 mb-6 mt-4"
          :style="`background-color: ${bgColor}`"
        >
          <nuxt/>
        </v-card>
      </v-row>
      <v-btn
        v-show="isScrolled"
        v-scroll="onScroll"
        class="ma-6"
        fab
        dark
        fixed
        bottom
        right
        :color="baseColor"
        @click="goTop"
      >
        <v-icon>mdi-menu-up</v-icon>
      </v-btn>
    </v-container>
  </fade-transition>
</template>

<script>
import { FadeTransition } from 'vue2-transitions';
import {mapState} from "vuex";
export default {
  name: "ContentLayout",
  components: {FadeTransition},
  computed: {
    ...mapState({
      bgColor: "backgroundColor",
      baseColor: "baseColor"
    })
  },
  data: () => ({
    isScrolled: false
  }),
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.isScrolled = top > 20
    },
    goTop() {
      this.$vuetify.goTo(0);
    }
  }
}
</script>

<style scoped>

</style>
