// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store/index";
import axiosApi from "./plugins/axios";

Vue.config.productionTip = false;
Vue.prototype.$http = axiosApi;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  vuetify,
  store,
  template: "<App/>"
});
