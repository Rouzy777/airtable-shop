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
                class="col mb-2 form-control"
              >
              <small>Apartment, suite, etc. (optional)</small>
              <input
                v-model="customer.address2"
                class="col mb-2 form-control"
              >
              <small>City</small>
              <input
                v-model="customer.city"
                :class="{'border-danger': ($v.customer.city.$dirty && !$v.customer.city.required)}"
                class="col form-control"
              >
            </div>
            <div class="row mt-3">
              <div class="col-md">
                <small>Country/Region</small>
                <select
                  v-model="customer.region"
                  :class="{'border-danger': ($v.customer.region.$dirty && !$v.customer.region.required)}"
                  class="form-control"
                >
                  <option value="CA">Canada</option>
                  <option value="US">United States of America</option>
                </select>
              </div>
              <div class="col-md-8 px-0 mx-auto row">
                <div class="col-md">
                  <small>{{ regionWords[0] }}</small>
                  <input
                    v-model="customer.state"
                    :class="{'border-danger': ($v.customer.state.$dirty && !$v.customer.state.required)}"
                    class="form-control"
                  >
                </div>
                <div class="col-md">
                  <small>{{ regionWords[1] }}</small>
                  <input
                    v-model="customer.postal_code"
                    :class="{'border-danger': ($v.customer.postal_code.$dirty && !$v.customer.postal_code.required)}"
                    class="form-control"
                  >
                </div>
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
                <div class="payment-info text-muted">
                  <span>You agree to pay: </span>
                  <ul class="mt-1">
                    <li>
                      Subtotal: <span class="font-weight-bold">${{ subtotal }}</span>
                    </li>
                    <li v-if="shipping">
                      Shipping: <span class="font-weight-bold">${{ shipping }}</span>
                    </li>
                    <li v-if="customer.region === 'CA'">
                      5% GST: <span class="font-weight-bold">${{ gst }}</span>
                    </li>
                    <li class="mt-2">
                      Total: <span class="font-weight-bold">CAD ${{ totalSum }}</span>
                    </li>
                  </ul>
                  <span>Your purchase is handled securely with Stripe. We do not save your credit card information.</span>
                </div>
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
import { mapActions } from 'vuex'

export default {
  name: 'Checkout',
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
      region: 'CA',
      postal_code: '',
      address2: ''
    },
    isLoading: false,
    isPurchased: false,
    publishableKey: 'pk_live_lp4AR0OUNJSqh8uMgDJ5gEAe00AR4zcSCx',
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
      region: {
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
    regionWords () {
      if (this.customer.region === 'CA') {
        return ['Province', 'Postal code']
      } else {
        return ['State', 'ZIP code']
      }
    },
    totalSumWithoutGst () {
      return this.$store.state.totalSum
    },
    subtotal () {
      return (this.totalSumWithoutGst - this.shipping).toFixed(2)
    },
    shipping () {
      return this.$store.state.shipping.toFixed(2)
    },
    code () {
      return this.$store.state.code
    },
    gst () {
      return ((this.subtotal / 100) * 5).toFixed(2)
    },
    totalSum () {
      if (this.customer.region === 'CA') {
        return +(Number(this.totalSumWithoutGst) + Number(this.gst)).toFixed(2)
      } else {
        return +(Number(this.totalSumWithoutGst)).toFixed(2)
      }
    }
  },
  created () {
    if (this.cartLength) {
      this.vendors = this.$store.state.cart
      this.$store.commit('calculateSum')
      if (sessionStorage.code) {
        this.checkShippingCode(sessionStorage.code)
      }
    } else {
      this.isPurchased = true
    }
  },
  methods: {
    ...mapActions([
      'checkShippingCode',
      'activateShippingCode',
      'setBuyerName'
    ]),
    submit () {
      if (this.$v.$invalid) { // validation
        this.$v.$touch()
        return
      }
      this.$refs.elementsRef.submit()
    },
    async tokenCreated (token) {
      this.token = token
      let description = ''
      for (const vendor of this.vendors) {
        if (vendor.products.length) {
          description += `Vendor: ${vendor.vendor.name}, `
          for (const item of vendor.products) {
            description += `Product: ${item['lot #']}, Price: $${item['final price']}; `
          }
        }
      }
      description += `Shipping Cost: $${this.shipping}; `
      if (this.customer.region === 'CA') {
        description += `5% GST: $${this.gst}`
      }
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
          country: this.customer.region,
          postal_code: this.customer.postal_code,
          line2: this.customer.address2,
          state: this.customer.state
        }
      }
      const isAlreadyBought = await this.checkAlreadyBought(this.vendors)
      if (isAlreadyBought === 'OK') {
        this.sendTokenToServer(this.charge)
      }
    },
    sendTokenToServer (charge) {
      // Send to charge to your backend server to be processed
      // Documentation here: https://stripe.com/docs/api/charges/create
      this.isLoading = true
      const headers = {
        'Content-Type': 'application/json'
      }

      fetch('https://indigem.ca/payment', {
        method: 'POST',
        headers,
        body: JSON.stringify(charge)
      }).then(response => {
        if (response.status === 200) {
          this.isLoading = false
          this.isPurchased = true
          this.setBuyerName({
            products: this.vendors,
            buyerName: this.customer.name
          })
          // this.activateShippingCode()
          this.$store.commit('emptyCart')
        }
      }).catch(e => {
        console.log(e)
      })
    },
    async checkAlreadyBought (vendors) {
      this.isLoading = true
      const headers = {
        'Content-Type': 'application/json'
      }
      const request = await fetch('https://indigem.ca/checkAlreadyBought', {
        method: 'POST',
        headers,
        body: JSON.stringify(vendors)
      })
      const result = await request.json()
      if (result) {
        this.isLoading = false
        const alreadyBoughtProducts = []
        for (const product of result) {
          if (product.buyerName) {
            alreadyBoughtProducts.push(product)
          }
        }
        if (!alreadyBoughtProducts.length) {
          return 'OK'
        } else {
          const products = []
          for (const product of alreadyBoughtProducts) {
            products.push(product.name)
          }
          alert(`Sorry, but ${products.join(', ')} has already been purchased`)
        }
      }
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

  .payment-info {
    font-size: 13px;
  }

  .payment-info ul {
    list-style-type: none;
    margin-left: -20px;
  }
</style>
