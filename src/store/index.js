import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: [],
    totalSum: 0,
    shipping: 0,
    code: '',
    errorCodeMessage: ''
  },
  mutations: {
    addToCart (state, product) {
      const vendor = product.vendor
      delete product.vendor
      const vendorIndex = state.cart.findIndex(i => i.vendor.name === vendor.name)
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
      const vendorIndex = state.cart.findIndex(i => i.vendor.name === vendor.name)
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
        const vendorSum = item.products.reduce(function (acc, obj) { return acc + Math.round(obj['final price']) }, 0)
        state.totalSum += vendorSum
        if (vendorSum < 100 && vendorSum !== 0 && state.code === '') {
          state.shipping += 15
        }
      }
      state.totalSum += state.shipping
    },
    emptyCart (state) {
      state.cart = []
      state.code = ''
      sessionStorage.cart = JSON.stringify(state.cart)
      sessionStorage.code = state.code
    },
    setFreeShipping (state, code) {
      state.shipping = 0
      state.code = code
      sessionStorage.cart = JSON.stringify(state.cart)
      sessionStorage.code = state.code
    },
    setErrorMessage (state, message) {
      state.errorCodeMessage = message
    }
  },
  actions: {
    async checkShippingCode ({ commit }, code) {
      commit('setErrorMessage', '')
      try {
        const result = await fetch(`https://limitless-mountain-18309.herokuapp.com/checkFreeShipping?code=${code}`)
        const codeObject = await result.json()
        if (codeObject && codeObject.used.toLowerCase() === 'no') {
          commit('setFreeShipping', code)
          commit('calculateSum')
        } else {
          commit('setErrorMessage', `Code ${code} already used`)
        }
      } catch (e) {
        commit('setErrorMessage', `Code ${code} not found`)
        throw e
      }
    },
    async activateShippingCode ({ commit, state }) {
      // eslint-disable-next-line
      const result = await fetch(`https://limitless-mountain-18309.herokuapp.com/activateFreeShipping?code=${state.code}`)
    },
    async setBuyerName ({ state }, charge) {
      const headers = {
        'Content-Type': 'application/json'
      }
      // eslint-disable-next-line
      const result = await fetch('https://limitless-mountain-18309.herokuapp.com/setBuyerName', {
        method: 'POST',
        headers,
        body: JSON.stringify(charge)
      })
    }
  },
  modules: {
  }
})
