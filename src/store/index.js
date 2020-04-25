import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: null
  },
  mutations: {
      changeDrawerState (state, DrawerState){
        state.drawer = DrawerState;
      }
  },
  actions: {
  },
  modules: {
  }
})
