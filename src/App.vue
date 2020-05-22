<template>
  <v-app v-if="isLogin" id="inspire">
    <index-drawer :items="items"></index-drawer>
    <index-app-bar :Title="Title"></index-app-bar>
    <index-view></index-view>
    <index-footer></index-footer>
  </v-app>
  <v-app v-else id="inspire">
    <login></login>
  </v-app>
</template>

<script>
export default {
  components: {
    Login: () => import("./views/Login"),
    IndexView: () => import("./layouts/View"),
    IndexAppBar: () => import("./layouts/AppBar"),
    IndexDrawer: () => import("./layouts/Drawer"),
    IndexFooter: () => import("./layouts/Footer")
  },
  props: {
    source: String
  },
  data: () => ({
    Title: "EAS",
    items: [
      {
        title: "员工管理",
        icon: "mdi-account",
        route: "/"
      },
      {
        title: "排班管理",
        icon: "mdi-account-clock",
        route: "/t2"
      },
      {
        title: "排班展示",
        icon: "mdi-calendar-month-outline",
        route: "/"
      },
      {
        title: "活动审批",
        icon: "mdi-check-underline",
        route: "/"
      },
      {
        title: "考勤管理",
        icon: "mdi-check-outline",
        route: "/"
      }
    ]
  }),
  created() {
    this.$vuetify.theme.dark = true;
  },
  computed: {
    drawer() {
      return this.$store.state.drawer;
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  }
};
</script>
