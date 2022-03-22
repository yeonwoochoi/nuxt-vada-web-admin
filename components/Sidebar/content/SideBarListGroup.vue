<template>
  <v-list-group
    :prepend-icon="item.icon"
    eager
    v-bind="$attrs"
    active-class="white--text"
    class="py-1"
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-for="(child, i) in item.items">
      <side-bar-list-group
        v-if="child.items"
        :key="`sub-group-${i}`"
        :item="child"
      />
      <side-bar-item
        v-else
        class="pl-6"
        :key="`child-${i}`"
        :item="child"
      />
    </template>
  </v-list-group>
</template>

<script>
import SideBarItem from './SideBarItem'

export default {
  name: "SideBarListGroup",
  components: {
    SideBarItem
  },
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
