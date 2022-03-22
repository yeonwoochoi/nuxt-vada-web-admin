<template>
  <v-list-item>
    <v-list-item-avatar size="70" class="my-4">
      <v-img contain :src="companyLogo"/>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="side-bar-header-font">
        {{company}}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SideBarHeader",
  computed: {
    ...mapState({
      company: "company",
      companyLogo: "companyWhiteLogo",
    }),
  }
}
</script>

<style scoped>

</style>
