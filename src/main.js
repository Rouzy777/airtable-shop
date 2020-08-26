import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/style.css'
import 'bootstrap'
import router from './router'
import store from './store'

Vue.use(VueLazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
