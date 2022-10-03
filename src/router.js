import Vue from "vue";
import Router from "vue-router";
import routes from "./core/routes";

Vue.use(Router);

export default new Router({
  routes: [...routes],
});
