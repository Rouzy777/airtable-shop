<template>
  <section>
    <div>
      <div class="row">
        <div class="col-sm-4">
          <h3 class="font-weight-bold">Checkout</h3>
        </div>
        <div class="col-sm-4 align-self-center text-sm-center">
          <router-link to="/cart" class="font-weight-bold link">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i> View cart <span v-if="cartLength">({{ cartLength }})</span>
          </router-link>
        </div>
        <div class="col-sm-4 align-self-center text-sm-right mt-sm-0 mt-2">
          <router-link to="/" class="font-weight-bold link">
            <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Return to List
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-12 mb-3 mt-5 px-0">
      <div>
        <small>Name</small>
        <input v-model="customer.name" class="col-sm-5 form-control">
      </div>
      <div class="mt-3">
        <small>Email</small>
        <input v-model="customer.email" class="col-sm-5 form-control">
      </div>
      <div class="mt-3">
        <span class="text-muted">Shipping Address</span>
        <div class="border rounded p-3">
          <div>
            <small>Address</small>
            <input v-model="customer.address1" class="col form-control">
            <input v-model="customer.address2" class="col mt-2 form-control">
          </div>
          <div class="row mt-3">
            <div class="col-md-3 pl-md--0">
              <small>City</small>
              <input v-model="customer.city" class="form-control">
            </div>
            <div class="col-md-2">
              <small>State</small>
              <input v-model="customer.state" class="form-control">
            </div>
            <div class="col-md-3">
              <small>Zip</small>
              <input v-model="customer.zip" class="form-control">
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <span class="text-muted">Credit Card Information</span>
        <div class="border rounded p-3">
          <div class="row mt-3">
            <div class="col">
              <input class="form-control">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="cartLength" class="row mx-auto col-12 my-3 px-0">
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
    </div> -->
  </section>
</template>

<script>
export default {
  name: 'Cart',
  data: () => ({
    customer: {
      name: '',
      email: '',
      address1: '',
      address2: ''
    },
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
    this.totalSum = this.products.reduce(function (acc, obj) { return acc + Math.round(obj['Final Price']) }, 0)
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
