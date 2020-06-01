<template>
  <v-app id="inspire">
    <index-drawer :items="menu"></index-drawer>
    <index-app-bar :Title="title"></index-app-bar>
    <index-view></index-view>
    <index-footer></index-footer>
  </v-app>
</template>

<script>
export default {
  components: {
    Login: () => import("../views/Login"),
    IndexView: () => import("../layouts/View"),
    IndexAppBar: () => import("../layouts/AppBar"),
    IndexDrawer: () => import("../layouts/Drawer"),
    IndexFooter: () => import("../layouts/Footer")
  },
  props: {
    source: String
  },
  computed: {
    title() {
      return this.$store.getters.siteTitle;
    },
    drawer() {
      return this.$store.getters.drawer;
    },
    menu() {
      return this.$store.getters.menu;
    }
  }
};
</script>
