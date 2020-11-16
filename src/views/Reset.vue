<template>
  <section>
    <div>
      <div class="row">
        <div class="col-6 pr-0">
          <h3 class="font-weight-bold">
            <i class="fa fa-user" aria-hidden="true"></i>
            Reset Password
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
          v-if="!mode"
          class="col-lg-8 mx-auto rounded bg-light pt-4 pb-4 px-4"
          @submit.prevent="reset"
        >
          <div class="text-center">
            <h3 class="font-weight-bold mb-4">Reset Password</h3>
          </div>
          <div class="col">
            <small>Email*</small>
            <input type="email" class="form-control" v-model="email" required>
          </div>
          <div class="mt-3 col-12">
            <small class="text-danger">
              {{ error }}
            </small>
          </div>
          <div v-if="msg" class="col-12 text-center text-success">
            <small>
              {{ msg }}
            </small>
          </div>
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary">Send verification</button>
            <div class="text-muted mt-3">
              <small>
                OR <router-link to="/account">SIGN IN</router-link>
              </small>
            </div>
          </div>
        </form>
        <form
          v-else-if="mode === 'resetPassword'"
          class="col-lg-8 mx-auto rounded bg-light pt-4 pb-4 px-4"
          @submit.prevent="update"
        >
          <div class="text-center">
            <h3 class="font-weight-bold mb-4">Reset Password</h3>
          </div>
          <div class="col">
            <small>New Password*</small>
            <input type="password" class="form-control" v-model="password" required>
          </div>
          <div class="mt-3 col-12">
            <small class="text-danger">
              {{ error }}
            </small>
          </div>
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary">Update Password</button>
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
    email: '',
    password: '',
    msg: '',
    error: ''
  }),
  computed: {
    mode () {
      return this.$route.query.mode
    }
  },
  methods: {
    reset () {
      this.error = ''
      this.msg = ''
      firebase.auth().sendPasswordResetEmail(this.email)
        .then(() => {
          this.msg = 'Password reset sent successfully!'
        })
        .catch((e) => {
          this.error = e
        })
    },
    update () {
      this.error = ''
      const actionCode = this.$route.query.oobCode
      // Verify the password reset code is valid.
      firebase.auth().verifyPasswordResetCode(actionCode).then((email) => {
        firebase.auth().confirmPasswordReset(actionCode, this.password).then(() => {
          firebase.auth().signInWithEmailAndPassword(email, this.password)
          this.$router.push('account')
        }).catch((error) => {
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
          this.error = error
        })
      }).catch(() => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        this.error = 'Your link is invalid or expired. Please try to reset your password again'
      })
    }
  }
}
</script>

<style media="screen">
  .min-vh-80 {
    min-height: 80vh;
  }
</style>
