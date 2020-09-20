import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import Vuelidate from 'vuelidate'
import VueImg from 'v-img'
import VueFbCustomerChat from 'vue-fb-customer-chat'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/style.css'
import 'bootstrap'
import router from './router'
import store from './store'

Vue.use(VueLazyload, {
  preLoad: 1.5
})
Vue.use(Vuelidate)
Vue.use(VueImg)
Vue.use(VueFbCustomerChat, {
  page_id: 401229796745952, //  change 'null' to your Facebook Page ID,
  theme_color: '#333333', // theme color in HEX
  locale: 'en_US' // default 'en_US'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
