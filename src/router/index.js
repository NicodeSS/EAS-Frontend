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
          path: "/employee_manage",
          component: resolve => require(["../views/EmployeeManage"], resolve)
        },
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
    },
    {
      path: "*",
      name: "Not Found",
      component: resolve => require(["../views/404.vue"], resolve)
    }
  ]
});
