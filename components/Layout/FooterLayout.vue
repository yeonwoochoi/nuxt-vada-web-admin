<template>
  <v-footer
    class="footer-absolute"
    app
    inset
    absolute
    width="auto"
    color="transparent"
  >
    <div class="footer-content px-4 py-1">
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
          {{ `©${getYear}, ${madeBy}` }}
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
