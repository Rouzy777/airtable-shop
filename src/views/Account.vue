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
          <div class="col mt-3">
            <small>Email*</small>
            <input type="email" class="form-control" v-model="user.email" required>
          </div>
          <div class="col mt-3">
            <small>Password*</small>
            <input type="password" class="form-control" v-model="user.password" autocomplete="off" required>
          </div>
          <div class="mt-3">
            <small class="text-danger">
              {{ error }}
            </small>
          </div>
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary">Sign In</button>
            <div class="text-muted mt-3">
              <small>OR <router-link to="/signup">SIGN UP</router-link> </small>
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
                <input class="form-control" v-model="user.phone" required>
              </div>
            </div>
            <div class="row mt-lg-3">
              <div class="col-lg mt-lg-0 mt-2">
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
              <div class="col-lg mt-lg-0 mt-2">
                <small>
                  Apartment:
                  <span class="text-muted">old - {{ userInfo.apartment }}</span>
                </small>
                <input class="form-control" v-model="user.apartment">
              </div>
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
              <div class="col-lg-4 mt-lg-0 mt-2">
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
            <div class="mt-4 px-0 col mx-auto row">
              <button type="submit" class="btn btn-success">Save</button>
              <button class="btn btn-secondary ml-2" @click="editMode = false">Back</button>
            </div>
          </form>
        </div>
        <div class="mt-5">
          <h4 id="lastPurchased">Last Purchases</h4>
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
                      <img v-img="{'src': product[1].image, 'title': product[1].product}" class="img-preview rounded" v-lazy="product[1].image" :alt="product[1].product">
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
                    <td data-title="Price" class="numeric">
                      $ {{ product[1].price.toFixed(2) }} CAD
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="lastPurchased.length === pageSize || currentPage > 1" class="text-center">
                <button class="btn mr-2 btn-primary" :disabled="currentPage === 1" @click="prevPage">
                  <i class="fa fa-chevron-circle-left" aria-hidden="true" />
                  Prev
                </button>
                Page {{ currentPage }} of {{ pageQuantity }}
                <button class="btn ml-2 btn-primary" :disabled="currentPage === pageQuantity" @click="nextPage">
                  Next
                  <i class="fa fa-chevron-circle-right" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div v-else class="">
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
import Loader from '@/components/Loader'

export default {
  name: 'SignUp',
  components: {
    Loader,
    ProfileCard
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
      phone: ''
    },
    dateObject: {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    currentPage: 1,
    pageSize: 10,
    isLogged: false,
    userInfo: null,
    lastPurchased: null,
    allLastPurchased: null,
    loading: true,
    editMode: false,
    error: ''
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
      return Math.ceil(this.allLastPurchased.length / this.pageSize)
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
            name: 'Apartment',
            value: this.userInfo.apartment
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
    this.checkAuth()
  },
  methods: {
    async login () {
      try {
        await firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        this.checkAuth()
      } catch (e) {
        this.error = e
      }
    },
    async logout () {
      this.user.email = ''
      this.user.password = ''
      this.userInfo = null
      this.isLogged = false
      await firebase.auth().signOut()
    },
    checkAuth () {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const uid = await this.$store.dispatch('getUserId')
          this.userInfo = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
          this.allLastPurchased = (await firebase.database().ref(`/users/${uid}/products`).once('value')).val()
          if (this.allLastPurchased) {
            this.allLastPurchased = Object.entries(this.allLastPurchased)
            this.allLastPurchased.sort((a, b) => {
              return b[1].date - a[1].date
            })
            this.lastPurchased = this.allLastPurchased.slice(0, this.pageSize)
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
    prevPage () {
      this.currentPage--
      this.lastPurchased = this.allLastPurchased.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    nextPage () {
      this.lastPurchased = this.allLastPurchased.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize)
      this.currentPage++
    },
    regionWords (object) {
      if (this[object].region === 'CA') {
        return ['Province', 'Postal code']
      } else {
        return ['State', 'ZIP code']
      }
    },
    editToggle () {
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
        this.checkAuth()
        this.editMode = false
      } catch (e) {
        console.log(e)
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

  .table thead th {
    font-weight: 500;
    border-top: 0;
    border-bottom: 0;
  }

  .table thead th:nth-child(1) {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .table thead th:nth-child(6) {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  @media only screen and (min-width: 800px) {
    .table tbody tr td {
      border-top: 1px solid #eee;
    }
    .table tbody tr:nth-child(1) td {
      border-top: 0;
    }
  }

  @media only screen and (max-width: 800px) {
    /* Force table to not be like tables anymore */
    .table table,
    .table thead,
    .table tbody,
    .table th,
    .table td,
    .table tr {
      display: block;
    }
    /* Hide table headers (but not display: none;, for accessibility) */
    .table thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    .table td {
      /* Behave  like a "row" */
      border: none;
      position: relative;
      padding-left: 50%;
      white-space: normal;
      text-align: left;
    }
    .table tbody tr td:not(:last-of-type) {
      border-bottom: 1px solid #eee;
    }
    .table tbody tr {
      background-color: white;
      border-radius: 10px;
    }
    .table td:before {
      /* Now like a table header */
      position: absolute;
      /* Top/left values mimic padding */
      left: 15px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      text-align: left;
      font-weight: 500;
    }
    .table td:before {
      content: attr(data-title);
    }
  }
</style>
