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
          path: "/employee_manage",
          component: resolve => require(["../views/EmployeeManage"], resolve)
        },
        {
          path: "/approval_manage",
          component: resolve => require(["../views/ApprovalManage"], resolve)
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
