<template>
  <section>
    <div>
      <div class="row">
        <div class="col-sm-4">
          <h3 class="font-weight-bold">
            <i class="fa fa-user-circle-o" aria-hidden="true"></i>
            Account
          </h3>
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
    <div v-if="loading" class="d-flex mt-5 justify-content-center">
      <Loader class="mt-5" />
    </div>
    <div v-else>
      <div v-if="!isLogged" class="d-flex min-vh-80">
        <form
          class="col-lg-5 mx-auto align-self-center bg-light rounded pt-4 pb-4 px-4"
          @submit.prevent="login"
        >
          <div class="text-center">
            <h3 class="font-weight-bold mb-4">Sign In</h3>
          </div>
          <div class="col mt-3 px-0">
            <small>Email*</small>
            <input type="email" class="form-control" v-model="user.email" required>
          </div>
          <div class="col mt-3 px-0">
            <small>Password*</small>
            <input type="password" class="form-control" v-model="user.password" autocomplete="off" required>
          </div>
          <div class="mt-3">
            <small class="text-danger">
              {{ error }}
            </small>
          </div>
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary">
              Sign In
            </button>
            <div class="text-muted mt-3">
              <small>
                OR <router-link to="/signup">SIGN UP</router-link>
              </small>
            </div>
            <div class="text-muted mt-2">
              <small>
                <router-link to="/reset">RESET PASSWORD</router-link>
              </small>
            </div>
            <div class="mt-3 pt-3 border-top">
              <div class="d-flex align-items-center justify-content-center text-light rounded py-1 btn btn-primary" @click="fbSignin">
                <div class="mr-2">
                  <i class="fa fa-facebook-square social-logo" aria-hidden="true" />
                </div>
                <div class="font-weight-medium">
                  Sign In with FB
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div v-else class="bg-light px-4 pt-4 pb-4 mb-lg-4 mt-5 mb-4 rounded">
        <h3>
          Hello, {{ userInfo.first_name }} {{ userInfo.last_name }}!
        </h3>
        <div v-if="!editMode" class="mt-4">
          <div class="mx-auto my-3 px-0">
            <div class="row">
              <ProfileCard
                v-for="card in infoCards"
                :key="card.name"
                :info="card"
              />
            </div>
          </div>
          <div>
            <button class="btn btn-primary" @click="editToggle"><i class="fa fa-pencil" aria-hidden="true" /> Edit Profile</button>
          </div>
        </div>
        <div v-else>
          <small v-if="editMode" class="badge badge-primary">EDIT MODE</small>
          <form @submit.prevent="saveEdited">
            <div class="row mt-4">
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  First Name:
                  <span class="text-muted">old - {{ userInfo.first_name }}</span>
                </small>
                <input class="form-control" v-model="user.fname" required>
              </div>
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  Last Name:
                  <span class="text-muted">old - {{ userInfo.last_name }}</span>
                </small>
                <input class="form-control" v-model="user.lname" required>
              </div>
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  Phone:
                  <span class="text-muted">old - {{ userInfo.phone }}</span>
                </small>
                <input class="form-control" type="number" v-model="user.phone" required>
              </div>
            </div>
            <div class="row mt-lg-3">
              <div class="col-lg-6 mt-lg-0 mt-2">
                <small>
                  Address:
                  <span class="text-muted">old - {{ userInfo.address }}</span>
                </small>
                <input class="form-control" v-model="user.address" required>
              </div>
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  City:
                  <span class="text-muted">old - {{ userInfo.city }}</span>
                </small>
                <input class="form-control" v-model="user.city" required>
              </div>
              <!-- <div class="col-lg mt-lg-0 mt-2">
                <small>
                  Apartment:
                  <span class="text-muted">old - {{ userInfo.apartment }}</span>
                </small>
                <input class="form-control" v-model="user.apartment">
              </div> -->
            </div>
            <div class="row mt-lg-3">
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  {{ regionWords('user')[1] }}:
                  <span class="text-muted">old - {{ userInfo.postal_code }}</span>
                </small>
                <input class="form-control" v-model="user.postal_code" required>
              </div>
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  {{ regionWords('user')[0] }}:
                  <span class="text-muted">old - {{ userInfo.province }}</span>
                </small>
                <input class="form-control" v-model="user.province" required>
              </div>
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  Country/Region:
                  <span class="text-muted">old - {{ userInfo.region }}</span>
                </small>
                <select class="form-control" v-model="user.region">
                  <option value="CA">Canada</option>
                  <option value="US">United States of America</option>
                </select>
              </div>
            </div>
            <div v-if="userOnlyFbCreds" class="mt-lg-3">
              <div class="row">
                <div class="col-lg-4 mt-lg-0 mt-2">
                  <small>
                    Password
                  </small>
                  <input type="password" class="form-control" v-model="user.pass" required>
                </div>
                <div class="col-lg-4 mt-lg-0 mt-2">
                  <small>
                    Confirm Password
                  </small>
                  <input type="password" class="form-control" v-model="user.confirmPass" required>
                </div>
              </div>
              <small v-if="error" class="text-danger">
                {{ error }}
              </small>
            </div>
            <div class="mt-4 px-0 col mx-auto row">
              <button type="submit" class="btn btn-success">Save</button>
              <button class="btn btn-secondary ml-2" @click="editMode = false">Back</button>
            </div>
          </form>
        </div>
        <div class="mt-5">
          <h4>Following Auctions</h4>
          <div class="mt-4">
            <div v-if="followingAuctions">
              <table class="table mb-0">
                <thead class="bg-white rounded">
                  <tr>
                    <th>Preview</th>
                    <th>Auction</th>
                    <th>End time</th>
                    <th>Vendor</th>
                    <th>My bid</th>
                    <th>Winning</th>
                  </tr>
                </thead>
                <tbody>
                  <FollowingAuctionLot v-for="bid of followingAuctions" :key="bid[0]" :bid="bid" />
                </tbody>
              </table>
            </div>
            <div v-else>
              You haven't follow any auction yet. <router-link to="/">Shop</router-link>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <h4>Won Auctions</h4>
          <div class="mt-4">
            <div v-if="lastAuctions">
              <table class="table mb-0">
                <thead class="bg-white rounded">
                  <tr>
                    <th>Preview</th>
                    <th>Auction</th>
                    <th>End time</th>
                    <th>Vendor</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Buy</th>
                  </tr>
                </thead>
                <tbody>
                  <AuctionLot v-for="product of lastAuctions" :key="product[0]" :product="product" />
                </tbody>
              </table>
              <div v-if="lastAuctions.length === pageSize || currentPageAuction > 1" class="text-center mt-2">
                <button class="btn mr-2 btn-primary" :disabled="currentPageAuction === 1" @click="prevPage('currentPageAuction', 'lastAuctions', 'allLastAuctions')">
                  <i class="fa fa-chevron-circle-left" aria-hidden="true" />
                  Prev
                </button>
                Page {{ currentPageAuction }} of {{ pageQuantityAuctions }}
                <button class="btn ml-2 btn-primary" :disabled="currentPageAuction === pageQuantityAuctions" @click="nextPage('currentPageAuction', 'lastAuctions', 'allLastAuctions')">
                  Next
                  <i class="fa fa-chevron-circle-right" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div v-else>
              You haven't won any auctions yet. <router-link to="/">Shop</router-link>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <h4>Last Purchases</h4>
          <div class="mt-4">
            <div v-if="lastPurchased">
              <table class="table mb-0">
                <thead class="bg-white rounded">
                  <tr>
                    <th>Preview</th>
                    <th>Purchase Date</th>
                    <th>Vendor</th>
                    <th>Product</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product of lastPurchased" :key="product[0]" class="mb-3">
                    <td data-title="Image">
                      <img v-img="{'src': product[1].image, 'title': product[1].product}" class="img-preview img-fluid rounded" v-lazy="product[1].image" :alt="product[1].product">
                    </td>
                    <td data-title="Purchase Date">
                      {{ new Date(product[1].date).toLocaleString([], dateObject) }}
                    </td>
                    <td data-title="Vendor">
                      {{ product[1].vendor }}
                    </td>
                    <td data-title="Product">
                      {{ product[1].product }}
                    </td>
                    <td data-title="Price">
                      $ {{ product[1].price.toFixed(2) }} CAD
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="lastPurchased.length === pageSize || currentPage > 1" class="text-center mt-2">
                <button class="btn mr-2 btn-primary" :disabled="currentPage === 1" @click="prevPage('currentPage', 'lastPurchased', 'allLastPurchased')">
                  <i class="fa fa-chevron-circle-left" aria-hidden="true" />
                  Prev
                </button>
                Page {{ currentPage }} of {{ pageQuantity }}
                <button class="btn ml-2 btn-primary" :disabled="currentPage === pageQuantity" @click="nextPage('currentPage', 'lastPurchased', 'allLastPurchased')">
                  Next
                  <i class="fa fa-chevron-circle-right" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div v-else>
              You haven't made any purchases yet. <router-link to="/">Shop</router-link>
            </div>
          </div>
          <div class="row mx-auto mt-4">
            <div class="ml-auto">
              <button class="btn btn-danger" @click="logout"><i class="fa fa-sign-out" aria-hidden="true" /> Log Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import ProfileCard from '@/components/ProfileCard'
import AuctionLot from '@/components/AuctionLot'
import FollowingAuctionLot from '@/components/FollowingAuctionLot'
import Loader from '@/components/Loader'

export default {
  name: 'Account',
  components: {
    Loader,
    ProfileCard,
    FollowingAuctionLot,
    AuctionLot
  },
  data: () => ({
    user: {
      email: '',
      password: '',
      fname: '',
      lname: '',
      address: '',
      city: '',
      region: 'CA',
      province: '',
      postal_code: '',
      apartment: '',
      phone: '',
      pass: '',
      confirmPass: ''
    },
    dateObject: {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    currentPage: 1,
    currentPageAuction: 1,
    pageSize: 10,
    isLogged: false,
    userInfo: null,
    lastPurchased: null,
    allLastPurchased: null,
    followingAuctions: null,
    lastAuctions: null,
    allLastAuctions: null,
    loading: true,
    editMode: false,
    error: '',
    userOnlyFbCreds: false,
    fbCredentials: null
  }),
  computed: {
    cartLength () {
      let total = 0
      for (const vendor of this.$store.state.cart) {
        total += vendor.products.length
      }
      return total
    },
    pageQuantity () {
      if (this.allLastPurchased) {
        return Math.ceil(this.allLastPurchased.length / this.pageSize)
      } else {
        return 0
      }
    },
    pageQuantityAuctions () {
      if (this.allLastAuctions) {
        return Math.ceil(this.allLastAuctions.length / this.pageSize)
      } else {
        return 0
      }
    },
    infoCards () {
      if (this.userInfo) {
        return [
          {
            name: 'Email',
            value: this.userInfo.email
          },
          {
            name: 'Phone',
            value: this.userInfo.phone
          },
          {
            name: 'Address',
            value: this.userInfo.address
          },
          {
            name: 'City',
            value: this.userInfo.city
          },
          {
            name: this.regionWords('userInfo')[1],
            value: this.userInfo.postal_code
          },
          {
            name: this.regionWords('userInfo')[0],
            value: this.userInfo.province
          },
          {
            name: 'Country',
            value: this.userInfo.region
          }
        ]
      } else {
        return []
      }
    }
  },
  created () {
    if (sessionStorage.redirect) {
      firebase.auth().getRedirectResult().then((result) => {
        // The signed-in user info.
        const user = result.user
        if (user) {
          const fbInfo = user.providerData[0]
          const name = fbInfo.displayName.split(' ')
          const uid = user.uid
          firebase.database().ref(`/users/${uid}/info`).once('value', (snapshot) => {
            if (!snapshot.exists()) {
              firebase.database().ref(`/users/${uid}/info`).set({
                first_name: name[0],
                last_name: name[1],
                city: '',
                region: '',
                province: '',
                postal_code: '',
                apartment: '',
                address: '',
                email: fbInfo.email,
                phone: fbInfo.phoneNumber,
                fbUid: fbInfo.uid
              })
            }
          })
        }
      }).catch((error) => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          this.fbCredentials = error.credential
          this.error = `${error} Accounts will be linked.`
        } else if (error.code === 'auth/user-cancelled') {
          this.error = 'To log in with Facebook you need to grant permission to the Indigem app'
        } else {
          throw new Error(error)
        }
      })
      this.checkAuth()
      sessionStorage.removeItem('redirect')
    } else {
      this.checkAuth()
    }
  },
  methods: {
    async login () {
      try {
        this.error = ''
        await firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        this.checkAuth()
      } catch (e) {
        if (e.code === 'auth/wrong-password') {
          this.error = 'Error: Email or password is incorrect'
        } else {
          this.error = e
        }
      }
    },
    fbSignin () {
      const provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithRedirect(provider)
      sessionStorage.redirect = true
    },
    async logout () {
      this.error = ''
      this.user.email = ''
      this.user.password = ''
      this.userInfo = null
      this.isLogged = false
      this.lastPurchased = null
      this.lastAuctions = null
      this.$store.commit('emptyCart')
      await firebase.auth().signOut()
    },
    checkAuth () {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const uid = user.uid
          if (this.fbCredentials) {
            await firebase.auth().currentUser.linkWithCredential(this.fbCredentials)
            const fbUid = (await firebase.auth().currentUser.providerData.find((item) => {
              return item.providerId === 'facebook.com'
            })).uid
            await firebase.database().ref(`/users/${uid}/info`).update({
              fbUid
            })
            this.fbCredentials = null
          }
          firebase.auth().fetchSignInMethodsForEmail(user.email).then((res) => {
            if (!res.includes('password')) {
              this.userOnlyFbCreds = true
            }
          })
          const userData = (await firebase.database().ref(`/users/${uid}`).once('value')).val()
          this.user.password = ''
          this.userInfo = userData.info
          this.followingAuctions = userData.followingAuctions
          this.allLastPurchased = userData.products
          this.allLastAuctions = userData.auctions
          if (this.followingAuctions) {
            this.followingAuctions = Object.entries(this.followingAuctions)
          }
          if (this.allLastPurchased) {
            this.allLastPurchased = Object.entries(this.allLastPurchased)
            this.allLastPurchased.sort((a, b) => {
              return b[1].date - a[1].date
            })
            this.lastPurchased = this.allLastPurchased.slice(0, this.pageSize)
          }
          if (this.allLastAuctions) {
            this.allLastAuctions = Object.entries(this.allLastAuctions)
            this.allLastAuctions.sort((a, b) => {
              return new Date(b[1].endTime) - new Date(a[1].endTime)
            })
            this.lastAuctions = this.allLastAuctions.slice(0, this.pageSize)
          }
          this.isLogged = true
        }
        this.loading = false
      })
    },
    // async prevPage () {
    //   const uid = await this.$store.dispatch('getUserId')
    //   const firstPurchasedItem = this.lastPurchased[0]
    //   this.lastPurchased = (await firebase.database().ref(`/users/${uid}/products`).orderByKey().limitToLast(this.pageSize + 1).endAt(firstPurchasedItem[1].product).once('value')).val()
    //   this.currentPage--
    //   if (this.lastPurchased) {
    //     this.lastPurchased = Object.entries(this.lastPurchased)
    //   }
    // },
    // async nextPage () {
    //   const uid = await this.$store.dispatch('getUserId')
    //   const lastPurchasedItem = this.lastPurchased[this.lastPurchased.length - 1]
    //   this.lastPurchased = (await firebase.database().ref(`/users/${uid}/products`).orderByKey().limitToFirst(this.pageSize + 1).startAt(lastPurchasedItem[1].product).once('value')).val()
    //   this.currentPage++
    //   if (this.lastPurchased) {
    //     this.lastPurchased = Object.entries(this.lastPurchased)
    //   }
    prevPage (page, data, allData) {
      this[page]--
      this[data] = this[allData].slice((this[page] - 1) * this.pageSize, this[page] * this.pageSize)
    },
    nextPage (page, data, allData) {
      this[data] = this[allData].slice(this[page] * this.pageSize, (this[page] + 1) * this.pageSize)
      this[page]++
    },
    regionWords (object) {
      if (this[object].region === 'CA') {
        return ['Province', 'Postal code']
      } else {
        return ['State', 'ZIP code']
      }
    },
    editToggle () {
      this.error = ''
      this.user.pass = ''
      this.user.confirmPass = ''
      this.user.fname = this.userInfo.first_name
      this.user.lname = this.userInfo.last_name
      this.user.address = this.userInfo.address
      this.user.city = this.userInfo.city
      this.user.province = this.userInfo.province
      this.user.region = this.userInfo.region
      this.user.phone = this.userInfo.phone
      this.user.postal_code = this.userInfo.postal_code
      if (this.userInfo.apartment) {
        this.user.apartment = this.userInfo.apartment
      }
      this.editMode = true
    },
    async saveEdited () {
      this.error = ''
      try {
        const uid = await this.$store.dispatch('getUserId')
        await firebase.database().ref(`/users/${uid}/info/`).update({
          first_name: this.user.fname,
          last_name: this.user.lname,
          address: this.user.address,
          phone: this.user.phone,
          city: this.user.city,
          province: this.user.province,
          region: this.user.region,
          postal_code: this.user.postal_code,
          apartment: this.user.apartment
        })
        if (this.userOnlyFbCreds) {
          if (this.user.pass === this.user.confirmPass) {
            const email = firebase.auth().currentUser.email
            const credential = firebase.auth.EmailAuthProvider.credential(email, this.user.pass)
            await firebase.auth().currentUser.linkWithCredential(credential)
            this.userOnlyFbCreds = false
            this.user.pass = ''
            this.user.confirmPass = ''
          } else {
            throw new Error('passwords are not identical.')
          }
        }
        this.checkAuth()
        this.editMode = false
      } catch (e) {
        this.error = e
      }
    }
  }
}
</script>

<style media="screen">
  .min-vh-80 {
    min-height: 80vh;
  }

  .img-preview {
    max-height: 75px;
  }
</style>
