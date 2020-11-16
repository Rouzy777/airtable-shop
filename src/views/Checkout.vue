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
      <div v-if="!isPurchased" class="col-12 mb-3 mt-3 px-0">
        <div v-if="isLogged" class="mb-3">
          <small class="text-muted">Logged As <router-link to="/account">{{ customer.name }}</router-link></small>
        </div>
        <div>
          <small>Name*</small>
          <input
            v-model="customer.name"
            :class="{'border-danger': ($v.customer.name.$dirty && !$v.customer.name.required)}"
            class="col-sm-5 form-control">
        </div>
        <div class="mt-3">
          <small>Email*</small>
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
              <small>Address*</small>
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
              <small>City*</small>
              <input
                v-model="customer.city"
                :class="{'border-danger': ($v.customer.city.$dirty && !$v.customer.city.required)}"
                class="col form-control"
              >
            </div>
            <div class="row mt-3">
              <div class="col-md">
                <small>Country/Region*</small>
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
                  <small>{{ regionWords[0] }}*</small>
                  <input
                    v-model="customer.state"
                    :class="{'border-danger': ($v.customer.state.$dirty && !$v.customer.state.required)}"
                    class="form-control"
                  >
                </div>
                <div class="col-md">
                  <small>{{ regionWords[1] }}*</small>
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
                  @change="cardErrorMsg = ''"
                  @token="tokenCreated"
                  @loading="loading = $event"
                >
                  <template v-slot:card-errors>
                    <div id="card-errors" class="text-danger" role="alert" />
                  </template>
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
                <div v-if="!isLoading" class="text-md-left text-center">
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
import firebase from 'firebase/app'
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
    isLogged: false,
    userInfo: null,
    isLoading: false,
    isPurchased: false,
    publishableKey: 'pk_test_51HIXxmJh065ah3GR1L16eFe1Lgc0Et14Spn4d68RQAPCXlAot15XWpOs92v3OoaPHk5kYP1XP8UYyzg9x4viXzc900q7fSv5r5',
    vendors: [],
    token: null,
    charge: null,
    cardErrorMsg: ''
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
      this.checkAuth()
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
    checkAuth () {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const uid = await this.$store.dispatch('getUserId')
          this.userInfo = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
          this.customer.name = `${this.userInfo.first_name} ${this.userInfo.last_name}`
          this.customer.email = this.userInfo.email
          this.customer.address1 = this.userInfo.address
          this.customer.city = this.userInfo.city
          this.customer.state = this.userInfo.province
          this.customer.region = this.userInfo.region
          this.customer.phone = this.userInfo.phone
          this.customer.postal_code = this.userInfo.postal_code
          if (this.userInfo.apartment) {
            this.customer.address2 = this.userInfo.apartment
          }
          this.isLogged = true
        }
      })
    },
    submit () {
      if (this.$v.$invalid) { // validation
        this.$v.$touch()
        return
      }
      const displayError = document.getElementById('card-errors')
      displayError.textContent = ''
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
    async sendTokenToServer (charge) {
      // Send to charge to your backend server to be processed
      // Documentation here: https://stripe.com/docs/api/charges/create
      this.isLoading = true
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        const request = await fetch('/payment', {
          method: 'POST',
          headers,
          body: JSON.stringify(charge)
        })
        if (request.ok) {
          this.isLoading = false
          this.isPurchased = true
          // just for dev
          // this.setBuyerName({
          //   products: this.vendors,
          //   buyerName: this.customer.name
          // })
          if (this.isLogged) {
            const date = Number(Date.now())
            for (const vendor of this.vendors) {
              if (vendor.products.length) { // set bought products to database
                for (const item of vendor.products) {
                  (async () => {
                    const uid = await this.$store.dispatch('getUserId')
                    let image = null
                    if (item.picture.length) {
                      image = item.picture[0].thumbnails.large.url
                    }
                    if (item['auction lot']) {
                      firebase.database().ref(`/users/${uid}/auctions/${item['lot #']}`).update({
                        status: 'Paid'
                      })
                    }
                    await firebase.database().ref(`/users/${uid}/products/${item['lot #']}`).set({
                      image,
                      date,
                      vendor: vendor.vendor.name,
                      product: item['lot #'],
                      price: item['final price']
                    })
                  })()
                }
              }
            }
          }
          this.$store.commit('emptyCart')
        } else {
          throw request
        }
      } catch (e) {
        const error = await e.text()
        const displayError = document.getElementById('card-errors')
        displayError.textContent = error
        this.isLoading = false
      }
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
