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
          class="mr-4"
          v-if="$vuetify.breakpoint.mdAndDown"
          @click="drawer = !drawer"
        />
        <p class="mb-0 font-weight-regular title" v-html="currentPath"/>
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
  created() {
    this.setCurrentPath()
  },
  data: () => ({
    currentPath: 'MAIN'
  }),
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.setCurrentPath()
      }
    }
  },
  computed: {
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
    },
    setCurrentPath() {
      let path = this.$router.currentRoute.path;
      let length = path.length
      let tempPath = path.substring(1, length).toUpperCase()
      let result = tempPath.replace(/\//gi, "<span class='mx-2'>></span>")
      this.currentPath = !result ? 'MAIN' : result;
    }
  }
}
</script>

<style scoped>

</style>
