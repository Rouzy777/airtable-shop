<template>
  <div class="col-lg-3 col-12 pr-lg-4 pr-0 pl-0 mb-4">
    <div class="card h-100 px-0 col-md-12">
      <carousel :per-page="1" :adjustableHeight="videoLink !== false" :minSwipeDistance="50">
        <slide v-if="product.picture">
          <img class="card-img-top" v-lazy="product.picture[0].thumbnails.large.url" alt="Image">
        </slide>
        <slide v-if="product.video">
          <video class="card-img-top" controls>
            <source :src="videoLink" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </slide>
      </carousel>
      <div class="card-body pt-2">
        <h5 class='card-title mt-1 mb-0'>
          {{ product['lot #'] }}
        </h5>
        <p v-if="product['description']" class="card-text text-muted mt-2">
          <span>{{ description }}</span>
          <span v-if="description !== product['description'] && !readAllActive">
            ...
            <a class="text-primary pointer font-weight-medium" @click.prevent="readAll">
              Read all
            </a>
          </span>
          <span v-show="readAllActive">{{ seoDescription }}</span>
        </p>
      </div>
      <div class="card-footer">
        <div class="d-flex">
          <div v-if="product['disc %']" class="d-flex flex-column">
            <span class="badge badge-warning">
              {{ product['disc %'] * 100 }}%
            </span>
            <small class="text-muted mt-1">
              <s> $ {{ product['price'] }} </s>
            </small>
          </div>
          <div class="mt-auto" :class="{'pt-3': !product['disc %'], 'ml-2': product['disc %']}">
            <h5 class="mb-0">$ {{ Math.round(product['final price']) }}</h5>
          </div>
        </div>
        <div class="mt-3">
          <a v-if="!isInCart" class="medium-size text-primary link" href="" @click.prevent="addToCart(product)">
            <i class="fa fa-cart-plus" aria-hidden="true"></i> ADD TO CART
          </a>
          <a v-else class="medium-size text-danger link" href="" @click.prevent="removeFromCart(product)">
            <i class="fa fa-cart-arrow-down" aria-hidden="true"></i> REMOVE
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import { mapMutations } from 'vuex'

export default {
  components: {
    Carousel, Slide
  },
  props: {
    productRaw: {
      type: Object,
      required: true
    },
    vendor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    readAllActive: false,
    description: '',
    seoDescription: ''
  }),
  computed: {
    product () { // make all object keys lowercase
      return Object.fromEntries(
        Object.entries(this.productRaw).map(([k, v]) => [k.toLowerCase(), v])
      )
    },
    videoLink () {
      if (this.product.video && this.product.video.includes('dl=0')) {
        return this.product.video.replace('dl=0', 'raw=1')
      } else {
        return false
      }
    },
    isInCart () {
      const vendorIndex = this.$store.state.cart.findIndex(i => i.vendor.name === this.vendor.name)
      if (vendorIndex !== -1) {
        return this.$store.state.cart[vendorIndex].products.some(i => JSON.stringify(i) === JSON.stringify(this.product))
      } else {
        return false
      }
    }
  },
  created () {
    if (this.product.description) {
      this.description = this.product.description.slice(0, 120)
      this.seoDescription = this.product.description.slice(120, this.product.description.length)
    }
  },
  methods: {
    ...mapMutations({
      add: 'addToCart', // `this.add()` would call `this.$store.commit('addToCart')`
      remove: 'removeFromCart' // `this.remove()` would call `this.$store.commit('removeToCart')`
    }),
    addToCart (product) {
      const fullProductData = { ...product, vendor: this.vendor }
      this.add(fullProductData)
    },
    removeFromCart (product) {
      const fullProductData = { ...product, vendor: this.vendor }
      this.remove(fullProductData)
    },
    readAll () {
      this.readAllActive = true
    }
  }
}
</script>

<style lang="css" scoped>
  .medium-size {
    font-size: 15px;
  }

  .pointer {
    cursor: pointer;
  }
</style>
