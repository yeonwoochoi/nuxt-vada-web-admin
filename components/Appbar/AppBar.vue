<template>
  <v-app-bar
    app
    tile
    flat
    fixed
    class="appbar px-md-8"
    color="white"
  >
    <div class="flex-space-between" style="width: 100%;">
      <div class="flex-center">
        <v-app-bar-nav-icon
          class="pt-1 mr-4"
          v-if="$vuetify.breakpoint.smAndDown"
          @click="drawer = !drawer"
        />
        <p class="mb-0 pt-2 font-weight-regular title">{{currentPath}}</p>
      </div>
      <div>
        <avatar-menu @logout="logout"/>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import AvatarMenu from "../Dropdown/AvatarMenu";
export default {
  name: "AppBar",
  components: {AvatarMenu},
  computed: {
    currentPath() {
      let path = this.$router.currentRoute.path;
      let arr = path.split('/')
      let result = arr[arr.length-1].toUpperCase();
      return !result ? 'MAIN' : result;
    },
    drawer: {
      get () {
        return this.$store.getters['getDrawer']
      },
      set (value) {
        return this.$store.commit('setDrawer', value)
      }
    },
  },
  methods: {
    logout() {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>

</style>
