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
              <stripe-elements
                ref="elementsRef"
                :pk="publishableKey"
                :amount="totalSum"
                class="col-lg-6 px-0"
                locale="en"
                @token="tokenCreated"
                @loading="loading = $event"
              >
              </stripe-elements>
              <small class="text-muted">You agree to pay <span class="font-weight-bold">${{totalSum}}</span>. Your purchase is handled securely with Stripe. We do not save your credit card information.</small>
              <div class="">
                <button class="btn btn-primary mt-3" @click="submit">PAY WITH CREDIT CARD</button>
              </div>
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
import { StripeElements } from 'vue-stripe-checkout'

export default {
  name: 'Cart',
  components: {
    StripeElements
  },
  data: () => ({
    customer: {
      name: '',
      email: '',
      address1: '',
      address2: ''
    },
    loading: false,
    publishableKey: 'pk_live_lp4AR0OUNJSqh8uMgDJ5gEAe00AR4zcSCx',
    products: [],
    token: null,
    charge: null,
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
  },
  methods: {
    submit () {
      this.$refs.elementsRef.submit()
    },
    tokenCreated (token) {
      this.token = token
      let description = ''
      for (const item of this.products) {
        description += `Product name: ${item['Lot #']}, Price: ${item['Final Price']}; `
      }
      // for additional charge objects go to https://stripe.com/docs/api/charges/object
      this.charge = {
        source: token.id,
        amount: this.totalSum * 100, // the amount you want to charge the customer in cents. $100 is 1000 (it is strongly recommended you use a product id and quantity and get calculate this on the backend to avoid people manipulating the cost)
        description // optional description that will show up on stripe when looking at payments
      }
      this.sendTokenToServer(this.charge)
    },
    sendTokenToServer (charge) {
      // Send to charge to your backend server to be processed
      // Documentation here: https://stripe.com/docs/api/charges/create

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
