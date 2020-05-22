import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: null,
    isLogin: false,
    identity: 0 //0: unlogin 1:Boss 2:DM
  },
  mutations: {
    changeDrawerState(state, DrawerState) {
      state.drawer = DrawerState;
    },
    changeLoginStatus(state, status) {
      state.isLogin = status;
    },
    changeIdentity(state, identity) {
      state.identity = identity;
    }
  },
  actions: {},
  modules: {}
});
