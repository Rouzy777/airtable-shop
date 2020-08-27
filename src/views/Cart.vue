<template>
  <section>
    <div>
      <div class="row">
        <div class="col-6">
          <h3 class="font-weight-bold">Cart <span v-if="cartLength">({{ cartLength }})</span></h3>
        </div>
        <div class="col-6 align-self-center text-right">
          <router-link to="/" class="font-weight-bold">
            <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Back to home
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="cartLength" class="row mx-auto col-12 my-3 px-0">
      <ProductCard v-for="(item, i) of products" :key="`${item['Lot #']}-${i}`" :product="item" />
    </div>
    <div v-else class="mt-3">
      <h5>
        Cart is empty.
        <router-link to="/">Go buy!</router-link>
      </h5>
    </div>
  </section>
</template>

<script>
import ProductCard from '@/components/ProductCard'

export default {
  name: 'Cart',
  components: {
    ProductCard
  },
  data: () => ({
    products: []
  }),
  computed: {
    cartLength () {
      return this.$store.state.cart.length
    }
  },
  created () {
    this.products = this.$store.state.cart
  }
}
</script>

<style media="screen">
  .font-weight-medium {
    font-weight: 500;
  }

  .link {
    text-decoration: none !important;
  }
</style>
