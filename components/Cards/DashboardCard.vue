<template>
  <v-card width="100%" class="py-2 px-3">
    <v-card-title>
      <p class="mb-0">{{ title }}</p>
      <v-spacer/>
      <v-btn icon :to="link">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider/>
    <v-card-actions class="flex-center full-width" style="padding: 10px">
      <slot/>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    title: {
      type: String,
      default: () => ''
    },
    link: {
      type: String,
      default: () => '/'
    },
  }
}
</script>

<style scoped>

</style>
