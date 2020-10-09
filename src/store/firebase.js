import firebase from 'firebase/app'

export default {
  actions: {
    getUserId () {
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    }
  }
}
