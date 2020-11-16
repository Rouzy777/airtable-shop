import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: [],
    totalSum: 0,
    shipping: 0,
    code: '',
    isModalActive: false,
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
      // filter server lots
      const filteredCart = state.cart.map((vendor) => {
        return {
          ...vendor,
          products: vendor.products.filter(product => !product.serverlot)
        }
      })
      sessionStorage.cart = JSON.stringify(filteredCart)
    },
    removeFromCart (state, product) {
      const vendor = product.vendor
      delete product.vendor
      const vendorIndex = state.cart.findIndex(i => i.vendor.name === vendor.name)
      const index = state.cart[vendorIndex].products.findIndex(i => JSON.stringify(i) === JSON.stringify(product))
      state.cart[vendorIndex].products.splice(index, 1)
      this.commit('calculateSum') // calculate sum and shipping cost
      // filter server lots
      const filteredCart = state.cart.map((vendor) => {
        return {
          ...vendor,
          products: vendor.products.filter(product => !product.serverlot)
        }
      })
      sessionStorage.cart = JSON.stringify(filteredCart)
    },
    restoreCart (state, cartMemory) {
      state.cart = JSON.parse(cartMemory)
    },
    calculateSum (state) {
      state.totalSum = 0
      state.shipping = 0
      for (const item of state.cart) {
        const vendorSum = item.products.reduce(function (acc, obj) { return acc + obj['final price'] }, 0)
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
        const result = await fetch(`/checkFreeShipping?code=${code}`)
        const codeObject = await result.json()
        if (codeObject && codeObject.used && codeObject.used.toLowerCase() === 'no') {
          commit('setFreeShipping', code)
          commit('calculateSum')
        } else if (codeObject && codeObject.not_found) {
          commit('setErrorMessage', `Code ${code} not found`)
        } else {
          commit('setErrorMessage', `Code ${code} is disabled`)
        }
      } catch (e) {
        throw new Error(e)
      }
    },
    // async activateShippingCode ({ commit, state }) {
    //   // eslint-disable-next-line
    //   const result = await fetch(`https://indigem.ca/activateFreeShipping?code=${state.code}`)
    // },
    async setBuyerName ({ state }, charge) {
      const headers = {
        'Content-Type': 'application/json'
      }
      // eslint-disable-next-line
      const result = await fetch('https://indigem.ca/setBuyerName', {
        method: 'POST',
        headers,
        body: JSON.stringify(charge)
      })
    }
  },
  modules: {
    firebase
  }
})
