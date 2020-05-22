import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Layout",
      meta: {
        requireAuth: true
      },
      component: resolve => require(["../layouts/Layout"], resolve),
      children: [
        {
          path: "/",
          component: resolve => require(["../components/HelloWorld"], resolve)
        },
        {
          path: "/t1",
          component: resolve => require(["../components/HelloWorld"], resolve)
        },
        {
          path: "/t2",
          component: resolve => require(["../components/HelloWorld2"], resolve)
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: resolve => require(["../views/Login"], resolve)
    }
  ]
});
