import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "../components/HelloWorld";
import HelloWorld2 from "../components/HelloWorld2";
import Login from "../views/Login";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/t2",
      component: HelloWorld2
    }
  ]
});
