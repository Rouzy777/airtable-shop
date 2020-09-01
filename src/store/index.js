import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: [],
    totalSum: 0,
    shipping: 0
  },
  mutations: {
    addToCart (state, product) {
      const vendor = product.vendor
      delete product.vendor
      const vendorIndex = state.cart.findIndex(i => i.vendor === vendor)
      if (vendorIndex === -1) {
        state.cart.push({
          vendor,
          products: [product]
        })
      } else {
        state.cart[vendorIndex].products.push(product)
      }
      this.commit('calculateSum') // calculate sum and shipping cost
      sessionStorage.cart = JSON.stringify(state.cart)
    },
    removeFromCart (state, product) {
      const vendor = product.vendor
      delete product.vendor
      const vendorIndex = state.cart.findIndex(i => i.vendor === vendor)
      const index = state.cart[vendorIndex].products.findIndex(i => JSON.stringify(i) === JSON.stringify(product))
      state.cart[vendorIndex].products.splice(index, 1)
      this.commit('calculateSum') // calculate sum and shipping cost
      sessionStorage.cart = JSON.stringify(state.cart)
    },
    restoreCart (state, cartMemory) {
      state.cart = JSON.parse(cartMemory)
    },
    calculateSum (state) {
      state.totalSum = 0
      state.shipping = 0
      for (const item of state.cart) {
        const vendorSum = item.products.reduce(function (acc, obj) { return acc + Math.round(obj['Final Price']) }, 0)
        state.totalSum += vendorSum
        if (vendorSum < 100 && vendorSum !== 0) {
          state.shipping += 15
        }
      }
      state.totalSum += state.shipping
    },
    emptyCart (state) {
      state.cart = []
      sessionStorage.cart = JSON.stringify(state.cart)
    }
  },
  actions: {
  },
  modules: {
  }
})
