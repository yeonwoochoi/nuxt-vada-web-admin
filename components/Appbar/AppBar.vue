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
        <v-breadcrumbs
          :items="currentPath"
          large
        >
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :disabled="item.disabled" :href="item.href">
              <span class="title font-weight-regular" :style="`color: ${item.color}`">
                {{ item.text.toUpperCase() }}
              </span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
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
  data: () => ({
    currentPath: [{
      text: 'Main',
      disabled: false,
      href: '/',
      color: 'black'
    }]
  }),
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
  watch: {
    $route(to, from) {
      this.setCurrentPath(to.path)
    }
  },
  methods: {
    logout() {
      this.$emit('logout')
    },
    setCurrentPath(path) {
      if (path === '/') {
        this.currentPath = [{
          text: 'Main',
          disabled: false,
          href: '/',
          color: 'black'
        }]
        return
      }
      let length = path.length
      let tempPath = path.substring(1, length)
      let result = tempPath.split('/')
      let link = ''
      let breadcrumbs = []
      for (let i = 0; i < result.length; i++) {
        link += `/${result[i]}`
        breadcrumbs.push({
          text: result[i],
          disabled: link === '/support' || link === '/membership' || link === '/payment',
          href: link,
          color: 'black'
        })
      }
      this.currentPath = breadcrumbs
    }
  },
  created() {
    this.setCurrentPath(this.$router.currentRoute.path)
  }
}
</script>

<style scoped>

</style>
