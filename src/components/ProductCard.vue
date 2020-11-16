<template>
  <div class="col-lg-3 col-12 mb-4">
    <div class="card h-100 px-0 col-md-12">
      <carousel v-model="activeSlide" :per-page="1" :adjustableHeight="videoLink !== false" :minSwipeDistance="50">
        <slide v-if="product.picture">
          <img class="card-img-top" v-img="{'src': product.picture[0].thumbnails.large.url, 'title': product['lot #']}" v-lazy="product.picture[0].thumbnails.large.url" :alt="product['lot #']">
        </slide>
        <slide v-if="product.video">
          <video class="card-img-top video" controls>
            <template v-if="activeSlide === videoPosition">
              <source :src="videoLink" type="video/mp4">
              Your browser does not support the video tag.
            </template>
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
            <a class="text-primary pointer font-weight-medium" @click.prevent="readAllActive = true">
              Read all
            </a>
          </span>
          <span v-show="readAllActive">{{ seoDescription }} </span>
          <a v-if="readAllActive" class="text-primary pointer font-weight-medium" @click.prevent="readAllActive = false">
            Collapse
          </a>
        </p>
      </div>
      <div class="card-footer">
        <div v-if="product['serverlot']">
          <small class="font-weight-medium badge badge-primary">
            Live Lot
          </small>
          <small class="d-block mt-1">
            Expiration date {{ new Date(product['expiration']).toLocaleString() }}
          </small>
        </div>
        <div v-if="product['auction lot'] === 'Yes'">
          <small class="font-weight-medium badge badge-success">
            Auction Lot
          </small>
          <small class="d-block mt-1">
            <span v-if="isAuctionEnded">
              Current Bid:
            </span>
            <span v-else>
              Auction ended with price:
            </span>
          </small>
          <h5 class="auction-price mt-1">
            $ {{ product['auction price'].toFixed(2) }}
          </h5>
          <div v-if="isAuctionEnded" class="mt-3">
            <button class="btn btn-primary" data-toggle="modal" :data-target="`#auction-${product['lot #']}`" @click="auctionOpen">
              Join Auction
            </button>
          </div>
        </div>
        <div v-else>
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
              <h5 class="mb-0">$ {{ product['final price'].toFixed(2) }}</h5>
            </div>
          </div>
          <div class="mt-3">
            <a v-if="!isInCart" class="medium-size text-primary link" href="" @click.prevent="addToCart(product)">
              <i class="fa fa-cart-plus" aria-hidden="true" /> ADD TO CART
            </a>
            <a v-else class="medium-size text-danger link" href="" @click.prevent="removeFromCart(product)">
              <i class="fa fa-cart-arrow-down" aria-hidden="true" /> REMOVE
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="product['auction lot'] === 'Yes' && isModalActive"
      class="modal fade"
      :id="`auction-${product['lot #']}`"
      ref="auction"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ product['lot #'] }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body row">
            <div class="col-lg-6">
              <carousel :per-page="1" :adjustableHeight="videoLink !== false" :minSwipeDistance="50" ref="carousel">
                <slide v-if="product.picture">
                  <img class="img-fluid rounded" v-img="{'src': product.picture[0].thumbnails.large.url, 'title': product['lot #']}" v-lazy="product.picture[0].thumbnails.large.url" :alt="product['lot #']">
                </slide>
                <slide v-if="product.video">
                  <video class="card-img-top rounded video-modal" :onloadeddata="videoLoaded()" controls>
                    <source :src="videoLink" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                </slide>
              </carousel>
            </div>
            <div v-if="auctionInfo" class="col-lg-6 mt-lg-0 mt-2">
              <div v-if="auctionInfo.status === 'Active'">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        Current Price:
                      </td>
                      <td class="pl-2 font-weight-medium-bolder">
                        CAD ${{ auctionInfo.startPrice.toFixed(2) }}
                      </td>
                    </tr>
                    <tr v-if="bids">
                      <td>
                        Winning:
                      </td>
                      <td class="pl-2">
                        {{ bids[bids.length - 1][1].name }}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Bids:
                      </td>
                      <td class="pl-2">
                        {{ bids ? bids.length : 0 }}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Time left:
                      </td>
                      <td class="pl-2">
                        {{ timeleft }}
                      </td>
                    </tr>
                    <tr class="smaller">
                      <td class="pt-2">
                        Ending at:
                      </td>
                      <td class="pt-2 pl-2">
                        {{ new Date(usTime).toLocaleString() }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="mt-4">
                  <div v-if="Object.keys(user).length">
                    <small class="text-muted">
                      CAD $
                    </small>
                    <div class="input-group px-0 col-6">
                      <input type="number" v-model="bidAmount" min="0" class="form-control">
                      <div class="input-group-append">
                        <button class="btn btn-success" type="button" @click="bid">BID</button>
                      </div>
                    </div>
                    <div v-if="bidError">
                      <small class="text-danger">
                        Error: {{ bidError }}
                      </small>
                    </div>
                    <div class="mt-3">
                      <small>
                        Logged as
                        <router-link data-dismiss="modal" to="/account">
                          {{ user.first_name }} {{ user.last_name }}
                        </router-link>
                      </small>
                    </div>
                  </div>
                  <div v-else>
                    You need to
                    <router-link data-dismiss="modal" to="/account">auth</router-link> for Bid
                  </div>
                </div>
              </div>
              <div v-else class="h-100 d-flex">
                <div class="m-auto text-center">
                  <img class="timedout" src="https://img.icons8.com/pastel-glyph/240/000000/time.png"/>
                  <h5>Auction ended!</h5>
                </div>
              </div>
            </div>
            <div v-if="bids && auctionInfo.status === 'Active'" class="col-12 mt-3">
              <h5>Bids History</h5>
              <table class="table mb-0 mt-3">
                <thead class="bg-lightgray">
                  <tr>
                    <th>Bidder</th>
                    <th>Date</th>
                    <th>Bid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) of bids" :key="`${item[1].name}-${i}`" class="mb-3">
                    <td data-title="Bidder">
                      {{ item[1].name }}
                    </td>
                    <td data-title="Date">
                      {{ new Date(item[1].date).toLocaleString() }}
                    </td>
                    <td data-title="Bid">
                      CAD ${{ item[1].amount.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import firebase from 'firebase/app'
import moment from 'moment-timezone'
import { Carousel, Slide } from 'vue-carousel'
import { mapMutations } from 'vuex'

export default {
  components: {
    Carousel,
    Slide
  },
  props: {
    productRaw: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: false
    },
    vendor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    readAllActive: false,
    description: '',
    activeSlide: 0,
    seoDescription: '',
    timeleft: '',
    auctionInfo: null,
    bids: null,
    bidAmount: 0,
    bidError: '',
    isModalActive: false
  }),
  computed: {
    product () { // make all object keys lowercase
      return Object.fromEntries(
        Object.entries(this.productRaw).map(([k, v]) => [k.toLowerCase(), v])
      )
    },
    usTime () {
      return moment(this.product['auction end'].replace('Z', '')).tz('America/Los_Angeles', true).format()
    },
    isAuctionEnded () {
      return new Date(this.usTime) > new Date()
    },
    videoPosition () {
      if (this.product.video && this.product.picture) {
        return 1
      } else {
        return 0
      }
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
    if (this.product.description) { // cut description
      this.description = this.product.description.slice(0, 120)
      this.seoDescription = this.product.description.slice(120, this.product.description.length)
    }
    if (this.product.serverlot) {
      if (new Date() > new Date(this.product.expiration)) {
        this.removeFromCart(this.product, true)
      }
    }
  },
  mounted () {
    if (this.$route.params.auction && this.$route.params.auction === this.product['lot #'].toLowerCase()) {
      this.$store.state.isModalActive = true
      this.isModalActive = true
      this.$nextTick(() => {
        $(`#auction-${this.product['lot #']}`).modal('show')
        this.$nextTick(() => {
          this.auctionOpen()
        })
      })
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
    removeFromCart (product, expired) {
      const fullProductData = { ...product, vendor: this.vendor }
      if (product.serverlot) {
        const isConfirmed = expired ? true : confirm('Are you sure? Lot is booked only for you')
        if (isConfirmed) {
          this.remove(fullProductData);
          (async () => {
            try {
              const uid = await this.$store.dispatch('getUserId')
              firebase.database().ref(`/users/${uid}/cart/${fullProductData['lot #']}`).remove()
              await fetch('/removeBookedLot', {
                method: 'delete',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  product: fullProductData['lot #'],
                  vendor: this.vendor
                })
              })
            } catch (e) {
              throw new Error(e)
            }
          })()
        }
      } else {
        this.remove(fullProductData)
      }
    },
    videoLoaded () {
      setTimeout(() => {
        this.$forceUpdate()
      }, 20)
    },
    checkAuction () {
      fetch('https://indigem.ca/checkAuction', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.product['lot #'],
          startPrice: this.product['auction price'].toFixed(2),
          endTime: this.usTime,
          image: this.product.picture[0].thumbnails.large.url,
          video: this.product.video,
          vendor: this.vendor
        })
      })
    },
    async auctionOpen () {
      this.$store.state.isModalActive = true
      this.isModalActive = true
      this.bidError = ''
      if (!this.$route.params.auction) {
        if (this.$route.params.vendor) {
          this.$router.push({
            path: `/${this.$route.params.vendor}/auctions/${this.product['lot #'].toLowerCase()}`
          })
        } else {
          this.$router.push({
            path: `/auctions/${this.product['lot #'].toLowerCase()}`
          })
        }
      }
      firebase.database().ref(`/auctions/${this.product['lot #']}`).on('value', (snapshot) => {
        const value = snapshot.val()
        if (value) {
          this.auctionInfo = value
          if (value.endTime < this.usTime) {
            this.checkAuction()
          }
          if (value.bids) {
            this.bids = Object.entries(value.bids)
          } else {
            this.bids = null
          }
        } else {
          this.checkAuction()
        }
      })
      this.countdown(this.usTime)
      setTimeout(() => {
        this.$refs.carousel.onResize()
        this.$refs.carousel.goToPage(0)
        $(this.$refs.auction).on('hidden.bs.modal', () => {
          this.$store.state.isModalActive = false
          this.isModalActive = false
          if (this.$route.params.vendor && this.$route.name !== 'Account') {
            this.$router.push({
              path: `/${this.$route.params.vendor}`
            })
          } else if (this.$route.name !== 'Account') {
            this.$router.push({
              path: '/'
            })
          }
          firebase.database().ref(`/auctions/${this.auctionInfo.name}`).off('value')
        })
      }, 300)
    },
    countdown (dt) {
      const self = this
      const end = new Date(dt)

      const _second = 1000
      const _minute = _second * 60
      const _hour = _minute * 60
      const _day = _hour * 24
      // eslint-disable-next-line
      let timer

      const showRemaining = () => {
        const now = new Date()
        const distance = end - now
        if (!self.isModalActive) {
          clearInterval(timer)
        }
        if (distance < 0) {
          clearInterval(timer)
          self.timeleft = 'Auction ended!'

          return
        }
        const days = Math.floor(distance / _day)
        const hours = Math.floor((distance % _day) / _hour)
        const minutes = Math.floor((distance % _hour) / _minute)
        const seconds = Math.floor((distance % _minute) / _second)
        self.timeleft = `${days}d ${hours}h ${minutes}m ${seconds}s`
      }

      timer = setInterval(showRemaining, 1000)
    },
    bid () {
      this.bidError = ''
      const bidStep = 3
      if (+this.bidAmount >= +this.auctionInfo.startPrice + bidStep) {
        if (new RegExp(/^\d+$/).test(this.bidAmount)) {
          try {
            fetch('/bid', {
              method: 'post',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                bid: {
                  auction: this.product['lot #'],
                  amount: this.bidAmount,
                  name: `${this.user.first_name} ${this.user.last_name.split('')[0]}.`,
                  uid: firebase.auth().currentUser.uid
                },
                vendor: {
                  id: this.vendor.id
                }
              })
            })
          } catch (e) {
            this.bidError = e
          }
        } else {
          this.bidError = 'Please bid in whole numbers only'
        }
      } else {
        this.bidError = `New bid must be at least CAD $${bidStep} more`
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .medium-size {
    font-size: 15px;
  }

  .smaller td {
    font-size: 14px;
  }

  .timedout {
    width: 90px;
    user-select: none;
  }

  .font-weight-medium-bolder {
    font-weight: 600;
  }

  .pointer {
    cursor: pointer;
  }

  .video {
    min-height: 440px !important;
  }

  .video-modal {
    height: auto !important;
  }

  @media screen and (max-width: 800px) {
    .table tbody tr {
      background-color: rgba(0,0,0,.03);
    }
  }

  @media screen and (max-width: 520px) {
    .video {
      min-height: 605px !important;
    }
  }
</style>
