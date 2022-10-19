import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './core/plugins/vuetify'
import Meta from 'vue-meta';
import store from '@/core/services/store';
import ApiService from '@/core/services/api.service';
import VueGeolocation from 'vue-browser-geolocation';
import { InlineSvgPlugin } from "vue-inline-svg";
import Helper from '@/core/plugins/globalHelper';
import VueMask from 'v-mask';
import VuetifyMoney from 'vuetify-money';
// import JwtService from '@/core/services/jwt.service';


Vue.config.productionTip = false
Vue.use(Meta, {
  // keyName: "metaInfo",
  // attribute: "data-vue-meta",
  // ssrAttribute: "data-vue-meta-server-rendered",
  // tagIDKeyName: "vmid",
  refreshOnceOnNavigation: true,
});

Vue.use(InlineSvgPlugin);
Vue.use(VueGeolocation);
Vue.use(VueMask);
Vue.use(VuetifyMoney);
// API service init
ApiService.init();
// Global Helper
Helper.globalHelper();

Vue.filter('two_digits', function (value) {
  if(value.toString().length <= 1)
  {
    return "0"+value.toString();
  }
  return value.toString();
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
