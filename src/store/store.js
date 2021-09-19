import {
  fbAuth,
  fbDB,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  setDoc,
  getDoc,
  doc
} from 'boot/firebase'

import {Notify} from "quasar";

const state = {
  userDetails: {}
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload
  }
}

const actions = {
  registerUser({}, payload) {
    createUserWithEmailAndPassword(fbAuth, payload.email, payload.password)
      .then((response) => {
        if (response) {
          const userId = fbAuth.currentUser.uid
          try {
            setDoc(doc(fbDB, "users", userId), {
              name: payload.name,
              email: payload.email,
            })
          } catch (e) {
            console.error("Error adding document: ", e)
          }
          Notify.create({
            progress: true,
            type: 'positive',
            color: 'positive',
            timeout: 3000,
            position: 'top',
            message: 'User registered successfully!'
          })
        }
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Notify.create({
            progress: true,
            type: 'negative',
            color: 'negative',
            timeout: 2000,
            position: 'top',
            message: 'Email is unavailable!'
          })
        }
      });
  },

  loginUser({}, payload) {
    signInWithEmailAndPassword(fbAuth, payload.email, payload.password)
      .then(response => {
        if (response) {
          Notify.create({
            progress: true,
            type: 'positive',
            color: 'positive',
            timeout: 2000,
            position: 'top',
            message: 'Login successfully!'
          })
        }
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          Notify.create({
            progress: true,
            type: 'negative',
            color: 'negative',
            timeout: 2000,
            position: 'top',
            message: 'Invalid credentials!'
          })
        }
      })
  },

  logoutUser() {
    signOut(fbAuth).then(() => {
      Notify.create({
        progress: true,
        type: 'positive',
        color: 'positive',
        timeout: 2000,
        position: 'top',
        message: 'Logout successfully!'
      })
    }).catch((error) => {
      console.log(error.message)
      Notify.create({
        progress: true,
        type: 'negative',
        color: 'negative',
        timeout: 2000,
        position: 'top',
        message: 'Something went wrong!'
      })
    });
  },

  handleAuthStateChanged({commit}) {
    onAuthStateChanged(fbAuth, async user => {
      if (user) {
        // User is logged in
        try {
          const docSnap = await getDoc(doc(fbDB, "users", user.uid));
          const userDetails = docSnap.data()
          commit('setUserDetails', {
            name: userDetails.name,
            email: userDetails.email,
            userId: user.uid
          })
        } catch (e) {
          console.log(e)
        }
        await this.$router.push('/')
      } else {
        // User is logged out
        await this.$router.replace('/auth')
        commit('setUserDetails', {})
      }
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
