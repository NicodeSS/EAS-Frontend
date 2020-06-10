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

// Warning Interceptor
const ignoreWarnMessage =
  "The .native modifier for v-on is only valid on components but it was used on <div>.";
Vue.config.warnHandler = function(msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  vuetify,
  store,
  template: "<App/>"
});
