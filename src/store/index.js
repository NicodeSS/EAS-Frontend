import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //Layout related
    siteTitle: "叮咚",
    drawer: null,
    menu: [
      {
        title: "员工管理",
        icon: "mdi-account",
        route: "/employee_manage"
      },
      {
        title: "排班管理",
        icon: "mdi-account-clock",
        route: "/arrangement_manage"
      },
      {
        title: "排班展示",
        icon: "mdi-calendar-month-outline",
        route: "/arrangement_show"
      },
      {
        title: "活动审批",
        icon: "mdi-check-underline",
        route: "/approval_manage"
      },
      {
        title: "考勤管理",
        icon: "mdi-check-outline",
        route: "/attendance_manage"
      }
    ],
    // User related
    userIsLogin: false,
    userRole: 0, //0: logout 1:DM 2:Boss
    userId: null,
    userName: null,
    userToken: null
  },
  getters,
  mutations,
  actions,
  modules: {}
});
