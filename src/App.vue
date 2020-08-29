<template>
  <div id="app" class="container pt-4">
    <router-view/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapMutations({
      restore: 'restoreCart' // `this.restore()` would call `this.$store.commit('restoreCart')`
    })
  },
  created () {
    if (sessionStorage.cart) {
      this.restore(sessionStorage.cart)
    }
  }
}
</script>
