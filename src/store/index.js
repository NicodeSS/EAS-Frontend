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
    userType: 0, //0: unlogin 1:Boss 2:DM
    userId: null,
    userName: null
  },
  getters,
  mutations,
  actions,
  modules: {}
});