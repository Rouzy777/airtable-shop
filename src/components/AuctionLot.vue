<template>
  <tr class="mb-3">
    <td data-title="Image">
      <img v-img="{'src': product[1].image, 'title': product[1].auction}" class="img-preview img-fluid rounded" v-lazy="product[1].image" :alt="product[1].product">
    </td>
    <td data-title="Auction">
      {{ product[1].auction }}
    </td>
    <td data-title="End time">
      {{ new Date(product[1].endTime).toLocaleString() }}
    </td>
    <td data-title="Vendor">
      {{ product[1].vendor.name }}
    </td>
    <td data-title="Price">
      $ {{ product[1].amount.toFixed(2) }} CAD
    </td>
    <td data-title="Status" class="d-flex">
      <div class="pr-1" :class="{'paid': product[1].status === 'Paid', 'not-paid': product[1].status === 'Not paid'}" />
      {{ product[1].status }}
    </td>
    <td :data-title="product[1].status !== 'Paid' ? 'Buy' : ''">
      <div v-if="product[1].status !== 'Paid'">
        <button v-if="!isInCart" class="btn btn-success" @click="addToCart(product)">
          <i class="fa fa-cart-plus" aria-hidden="true" /> Add to cart
        </button>
        <button v-else class="btn btn-danger" @click="removeFromCart(product)">
          <i class="fa fa-cart-arrow-down" aria-hidden="true" /> Remove
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'AuctionLot',
  props: {
    product: {
      type: Array,
      required: true
    }
  },
  computed: {
    productFiltered () {
      return {
        'lot #': this.product[1].auction,
        'final price': this.product[1].amount,
        picture: [
          {
            thumbnails: {
              large: {
                url: this.product[1].image
              }
            }
          }
        ],
        video: this.product[1].video,
        'auction lot': true
      }
    },
    isInCart () {
      const vendorIndex = this.$store.state.cart.findIndex(i => i.vendor.name === this.product[1].vendor.name)
      if (vendorIndex !== -1) {
        return this.$store.state.cart[vendorIndex].products.some(i => JSON.stringify(i) === JSON.stringify(this.productFiltered))
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations({
      add: 'addToCart',
      remove: 'removeFromCart'
    }),
    addToCart () {
      const fullProductData = { ...this.productFiltered, vendor: this.product[1].vendor }
      this.add(fullProductData)
    },
    removeFromCart () {
      const fullProductData = { ...this.productFiltered, vendor: this.product[1].vendor }
      this.remove(fullProductData)
    }
  }
}
</script>
