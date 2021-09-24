import {
  fbAuth,
  fbDB,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  query,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  doc,
  onSnapshot,
  orderBy
} from 'boot/firebase'

import {Notify} from "quasar";

const state = {
  userDetails: {},
  weightsData: []
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload
  },
  addWeight(state, weight) {
    state.weightsData.unshift(weight)
  },
  updateWeight(state, weight) {
    state.weightsData.splice(weight.weightId, 1)
    state.weightsData.unshift(weight.weightObj)
  },
  deleteWeight(state, weight) {
    state.weightsData.splice(weight, 1);
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

  handleAuthStateChanged({commit, dispatch}) {
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
          dispatch('getWeights')
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
  },

  async getWeights({commit, state}) {
    const weightsQuery = query(collection(fbDB, `users/${state.userDetails.userId}/weight`), orderBy('date'));
    onSnapshot(weightsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let weight = change.doc.data();

        const date = new Date(weight.date.toDate());
        const month = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
          'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'][date.getMonth()];
        const day = date.getDate()
        const year = date.getFullYear()

        let weightId = change.doc.id;
        const weightObj = {
          weightId,
          weight: weight.weight,
          weightDiff: weight.weightDiff,
          status: weight.status,
          date: {day, month, year}
        }

        if (change.type === 'added') {
          commit('addWeight', weightObj)
        }
        if (change.type === 'modified') {
          commit('updateWeight', {weightObj, weightId});
        }
        if (change.type === 'removed') {
          commit('deleteWeight', weightId);
        }
      });
    });
  }
}

const getters = {
  weights: state => state.weightsData
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
