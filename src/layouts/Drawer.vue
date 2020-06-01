<template>
  <v-navigation-drawer v-model="drawer" app clipped>
    <v-list dense>
      <template v-for="item in items">
        <v-list-group v-if="item.children" :prepend-icon="item.icon">
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>
          <v-list-item
            link
            v-for="child in item.children"
            :key="index"
            @click.stop="pushRoute(child.route)"
          >
            <v-list-item-action>
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item link v-else @click.stop="pushRoute(item.route)">
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
</template>

<script>
export default {
  name: "Drawer",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    pushRoute: function(target) {
      this.$router.push(target);
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.getters.drawer;
      },
      set(val) {
        this.$store.commit("changeDrawerState", val);
      }
    }
  }
};
</script>

<style scoped></style>
