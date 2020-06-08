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
          path: "/arrangement_manage",
          component: resolve => require(["../views/ArrangementManage"], resolve)
        },
        {
          path: "/approval_manage",
          component: resolve => require(["../views/ApprovalManage"], resolve)
        },
        {
          path: "/arrangement_show",
          component: resolve => require(["../views/ArrangementShow"], resolve)
        },
        {
          path: "/arrangement_show/employee/:uId",
          component: resolve =>
            require(["../components/EmployeeArrangement"], resolve)
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
