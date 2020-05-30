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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.userIsLogin) {
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
