<template>
  <v-menu
    bottom
    max-width="160px"
    offset-y
    nudge-top="-10"
    z-index="0"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        large
        v-on="on"
      >
        <v-avatar>
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-list-item-content class="justify-center">
        <div class="text-center">
          <v-btn
            width="100%"
            text
            color="#9a9a9a"
            :ripple="false"
            class="no-background-hover font-weight-regular mb-4"
            :to="profileLink"
          >
            Profile
          </v-btn>
          <v-btn
            width="100%"
            text
            color="#9a9a9a"
            :ripple="false"
            class="no-background-hover font-weight-regular"
            :to="editAccountLink"
          >
            Edit Account
          </v-btn>
          <v-divider class="my-3"/>
          <v-btn
            width="100%"
            text
            color="#9a9a9a"
            :ripple="false"
            class="no-background-hover font-weight-regular"
            @click="logout"
          >
            Logout
          </v-btn>
        </div>
      </v-list-item-content>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "AvatarMenu",
  data: () => ({
    profileLink: '/profile',
    editAccountLink: '/profile/edit'
  }),
  methods: {
    logout() {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>

</style>
