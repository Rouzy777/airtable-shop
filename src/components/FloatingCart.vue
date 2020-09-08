<template>
  <router-link class="d-flex floating-button bg-primary" tag="div" to="cart">
    <span class="mx-auto">
      <span class="floating-button__length">
        {{ cartLength }}
      </span>
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
    </span>
  </router-link>
</template>

<script>
export default {
  name: 'FloatingCart',
  computed: {
    cartLength () {
      let total = 0
      for (const vendor of this.$store.state.cart) {
        total += vendor.products.length
      }
      return total
    }
  }
}
</script>

<style lang="css" scoped>
.floating-button {
  width: 50px;
  height: 50px;
  cursor: pointer;
  color: white;
  border-radius: 50%;
  align-items: center;
  position: relative;
}

.floating-button__length {
  position: absolute;
  right: 9px;
  width: 12px;
  height: 12px;
  line-height: 10px;
  font-size: 9px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.2);
  color: black;
  background-color: white;
  text-align: center;
}
</style>
