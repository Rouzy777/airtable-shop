import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: []
  },
  mutations: {
    addToCart (state, product) {
      state.cart.push(product)
      sessionStorage.cart = JSON.stringify(state.cart)
    },
    removeFromCart (state, product) {
      const index = state.cart.indexOf(product)
      state.cart.splice(index, 1)
      sessionStorage.cart = JSON.stringify(state.cart)
    },
    restoreCart (state, cartMemory) {
      state.cart = JSON.parse(cartMemory)
    }
  },
  actions: {
  },
  modules: {
  }
})
