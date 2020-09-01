<template>
  <section>
    <div>
      <div class="row">
        <div class="col-6">
          <h3 class="font-weight-bold">{{ selectedCategory }}</h3>
        </div>
        <div class="col-6 align-self-center text-right">
          <router-link to="/cart" class="font-weight-bold link">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i> View Cart <span v-if="cartLength">({{ cartLength }})</span>
          </router-link>
        </div>
      </div>
      <div class="mt-3">
        <a class="link font-weight-medium" href="" @click.prevent="isCategoriesShow = !isCategoriesShow">
          View Categories <i class="arrow" :class="{ 'up': isCategoriesShow, 'down': !isCategoriesShow}"></i>
        </a>
      </div>
      <transition name="fade">
        <div class="mt-2" v-if="isCategoriesShow">
          <a class="mr-3 categories-link-item" :class="{ 'categories-link-item-active': item === selectedCategory}" href="" @click.prevent="searchByCategory(item)" v-for="item of categories" :key="item">{{ item }}</a>
        </div>
      </transition>
    </div>
    <div v-if="isLoaded" class="row mx-auto col-12 my-3 px-0">
      <ProductCard v-for="(item, i) of products" :key="`${item['Lot #']}-${i}`" :product="item" :vendor="selectedCategory" />
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
    <div v-else>
      <Loader class="mt-5 justify-content-center" />
    </div>
  </section>
</template>

<script>
import ProductCard from '@/components/ProductCard'
import Loader from '@/components/Loader'

export default {
  name: 'Home',
  components: {
    ProductCard, Loader
  },
  data: () => ({
    isCategoriesShow: false,
    isLoaded: false,
    currentPage: 1,
    products: [],
    selectedCategory: '',
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
    await this.getCategories()
    if (this.$route.query.page || this.$route.query.keyword) {
      if (this.$route.query.keyword) {
        this.selectedCategory = this.$route.query.keyword
      }
      this.currentPage = this.$route.query.page
      this.getProducts(this.$route.query)
    } else {
      const result = await fetch(`https://limitless-mountain-18309.herokuapp.com/all?page=${this.currentPage}&keyword=${this.categories[0]}`)
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
      this.getProducts(this.$route.query)
    },
    searchByCategory (item) {
      if (this.selectedCategory !== item) {
        this.selectedCategory = item
        this.currentPage = 1
        this.$router.push({ query: { page: this.currentPage, keyword: item } })
        this.getProducts(this.$route.query)
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
    async getCategories () {
      const result = await fetch('https://limitless-mountain-18309.herokuapp.com/selectViews')
      this.categories = await result.json()
      this.selectedCategory = this.categories[0]
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

  .down {
    margin-bottom: 3px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }

  .up {
    margin-top: 5px;
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
  }
</style>
