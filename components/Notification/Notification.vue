<template>
  <v-alert
    prominent
    tile
    :value="toggle"
    :type="info.type"
    transition="slide-y-transition"
    class="mb-0"
    dismissible
    dense
  >
    {{ info.message }}
  </v-alert>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Notification",
  computed: {
    ...mapState({
      toggle: 'alertToggle',
      info: 'alertInfo'
    })
  },
}
</script>

<style scoped>

</style>
