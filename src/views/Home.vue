<template>
  <section>
    <div>
      <div class="row">
        <div class="col-6">
          <h3 class="font-weight-bold">All</h3>
        </div>
        <div class="col-6 text-right">
          <a href="" class="font-weight-bold">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i> View Cart
          </a>
        </div>
      </div>
      <div class="mt-3">
        <a class="categories-link font-weight-medium" href="" @click.prevent="isShow = !isShow">
          View Categories <i class="arrow" :class="{ 'up': isShow, 'down': !isShow}"></i>
        </a>
      </div>
      <transition name="fade">
        <div class="mt-2" v-if="isShow">
          <a class="mr-3 categories-link-item" href="" v-for="item of categories" :key="item">{{ item }}</a>
        </div>
      </transition>
    </div>
    <div v-if="isLoaded" class="row mx-auto col-12 mt-3 px-0">
      <ProductCard v-for="(item, i) of products" :key="`${item['Lot #']}-${i}`" :product="item" />
    </div>
    <div v-else>
      <Loader class="mt-5" />
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
    isShow: false,
    isLoaded: false,
    products: [],
    categories: ['All', 'Javascript', 'Python']
  }),
  async created () {
    const result = await fetch('https://limitless-mountain-18309.herokuapp.com/all?page=1')
    this.products = await result.json()
    this.isLoaded = true
  }
}
</script>

<style media="screen">
  .font-weight-medium {
    font-weight: 500;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .categories-link {
    text-decoration: none !important;
  }

  .categories-link-item {
    text-decoration: none !important;
    color: rgba(0,0,0,0.4) !important;
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
