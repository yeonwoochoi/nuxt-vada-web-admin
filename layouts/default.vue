<template>
  <v-app>
    <side-bar/>
    <app-bar/>
    <v-main :style="`background-color: ${bgColor}`">
      <notification/>
      <content-layout/>
    </v-main>
    <footer-layout/>
  </v-app>
</template>

<script>
import SideBar from "../components/Sidebar/SideBar";
import Notification from "../components/Notification/Notification";
import FooterLayout from "../components/Layout/FooterLayout";
import AppBar from "../components/Appbar/AppBar";
import ContentLayout from "../components/Layout/ContentLayout";
import {mapState} from "vuex";
export default {
  name: "default",
  components: {ContentLayout, AppBar, FooterLayout, Notification, SideBar},
  computed: {
    ...mapState({
      bgColor: "backgroundColor",
    })
  }
}
</script>

<style scoped>

</style>
