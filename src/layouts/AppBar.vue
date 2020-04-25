<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon @click.stop="changeDrawerState" />
    <v-toolbar-title>{{ Title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click.stop="switchTheme">
      <v-icon>{{ currentThemeIcon }}</v-icon>
    </v-btn>
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
  methods: {
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
    drawer() {
      return this.$store.state.drawer;
    }
  }
};
</script>

<style scoped></style>
