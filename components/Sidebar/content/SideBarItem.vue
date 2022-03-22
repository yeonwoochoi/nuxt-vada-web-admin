<template>
  <v-list-item
    link
    :to="item.link"
    class="py-1"
    active-class="white--text"
  >
    <v-list-item-icon>
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "SideBarItem",
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
</style>
