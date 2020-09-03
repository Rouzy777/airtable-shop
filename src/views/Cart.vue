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
    <div v-if="cartLength" class="pb-3">
      <div v-for="vendor of vendors" :key="vendor.vendor" class="mt-4">
        <div v-if="vendor.products.length">
          <h2 class="vendor-title text-muted">
            {{ vendor.vendor }}
          </h2>
          <div class="row mx-auto col-12 px-0 mt-3">
            <ProductCard v-for="(item, i) of vendor.products" :key="`${item['lot #']}-${i}`" :productRaw="item" :vendor="vendor.vendor" />
          </div>
        </div>
      </div>
      <div class="w-100 py-3 text-right border-top">
        <p>
          Total:
          <span class="font-weight-bold">${{ totalSum }}</span>
        </p>
        <p v-if="!shipping" class="font-weight-bold text-success">
          <i class="fa fa-truck" aria-hidden="true"></i> FREE SHIPPING
        </p>
        <p v-else>
          <i class="fa fa-truck" aria-hidden="true"></i> Shipping: <span class="font-weight-bold">${{ shipping }}</span>
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
    vendors: []
  }),
  computed: {
    cartLength () {
      let total = 0
      for (const vendor of this.$store.state.cart) {
        total += vendor.products.length
      }
      return total
    },
    totalSum () {
      return this.$store.state.totalSum
    },
    shipping () {
      return this.$store.state.shipping
    }
  },
  created () {
    this.vendors = this.$store.state.cart
    this.$store.commit('calculateSum')
  }
  // watch: {
  //   vendors: {
  //     handler: function (newData) {
  //       let total = 0
  //       this.shipping = 0
  //       for (const item of newData) {
  //         const vendorSum = item.products.reduce(function (acc, obj) { return acc + Math.round(obj['Final Price']) }, 0)
  //         total += vendorSum
  //         if (vendorSum < 100) {
  //           this.shipping += 15
  //         }
  //       }
  //       this.totalSum = total + this.shipping
  //       // this.totalSum = newData.reduce(function (acc, obj) { return acc + Math.round(obj['Final Price']) }, 0)
  //       // if (this.totalSum < 100) {
  //       //   this.shipping = 15
  //       // }
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<style media="screen">
  .font-weight-medium {
    font-weight: 500;
  }

  .link {
    text-decoration: none !important;
  }

  .vendor-title {
    font-size: 24px;
  }
</style>
