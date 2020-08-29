<template>
  <section>
    <div>
      <div class="row">
        <div class="col-6">
          <h3 class="font-weight-bold">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            Cart <span v-if="cartLength">({{ cartLength }})</span>
          </h3>
        </div>
        <div class="col-6 align-self-center text-right">
          <router-link to="/" class="font-weight-bold link">
            <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Return to List
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="cartLength" class="row mx-auto col-12 my-3 px-0">
      <ProductCard v-for="(item, i) of products" :key="`${item['Lot #']}-${i}`" :product="item" />
      <div class="w-100 py-3 text-right border-top">
        <p>
          Total:
          <span class="font-weight-bold">${{ totalSum }}</span>
        </p>
        <router-link tag="button" class="btn btn-success font-weight-bold" to="/checkout">
          CHECKOUT
        </router-link>
      </div>
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
    products: [],
    totalSum: 0
  }),
  computed: {
    cartLength () {
      return this.$store.state.cart.length
    }
  },
  created () {
    this.products = this.$store.state.cart
  },
  watch: {
    products: {
      handler: function (newProducts) {
        this.totalSum = newProducts.reduce(function (acc, obj) { return acc + Math.round(obj['Final Price']) }, 0)
      }
    }
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
