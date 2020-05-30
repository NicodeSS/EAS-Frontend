import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: null,

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
