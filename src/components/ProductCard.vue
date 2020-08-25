<template>
  <div class="col-lg-3 col-12 pr-lg-4 pr-0 pl-0 mb-4">
    <div class="card h-100 px-0 col-md-12">
      <img class="card-img-top" v-lazy="product.Picture[0].thumbnails.large.url" alt="Image">
      <div class="card-body pt-2">
        <h5 class='card-title mt-1 mb-0'>
          {{ product['Lot #'] }}
        </h5>
        <!-- <small class="text-muted">
          {{ product['Show Date'] }}
        </small> -->
        <p class="card-text text-muted mt-2">
          {{ product['Description'] }}
        </p>
      </div>
      <div class="card-footer">
        <h5>
          $ {{ product['Price'] }}
        </h5>
        <div class="mt-3">
          <a class="add-to-cart text-primary" href="" @click.prevent="addToCart(product)">
            <i class="fa fa-cart-plus" aria-hidden="true"></i> ADD TO CART
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    addToCart (product) {
    }
  }
}
</script>

<style lang="css" scoped>
  .add-to-cart {
    font-size: 15px;
  }
</style>
