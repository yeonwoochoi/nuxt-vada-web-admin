<template>
  <v-footer
    class="footer-absolute"
    app
    inset
    absolute
    width="auto"
    color="transparent"
  >
    <div class="footer-content">
      <div>
        <a
          class="no-decoration-black-text text--black"
          :href="link"
          target="_blank"
        >
          Link
        </a>
      </div>
      <div>
        <p class="mb-0">
          {{ `©${getYear}, made with by ${madeBy}` }}
        </p>
      </div>
    </div>
  </v-footer>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "FooterLayout",
  computed: {
    ...mapState({
      link: 'siteOrigin',
      madeBy: 'madeBy'
    }),
    getYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>

</style>
