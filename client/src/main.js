// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import 'leaflet/dist/leaflet.css'

Vue.use(VueResource)
Vue.http.options.root = process.env.VUE_APP_ROOT

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
