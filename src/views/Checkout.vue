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
    <transition name="fade">
      <div v-if="!isPurchased" class="col-12 mb-3 mt-5 px-0">
        <div>
          <small>Name</small>
          <input
            v-model="customer.name"
            :class="{'border-danger': ($v.customer.name.$dirty && !$v.customer.name.required)}"
            class="col-sm-5 form-control">
        </div>
        <div class="mt-3">
          <small>Email</small>
          <input
            v-model="customer.email"
            :class="{'border-danger': ($v.customer.email.$dirty && !$v.customer.email.required) || ($v.customer.email.$dirty && !$v.customer.email.email)}"
            class="col-sm-5 form-control"
          >
        </div>
        <div class="mt-3">
          <span class="text-muted">Shipping Address</span>
          <div class="border rounded p-3">
            <div>
              <small>Address</small>
              <input
                v-model="customer.address1"
                :class="{'border-danger': ($v.customer.address1.$dirty && !$v.customer.address1.required)}"
                class="col form-control"
              >
              <input
                v-model="customer.address2"
                class="col mt-2 form-control"
              >
            </div>
            <div class="row mt-3">
              <div class="col-md-3 pl-md--0">
                <small>City</small>
                <input
                  v-model="customer.city"
                  :class="{'border-danger': ($v.customer.city.$dirty && !$v.customer.city.required)}"
                  class="form-control"
                >
              </div>
              <div class="col-md-2">
                <small>State</small>
                <input
                  v-model="customer.state"
                  :class="{'border-danger': ($v.customer.state.$dirty && !$v.customer.state.required)}"
                  class="form-control"
                >
              </div>
              <div class="col-md-3">
                <small>Zip</small>
                <input
                  v-model="customer.postal_code"
                  :class="{'border-danger': ($v.customer.postal_code.$dirty && !$v.customer.postal_code.required)}"
                  class="form-control"
                >
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
                <div v-if="!isLoading" class="">
                  <button class="btn btn-primary mt-3" @click="submit">PAY WITH CREDIT CARD</button>
                </div>
                <Loader v-else class="mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 text-center" v-else>
        <img class="checkmark" src="https://img.icons8.com/fluent/500/000000/checkmark.png"/>
        <p class="text-muted">Thank you for your purchase!</p>
      </div>
    </transition>
  </section>
</template>

<script>
import Loader from '@/components/Loader'
import { StripeElements } from 'vue-stripe-checkout'
import { email, required } from 'vuelidate/lib/validators'

export default {
  name: 'Cart',
  components: {
    StripeElements, Loader
  },
  data: () => ({
    customer: {
      name: '',
      email: '',
      address1: '',
      city: '',
      state: '',
      postal_code: '',
      address2: ''
    },
    isLoading: false,
    isPurchased: false,
    publishableKey: 'pk_test_51HIXxmJh065ah3GR1L16eFe1Lgc0Et14Spn4d68RQAPCXlAot15XWpOs92v3OoaPHk5kYP1XP8UYyzg9x4viXzc900q7fSv5r5',
    vendors: [],
    token: null,
    charge: null
  }),
  validations: {
    customer: {
      name: {
        required
      },
      email: {
        email, required
      },
      address1: {
        required
      },
      city: {
        required
      },
      state: {
        required
      },
      postal_code: {
        required
      }
    }
  },
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
    if (this.cartLength) {
      this.vendors = this.$store.state.cart
      this.$store.commit('calculateSum')
    } else {
      this.isPurchased = true
    }
  },
  methods: {
    submit () {
      if (this.$v.$invalid) { // validation
        this.$v.$touch()
        return
      }
      this.$refs.elementsRef.submit()
    },
    tokenCreated (token) {
      this.token = token
      let description = ''
      for (const vendor of this.vendors) {
        if (vendor.products.length) {
          description += `Vendor: ${vendor.vendor}, `
          for (const item of vendor.products) {
            description += `Product: ${item['Lot #']}, Price: $${item['Final Price']}; `
          }
        }
      }
      description += `Shipping Cost: $${this.shipping}`
      this.charge = {
        source: token.id,
        receipt_email: this.customer.email,
        name: this.customer.name,
        amount: this.totalSum * 100, // the amount you want to charge the customer in cents. $100 is 1000 (it is strongly recommended you use a product id and quantity and get calculate this on the backend to avoid people manipulating the cost)
        description, // optional description that will show up on stripe when looking at payments
        shipping: {
          name: this.customer.name,
          line1: this.customer.address1,
          city: this.customer.city,
          postal_code: this.customer.postal_code,
          line2: this.customer.address2,
          state: this.customer.state
        }
      }
      this.sendTokenToServer(this.charge)
    },
    sendTokenToServer (charge) {
      // Send to charge to your backend server to be processed
      // Documentation here: https://stripe.com/docs/api/charges/create
      this.isLoading = true
      const headers = {
        'Content-Type': 'application/json'
      }

      fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers,
        body: JSON.stringify(charge)
      }).then(response => {
        if (response.status === 200) {
          this.isLoading = false
          this.isPurchased = true
          this.$store.commit('emptyCart')
        }
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style media="screen">
  .font-weight-medium {
    font-weight: 500;
  }

  .checkmark {
    width: 250px;
    height: 250px;
  }

  .link {
    text-decoration: none !important;
  }
</style>
