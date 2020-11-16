<template>
  <div id="app" class="container pt-4">
    <router-view/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import firebase from 'firebase/app'

export default {
  name: 'App',
  created () {
    this.checkAuthAndAddProducts()
    if (sessionStorage.cart) {
      this.restore(sessionStorage.cart)
    }
  },
  methods: {
    ...mapMutations({
      restore: 'restoreCart', // `this.restore()` would call `this.$store.commit('restoreCart')`
      add: 'addToCart'
    }),
    checkAuthAndAddProducts () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid
          firebase.database().ref(`/users/${uid}/cart`).once('value', (snapshot) => {
            if (snapshot.exists()) {
              const products = Object.entries(snapshot.val())
              for (const lot of products) {
                const rawLotDetails = JSON.parse(lot[1].lotJSON)
                const lotDetails = Object.fromEntries(
                  Object.entries(rawLotDetails).map(([k, v]) => [k.toLowerCase(), v])
                )
                const fullProductData = {
                  ...lotDetails,
                  vendor: lot[1].vendor,
                  serverlot: true,
                  expiration: lot[1].expiration
                }
                this.add(fullProductData)
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style media="screen">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
