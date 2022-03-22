<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    v-bind="$attrs"
    :color="backgroundColor"
    dark
  >
    <template v-slot:prepend>
      <side-bar-header />
      <v-divider/>
    </template>
    <template>
      <side-bar-list :items="items" />
    </template>
  </v-navigation-drawer>
</template>

<script>
import {mapState} from "vuex";
import SideBarHeader from "./header/SideBarHeader";
import SideBarList from "./content/SideBarList";

export default {
  name: "SideBar",
  components: {SideBarList, SideBarHeader},
  data: () => ({
    logo: 'http://demos.creative-tim.com/nuxt-black-dashboard-pro/img/icon-nuxt.svg',
    title: 'Vada Partners Admin',
  }),
  computed: {
    ...mapState({
      items: 'drawerItems',
      backgroundColor: 'baseColor'
    }),
    drawer: {
      get () {
        return this.$store.getters['getDrawer']
      },
      set (value) {
        return this.$store.commit('setDrawer', value)
      }
    },
  },

}
</script>

<style scoped>

</style>
