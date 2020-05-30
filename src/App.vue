<template>
  <router-view></router-view>
</template>

<script>
import router from "./router";
import store from "./store";

export default {
  created() {
    this.$vuetify.theme.dark = true;
  }
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (await store.dispatch("validateUser")) {
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});
</script>
