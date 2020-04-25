<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <template v-for="item in items">
          <v-list-group v-if="item.children" :prepend-icon="item.icon">
            <template v-slot:activator>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>
              <v-list-item link v-for="child in item.children" :key="index">
                <v-list-item-action>
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ child.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
          </v-list-group>
          <v-list-item link v-else>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{Title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="switchTheme">
        <v-icon>{{ currentThemeIcon }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer app>
      <span>Nicode &copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      Title: "EAS",
      items: [
        {
          title: "员工管理",
          icon: "mdi-account",
        },
        {
          title: "排班管理",
          icon: "mdi-account-clock",
        },
        {
          title: "排班展示",
          icon: "mdi-calendar-month-outline",
        },
        {
          title: "活动审批",
          icon: "mdi-check-underline"
          // children: [
          //   {
          //     title: "x1",
          //     icon: "mdi-settings",
          //   },
          //   {
          //     title: "x2",
          //     icon: "mdi-settings",
          //   }
          // ]
        },

        {
          title: "考勤管理",
          icon: "mdi-check-outline",
        }
      ]
    }),
    created () {
      this.$vuetify.theme.dark = true;
    },
    methods: {
      switchTheme: function () {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      }
    },
    computed: {
      currentThemeIcon: function () {
        return this.$vuetify.theme.dark ? "mdi-brightness-7" : "mdi-brightness-3";
      }
    }
  }
</script>
