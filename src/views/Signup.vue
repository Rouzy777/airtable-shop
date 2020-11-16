<template>
  <section>
    <div>
      <div class="row">
        <div class="col-6 pr-0">
          <h3 class="font-weight-bold">
            <i class="fa fa-user-plus" aria-hidden="true"></i>
            Sign Up
          </h3>
        </div>
        <div class="col-6 align-self-center text-right">
          <router-link to="/" class="font-weight-bold link">
            <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Return to List
          </router-link>
        </div>
      </div>
    </div>
    <div class="d-flex min-vh-80 my-5">
      <div class="col-12 px-0 align-self-center">
        <form
          class="col-lg-8 mx-auto rounded bg-light pt-4 pb-4 px-4"
          @submit.prevent="register"
        >
          <div class="text-center">
            <h3 class="font-weight-bold mb-4">Sign Up</h3>
          </div>
          <div class="row">
            <div class="col-lg">
              <small>First Name*</small>
              <input class="form-control" v-model="user.fname" required>
            </div>
            <div class="col-lg mt-lg-0 mt-3">
              <small>Last name*</small>
              <input class="form-control" v-model="user.lname" required>
            </div>
          </div>
          <div class="mt-3 row">
            <div class="col-lg">
              <small>Email*</small>
              <input type="email" class="form-control" v-model="user.email" required>
            </div>
            <div class="col-lg mt-lg-0 mt-3">
              <small>Phone*</small>
              <input type="number" class="form-control" v-model="user.phone" required>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-lg">
              <small>Password*</small>
              <input type="password" class="form-control" v-model="user.password" autocomplete="off" required>
            </div>
            <div class="col-lg mt-lg-0 mt-3">
              <small>Confirm Password*</small>
              <input type="password" class="form-control" v-model="user.confirmPassword" autocomplete="off" required>
            </div>
          </div>
          <div class="mt-3 row">
            <div class="col-lg">
              <small>Address*</small>
              <input class="form-control" v-model="user.address" required>
            </div>
          </div>
          <div class="mt-3 row">
            <div class="col-lg">
              <small>City*</small>
              <input class="form-control" v-model="user.city" required>
            </div>
            <div class="col-xl mt-xl-0 mt-3">
              <small>Apartment, suite, etc. (optional)</small>
              <input class="form-control" v-model="user.apartment">
            </div>
          </div>
          <div class="mt-3 row">
            <div class="col-lg">
              <small>Country/Region*</small>
              <select class="form-control" v-model="user.region" required>
                <option value="CA">Canada</option>
                <option value="US">United States of America</option>
              </select>
            </div>
            <div class="col-lg mt-lg-0 mt-3">
              <small>Province/State*</small>
              <input class="form-control" v-model="user.province" required>
            </div>
            <div class="col-lg mt-lg-0 mt-3">
              <small>Postal Code/ZIP Code*</small>
              <input class="form-control" v-model="user.postal_code" required>
            </div>
          </div>
          <div class="mt-3">
            <small class="text-danger">
              {{ error }}
            </small>
          </div>
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary">Sign Up</button>
            <div class="text-muted mt-3">
              <small>OR <router-link to="/account">SIGN IN</router-link> </small>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'SignUp',
  data: () => ({
    user: {
      fname: '',
      lname: '',
      password: '',
      confirmPassword: '',
      email: '',
      address: '',
      city: '',
      region: 'CA',
      province: '',
      postal_code: '',
      apartment: '',
      phone: ''
    },
    error: ''
  }),
  methods: {
    async register () {
      try {
        this.error = ''
        const data = this.user
        if (data.password === data.confirmPassword) {
          await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
          const uid = await this.$store.dispatch('getUserId')
          await firebase.database().ref(`/users/${uid}/info`).set({
            first_name: data.fname,
            last_name: data.lname,
            city: data.city,
            region: data.region,
            province: data.province,
            postal_code: data.postal_code,
            apartment: data.apartment,
            address: data.address,
            email: data.email,
            phone: data.phone
          })
          this.$router.push('/account')
        } else {
          this.error = 'Error: passwords are not identical.'
        }
      } catch (e) {
        this.error = e
        throw e
      }
    }
  }
}
</script>

<style media="screen">
  .min-vh-80 {
    min-height: 80vh;
  }
</style>
