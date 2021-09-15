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
      .then(response => {
        console.log(response)
        const userId = fbAuth.currentUser.uid
        try {
          setDoc(doc(fbDB, "users", userId), {
            name: payload.name,
            email: payload.email,
          })
        } catch (e) {
          console.error("Error adding document: ", e)
        }
      })
      .catch(e => {
        console.log(e)
      });
  },

  loginUser({}, payload) {
    signInWithEmailAndPassword(fbAuth, payload.email, payload.password)
      .then(response => {
        console.log(response)
      })
      .catch(e => {
        console.log(e)
      })
  },

  logoutUser() {
    signOut(fbAuth)
  },

  handleAuthStateChanged({commit}) {
    onAuthStateChanged(fbAuth, async user => {
      if (user) {
        // User is logged in
        try {
          const docSnap = await getDoc(doc(fbDB, "users", user.uid));
          const userDetails = docSnap.data()
          if (docSnap.exists()) {
            commit('setUserDetails', {
              name: userDetails.name,
              email: userDetails.email,
              userId: user.uid
            })
          } else {

          }
        } catch (e) {
          console.log(e)
        }
        this.$router.push('/')
      } else {
        // User is logged out
        commit('setUserDetails', {})
        this.$router.replace('/auth')
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
