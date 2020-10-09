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
      <div v-for="vendor of vendors" :key="vendor.vendor.name" class="mt-4">
        <div v-if="vendor.products.length">
          <h2 class="vendor-title text-muted">
            {{ vendor.vendor.name }}
          </h2>
          <div class="row mt-3">
            <ProductCard
              v-for="(item, i) of vendor.products"
              :key="`${item['lot #']}-${i}`"
              :productRaw="item"
              :vendor="vendor.vendor"
            />
          </div>
        </div>
      </div>
      <div class="w-100 py-3 text-right border-top">
        <div v-if="shipping" class="col-lg-6 px-0 mb-3 ml-auto">
          <small class="text-muted">Free Shipping Code</small>
          <div class="input-group free-shipping-code ml-auto">
            <input v-model="code" class="form-control">
            <div class="input-group-append">
              <button class="btn btn-primary" @click="checkShippingCode(code)">OK</button>
            </div>
          </div>
          <small v-if="errorCodeMessage" class="text-danger">
            {{ errorCodeMessage }}
          </small>
        </div>
        <p v-if="!shipping" class="font-weight-bold text-success">
          <i class="fa fa-truck" aria-hidden="true"></i> FREE SHIPPING
        </p>
        <p v-else>
          <i class="fa fa-truck" aria-hidden="true"></i> Shipping: <span class="font-weight-bold">${{ shipping }} CAD</span>
        </p>
        <p>
          Total:
          <span class="font-weight-bold">${{ totalSum }} CAD</span>
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
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'Cart',
  components: {
    ProductCard
  },
  data: () => ({
    vendors: [],
    code: ''
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
      return this.$store.state.totalSum.toFixed(2)
    },
    shipping () {
      return this.$store.state.shipping
    },
    errorCodeMessage () {
      return this.$store.state.errorCodeMessage
    }
  },
  created () {
    this.vendors = this.$store.state.cart
    this.calculateSum()
    if (sessionStorage.code) {
      this.checkShippingCode(sessionStorage.code)
    }
  },
  methods: {
    ...mapMutations([
      'calculateSum'
    ]),
    ...mapActions([
      'checkShippingCode'
    ])
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

  .free-shipping-code {
    width: 150px;
  }
</style>
