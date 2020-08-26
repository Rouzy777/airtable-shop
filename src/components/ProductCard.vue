<template>
  <div class="col-lg-3 col-12 pr-lg-4 pr-0 pl-0 mb-4">
    <div class="card h-100 px-0 col-md-12">
      <carousel :per-page="1" :adjustableHeight="videoLink !== false" :minSwipeDistance="50">
        <slide v-if="product.Picture">
          <img class="card-img-top" v-lazy="product.Picture[0].thumbnails.large.url" alt="Image">
        </slide>
        <slide v-if="product.Video">
          <video class="card-img-top" controls>
            <source :src="videoLink" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </slide>
      </carousel>
      <div class="card-body pt-2">
        <h5 class='card-title mt-1 mb-0'>
          {{ product['Lot #'] }}
        </h5>
        <p class="card-text text-muted mt-2">
          {{ product['Description'] }}
        </p>
      </div>
      <div class="card-footer">
        <div class="d-flex">
          <div v-if="product['Disc %']" class="d-flex flex-column">
            <span class="badge badge-warning">
              {{ product['Disc %'] * 100 }}%
            </span>
            <small class="text-muted mt-1">
              <s> $ {{ product['Price'] }} </s>
            </small>
          </div>
          <div class="mt-auto" :class="{'pt-3': !product['Disc %'], 'ml-2': product['Disc %']}">
            <h5 class="mb-0">$ {{ Math.round(product['Final Price']) }}</h5>
          </div>
        </div>
        <div class="mt-3">
          <a class="medium-size text-primary link" href="" @click.prevent="addToCart(product)">
            <i class="fa fa-cart-plus" aria-hidden="true"></i> ADD TO CART
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
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    videoLink () {
      if (this.product.Video && this.product.Video.includes('dl=0')) {
        return this.product.Video.replace('dl=0', 'raw=1')
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations({
      add: 'addToCart' // `this.add()` would call `this.$store.commit('addToCart')`
    }),
    addToCart (product) {
      this.add(product)
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
