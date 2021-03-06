<template>
  <section class="content">
    <div v-if="!isAuctionActive" class="floating">
      <FloatingCart />
    </div>
    <div>
      <div class="row">
        <div class="col-lg-6">
          <h1 class="title font-weight-bold">indiGem LIVE Sales</h1>
          <h2 class="subtitle font-weight-bold">{{ selectedCategory.name }}</h2>
        </div>
        <div class="col-lg-6 align-self-center text-lg-right">
          <div>
            <router-link to="/cart" class="font-weight-bold link">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i> View Cart <span v-if="cartLength">({{ cartLength }})</span>
            </router-link>
          </div>
          <div class="mt-2">
            <router-link to="/account" class="font-weight-bold link">
              <i class="fa fa-user-circle-o" aria-hidden="true"></i> Account
            </router-link>
          </div>
        </div>
      </div>
      <div class="mx-auto row mt-3">
        <div class="col-12 px-0">
          <div>
            <a class="link font-weight-medium" href="" @click.prevent="isCategoriesShow = !isCategoriesShow">
              Select Vendor <i class="arrow" :class="{ 'up-arrow': isCategoriesShow, 'down-arrow': !isCategoriesShow}"></i>
            </a>
          </div>
          <transition name="fade">
            <div class="mt-2" v-if="isCategoriesShow">
              <a class="mr-3 categories-link-item" :class="{ 'categories-link-item-active': item.name === selectedCategory.name}" href="" @click.prevent="searchByCategory(item)" v-for="item of categories" :key="item.name">{{ item.name }}</a>
            </div>
          </transition>
        </div>
        <div class="row mx-auto col-12 px-0 mt-3">
          <div class="col-lg-6 px-0">
            <div>
              <a class="link font-weight-medium" href="" @click.prevent="isShowDatesOpen = !isShowDatesOpen">
                Select Show Date <i class="arrow" :class="{ 'up-arrow': isShowDatesOpen, 'down-arrow': !isShowDatesOpen}"></i>
              </a>
            </div>
            <transition name="fade">
              <div class="mt-2" v-if="isShowDatesOpen">
                <a class="mr-3 categories-link-item" :class="{ 'categories-link-item-active': item === selectedShowDate}" href="" @click.prevent="searchByShowDate(item)" v-for="item of showDates" :key="item">{{ item }}</a>
              </div>
            </transition>
          </div>
          <div class="col-lg-6 px-0 text-lg-right mt-lg-0 mt-3">
            <JoinBtn />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoaded" class="row mx-auto col-12 my-3 px-0">
      <div class="row">
        <ProductCard
          v-for="(item, i) of products"
          :key="`${item['Lot #']}-${i}`"
          :productRaw="item"
          :user="userInfo"
          :vendor="selectedCategory"
        />
      </div>
      <div class="col-12 text-center pr-4 pl-0">
        <button v-if="currentPage > 1" @click="changePage('down')" class="btn mr-2 btn-primary">
          <i class="fa fa-chevron-circle-left" aria-hidden="true" />
          Prev Page
        </button>
        <button v-if="products.length > 80" @click="changePage('up')" class="btn btn-primary" :class="{'ml-2': this.currentPage > 1}">
          Next Page
          <i class="fa fa-chevron-circle-right" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div class="min-vh-80" v-else>
      <Loader class="mt-5 justify-content-center" />
    </div>
    <Footer />
  </section>
</template>

<script>
import firebase from 'firebase/app'
import ProductCard from '@/components/ProductCard'
import FloatingCart from '@/components/FloatingCart'
import JoinBtn from '@/components/JoinBtn'
import Loader from '@/components/Loader'
import Footer from '@/components/Footer'

export default {
  name: 'Home',
  components: {
    ProductCard,
    FloatingCart,
    Loader,
    JoinBtn,
    Footer
  },
  data: () => ({
    isCategoriesShow: false,
    isShowDatesOpen: false,
    isLoaded: false,
    currentPage: 1,
    selectedShowDate: '',
    selectedCategory: '',
    showDates: [],
    categories: [],
    products: [],
    userInfo: {}
  }),
  computed: {
    cartLength () {
      let total = 0
      for (const vendor of this.$store.state.cart) {
        total += vendor.products.length
      }
      return total
    },
    isAuctionActive () {
      return this.$store.state.isModalActive
    }
  },
  async created () {
    this.getUserInfo()
    await this.getVendors()
    this.currentPage = this.$route.query.page || 1
    if (this.$route.params.vendor || this.$route.query.date) {
      const vendorWithSpaces = this.$route.params.vendor.replace(/_/g, ' ').replace(/amp;/g, '').toLowerCase()
      this.selectedCategory = this.categories.find(i => i.name.toLowerCase() === vendorWithSpaces)
      this.getShowDates(this.selectedCategory)
      if (this.$route.query.date) {
        this.selectedShowDate = this.$route.query.date
      }
      this.getProducts({
        page: this.currentPage,
        baseid: this.selectedCategory.id,
        date: this.selectedShowDate
      })
    } else {
      this.getShowDates(this.selectedCategory)
      this.getProducts({
        page: this.currentPage,
        baseid: this.selectedCategory.id
      })
    }
  },
  methods: {
    getUserInfo () {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const uid = user.uid
          this.userInfo = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
        }
      })
    },
    changePage (direction) {
      if (direction === 'up') {
        this.currentPage++
      } else {
        this.currentPage--
      }
      this.$router.push({ query: Object.assign({}, this.$route.query, { page: this.currentPage }) })
      this.getProducts({
        page: this.currentPage,
        baseid: this.selectedCategory.id,
        date: this.selectedShowDate
      })
    },
    setShowDate () {
      this.getProducts({
        page: this.currentPage,
        baseid: this.selectedCategory.id,
        date: this.selectedShowDate
      })
    },
    searchByCategory (item) {
      if (this.selectedCategory !== item) {
        const nameForUrl = item.name.replace(/ /g, '_').toLowerCase()
        this.getShowDates(item)
        this.selectedCategory = item
        this.currentPage = 1
        this.selectedShowDate = ''
        this.$router.push({ name: 'Vendor', params: { vendor: nameForUrl } })
        // for query vendors in route:
        // this.$router.push({ query: { keyword: item.name } })
        this.getProducts({
          page: this.currentPage,
          baseid: item.id
        })
      }
    },
    searchByShowDate (item) {
      if (this.selectedShowDate !== item) {
        this.selectedShowDate = item
        this.currentPage = 1
        this.$router.push({ query: { date: item } })
        this.getProducts({
          page: this.currentPage,
          baseid: this.selectedCategory.id,
          date: this.selectedShowDate
        })
      }
    },
    async getProducts (query) {
      // let queryString = ''
      // for (const [key, value] of Object.entries(query)) {
      //   queryString += `${key}=${value}&`
      // }
      this.isLoaded = false
      // FOR PRODUCTION
      // const result = await fetch(`https://indigem.ca/all?${queryString}`)
      // FOR TESTING
      const result = await fetch('/all')
      this.products = await result.json()
      this.isLoaded = true
    },
    async getVendors () {
      const result = await fetch('https://indigem.ca/selectViews')
      this.categories = await result.json()
      this.selectedCategory = this.categories[0]
    },
    async getShowDates (vendor) {
      this.showDates = []
      let queryString = ''
      if (vendor) {
        queryString = `vendor=${vendor.id}`
      }
      const result = await fetch(`https://indigem.ca/getShowDates?${queryString}`)
      this.showDates = await result.json()
    }
  }
}
</script>

<style media="screen">
  .font-weight-medium {
    font-weight: 500;
  }

  .title {
    font-size: 30px;
  }

  .subtitle {
    font-size: 28px;
  }

  .floating {
    z-index: 9999;
    position: fixed;
    bottom: 20px;
    right: 20px;
    visibility: hidden;
  }

  @media screen and (max-width: 992px) {
    .floating {
      visibility: visible;
    }
  }

  .min-vh-80 {
    min-height: 80vh;
  }

  .link {
    text-decoration: none !important;
  }

  .categories-link-item {
    text-decoration: none !important;
    color: rgba(0,0,0,0.4) !important;
  }

  .categories-link-item-active {
    color: black !important;
  }

  .arrow {
    border: solid;
    border-width: 0 2px 2px 0;
    display: inline-block;
    margin-left: 2px;
    padding: 3px;
  }

  .down-arrow {
    margin-bottom: 3px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }

  .up-arrow {
    margin-top: 5px;
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
  }
</style>
