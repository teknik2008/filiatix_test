// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'
import 'vuetify/dist/vuetify.min.css'
import config from './config_app'
import qs from 'qs'

let lo = console.log

axios.defaults['withCredentials'] = true;
axios.interceptors.response.use((response) => {
  return response;
}, function(error) {

  return Promise.reject(error.response);
});
axios.defaults.paramsSerializer=(params)=>qs.stringify(params)


Vue.use(Vuetify)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
