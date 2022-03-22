<template>
  <v-list
    dense
    expand
    nav
  >
    <template
      v-for="(item, index) in items"
    >
      <side-bar-list-group
        v-if="item.items && item.items.length > 0"
        :key="`group-${index}`"
        :item="item"
      />
      <side-bar-item
        v-else
        :key="`item-${index}`"
        :item="item"
      />
    </template>
  </v-list>
</template>

<script>
import SideBarItem from './SideBarItem'
import SideBarListGroup from './SideBarListGroup'

export default {
  name: "SideBarList",
  components: {
    SideBarListGroup,
    SideBarItem
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style scoped>

</style>
