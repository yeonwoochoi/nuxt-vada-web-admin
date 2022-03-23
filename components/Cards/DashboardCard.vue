<template>
  <v-card width="100%" class="px-3" :loading="isLoading">
    <v-card-title>
      <p class="mb-0">{{ title }}</p>
      <v-spacer/>
      <v-btn v-if="!!link" icon :to="link">
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
      default: () => ''
    },
    isLoading: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>

</style>
