<template>
  <section class="content">
    <div class="floating">
      <FloatingCart />
    </div>
    <div>
      <div class="row">
        <div class="col-6">
          <h3 class="font-weight-bold">{{ selectedCategory.name }}</h3>
        </div>
        <div class="col-6 align-self-center text-right">
          <router-link to="/cart" class="font-weight-bold link">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i> View Cart <span v-if="cartLength">({{ cartLength }})</span>
          </router-link>
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
        <div class="row col-12 px-0 mt-3">
          <div class="col-lg-6">
            <div>
              <a class="link font-weight-medium" href="" @click.prevent="isShowDatesOpen = !isShowDatesOpen">
                Select Show Dates <i class="arrow" :class="{ 'up-arrow': isShowDatesOpen, 'down-arrow': !isShowDatesOpen}"></i>
              </a>
            </div>
            <transition name="fade">
              <div class="mt-2" v-if="isShowDatesOpen">
                <a class="mr-3 categories-link-item" :class="{ 'categories-link-item-active': item === selectedShowDate}" href="" @click.prevent="searchByShowDate(item)" v-for="item of showDates" :key="item">{{ item }}</a>
              </div>
            </transition>
          </div>
          <div class="col-lg-6 text-lg-right mt-lg-0 mt-3">
            <JoinBtn />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoaded" class="row mx-auto col-12 my-3 px-0">
      <ProductCard v-for="(item, i) of products" :key="`${item['Lot #']}-${i}`" :productRaw="item" :vendor="selectedCategory" />
      <div class="col-12 text-center pr-4 pl-0">
        <button v-if="currentPage > 1" @click="changePage('down')" class="btn mr-2 btn-primary">
          <i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
          Prev Page
        </button>
        <button v-if="products.length > 80" @click="changePage('up')" class="btn btn-primary" :class="{'ml-2': this.currentPage > 1}">
          Next Page
          <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
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
import ProductCard from '@/components/ProductCard'
import FloatingCart from '@/components/FloatingCart'
import JoinBtn from '@/components/JoinBtn'
import Loader from '@/components/Loader'
import Footer from '@/components/Footer'

export default {
  name: 'Home',
  metaInfo () {
    return {
      meta: [
        { vmid: 'og:url', property: 'og:url', content: 'https://rouzy777.github.io/airtable-shop/' },
        { vmid: 'og:title', property: 'og:title', content: this.ogConfig.title },
        { vmid: 'og:description', property: 'og:description', content: this.ogConfig.description },
        { vmid: 'og:image', property: 'og:image', content: this.ogConfigImage }
      ]
    }
  },
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
    ogConfig: [],
    ogConfigImage: '',
    products: [],
    selectedShowDate: '',
    selectedCategory: '',
    showDates: [],
    categories: []
  }),
  computed: {
    cartLength () {
      let total = 0
      for (const vendor of this.$store.state.cart) {
        total += vendor.products.length
      }
      return total
    }
  },
  async created () {
    this.getOGConfig()
    await this.getVendors()
    if (this.$route.query.page || this.$route.query.keyword) {
      if (this.$route.query.keyword) {
        this.selectedCategory = this.categories.find(i => i.name === this.$route.query.keyword)
      }
      this.getShowDates(this.selectedCategory)
      if (this.$route.query.date) {
        this.selectedShowDate = this.$route.query.date
      }
      this.currentPage = this.$route.query.page
      this.getProducts({
        page: this.currentPage,
        keyword: this.selectedCategory.name,
        baseid: this.selectedCategory.id,
        date: this.selectedShowDate
      })
    } else {
      const result = await fetch('https://limitless-mountain-18309.herokuapp.com/all')
      this.products = await result.json()
      this.isLoaded = true
    }
  },
  methods: {
    changePage (direction) {
      if (direction === 'up') {
        this.currentPage++
      } else {
        this.currentPage--
      }
      this.$router.push({ query: Object.assign({}, this.$route.query, { page: this.currentPage }) })
      this.getProducts({
        page: this.currentPage,
        keyword: this.selectedCategory.name,
        baseid: this.selectedCategory.id,
        date: this.selectedShowDate
      })
    },
    setShowDate () {
      this.getProducts({
        page: this.currentPage,
        keyword: this.selectedCategory.name,
        baseid: this.selectedCategory.id,
        date: this.selectedShowDate
      })
    },
    searchByCategory (item) {
      if (this.selectedCategory !== item) {
        this.getShowDates(item)
        this.selectedCategory = item
        this.currentPage = 1
        this.selectedShowDate = ''
        this.$router.push({ query: { page: this.currentPage, keyword: item.name } })
        this.getProducts({
          page: this.currentPage,
          keyword: item.name,
          baseid: item.id
        })
      }
    },
    searchByShowDate (item) {
      if (this.selectedShowDate !== item) {
        this.selectedShowDate = item
        this.currentPage = 1
        this.$router.push({ query: { page: this.currentPage, keyword: this.selectedCategory.name, date: item } })
        this.getProducts({
          page: this.currentPage,
          keyword: this.selectedCategory.name,
          baseid: this.selectedCategory.id,
          date: this.selectedShowDate
        })
      }
    },
    async getProducts (query) {
      let queryString = ''
      for (const [key, value] of Object.entries(query)) {
        queryString += `${key}=${value}&`
      }
      this.isLoaded = false
      const result = await fetch(`https://limitless-mountain-18309.herokuapp.com/all?${queryString}`)
      this.products = await result.json()
      this.isLoaded = true
    },
    async getVendors () {
      const result = await fetch('https://limitless-mountain-18309.herokuapp.com/selectViews')
      this.categories = await result.json()
      this.selectedCategory = this.categories[0]
    },
    async getShowDates (vendor) {
      this.showDates = []
      let queryString = ''
      if (vendor) {
        queryString = `vendor=${vendor.id}`
      }
      const result = await fetch(`https://limitless-mountain-18309.herokuapp.com/getShowDates?${queryString}`)
      this.showDates = await result.json()
    },
    async getOGConfig () {
      const result = await fetch('https://limitless-mountain-18309.herokuapp.com/getOGConfig')
      this.ogConfig = (await result.json())[0]
      this.ogConfigImage = this.ogConfig.image[0].url
    }
  }
}
</script>

<style media="screen">
  .font-weight-medium {
    font-weight: 500;
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
