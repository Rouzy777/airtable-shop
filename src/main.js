import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import Vuelidate from 'vuelidate'
import VueImg from 'v-img'
import VueFbCustomerChat from 'vue-fb-customer-chat'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/style.css'
import 'bootstrap'

import router from './router'
import store from './store'

Bugsnag.start({
  apiKey: '27d86f8fb18f0889821bb2c106b7cfc4',
  plugins: [new BugsnagPluginVue()]
})

Bugsnag.getPlugin('vue')
  .installVueErrorHandler(Vue)

Vue.use(VueLazyload, {
  preLoad: 1.5,
  lazyComponent: true,
  observer: true
})
Vue.use(Vuelidate)
Vue.use(VueImg)
Vue.use(VueFbCustomerChat, {
  page_id: 401229796745952, //  change 'null' to your Facebook Page ID,
  theme_color: '#333333', // theme color in HEX
  locale: 'en_US' // default 'en_US'
})

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyCn4poC7ndUtRk3JwuLvJTZ8ou0gh3X1BA',
  authDomain: 'indigem-93a99.firebaseapp.com',
  databaseURL: 'https://indigem-93a99.firebaseio.com',
  projectId: 'indigem-93a99',
  storageBucket: 'indigem-93a99.appspot.com',
  messagingSenderId: '680668856738',
  appId: '1:680668856738:web:e8366c11b453a8f11bb2fb',
  measurementId: 'G-RZ1YCXJGNL'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
