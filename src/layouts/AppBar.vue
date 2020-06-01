<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon @click.stop="changeDrawerState" />
    <v-toolbar-title>{{ Title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu v-model="menu" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon>person</v-icon>
          <span>{{ userName }}</span>
        </v-btn>
      </template>
      <v-btn text block v-on:click="doLogout">
        <span>Logout</span>
      </v-btn>
    </v-menu>

    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn icon @click.stop="switchTheme" v-on="on">
          <v-icon>{{ currentThemeIcon }}</v-icon>
        </v-btn>
      </template>
      <span>Change Theme</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  props: {
    Title: {
      required: true
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    doLogout: function() {
      this.$store.dispatch("setUser", null);
      localStorage.removeItem("token");
      location.reload();
    },
    switchTheme: function() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    changeDrawerState: function() {
      this.$store.commit("changeDrawerState", !this.drawer);
    }
  },
  computed: {
    currentThemeIcon: function() {
      return this.$vuetify.theme.dark ? "mdi-brightness-7" : "mdi-brightness-4";
    },
    drawer: function() {
      return this.$store.getters.drawer;
    },
    userName: function() {
      return this.$store.getters.userName || "未登陆";
    }
  }
};
</script>

<style scoped></style>
