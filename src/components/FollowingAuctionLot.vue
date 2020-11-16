<template>
  <tr v-if="auction" class="mb-3">
    <td data-title="Image">
      <img v-img="{'src': auction.image, 'title': bid[1].auction}" class="img-preview img-fluid rounded" v-lazy="auction.image" :alt="bid[1].auction">
    </td>
    <td data-title="Auction">
      <a :href="link">
        {{ bid[1].auction }}
      </a>
    </td>
    <td data-title="Bid time">
      {{ new Date(bid[1].date).toLocaleString() }}
    </td>
    <td data-title="Vendor">
      {{ auction.vendor.name }}
    </td>
    <td data-title="Price">
      $ {{ bid[1].amount.toFixed(2) }} CAD
    </td>
    <td data-title="Winning" class="d-flex">
      <div class="pr-1" :class="{'paid': isWinning === 'Yes', 'not-winning': isWinning === 'No'}" />
      {{ isWinning }}
    </td>
  </tr>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'FollowingAuctionLot',
  props: {
    bid: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    auction: null
  }),
  computed: {
    isWinning () {
      if (this.auction) {
        const bids = Object.entries(this.auction.bids)
        if (bids[bids.length - 1][1].uid === firebase.auth().currentUser.uid) {
          return 'Yes'
        } else {
          return 'No'
        }
      } else {
        return 'Loading'
      }
    },
    link () {
      return `/${this.auction.vendor.name.toLowerCase().replace(/ /g, '_')}/auctions/${this.bid[1].auction.toLowerCase()}`
    }
  },
  created () {
    firebase.database().ref(`/auctions/${this.bid[1].auction}/`).on('value', (snapshot) => {
      this.auction = snapshot.val()
      if (this.auction.status === 'Expired') {
        const uid = firebase.auth().currentUser.uid
        firebase.database().ref(`/users/${uid}/followingAuctions/${this.bid[1].auction}/`).remove()
      }
    })
  },
  beforeDestroy () {
    firebase.database().ref(`/auctions/${this.bid[1].auction}/`).off('value')
  }
}
</script>

<style lang="css" scoped>
  .not-winning:before {
    content: '●';
    color: #ffc107;
  }
</style>
