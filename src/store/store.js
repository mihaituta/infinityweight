import {
  fbApp,
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
  updateDoc,
  getDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  runTransaction
} from 'boot/firebase'

import {date, Notify} from "quasar";

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
    // sort weights desc by date
    state.weightsData = state.weightsData.sort((a, b) => b.date - a.date)
  },
  updateWeight(state, weight) {
    // find the weight in array and replace it with the new one
    state.weightsData = [...state.weightsData.map(item => item.id !== weight.id ? item : {...item, ...weight.data})]
    // sort weights desc by date
    state.weightsData = state.weightsData.sort((a, b) => b.date - a.date)
  },
  deleteWeight(state, weightId) {
    let currentWeightIndex = state.weightsData.findIndex(item => item.id === weightId);
    state.weightsData.splice(currentWeightIndex, 1)
  },
  clearData(state) {
    state.userDetails = null;
    state.weightsData = []
  }
}

const actions = {
  registerUser({}, payload) {
    createUserWithEmailAndPassword(fbAuth, payload.email, payload.password)
      .then((res) => {
        if (res) {
          const userId = fbAuth.currentUser.uid
          try {
            setDoc(doc(fbDB, "users", userId), {
              name: payload.name,
              email: payload.email,
            })
          } catch (err) {
            console.error("Error creating user: ", err)
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
      .then(res => {
        if (res) {
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
      .catch(err => {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
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
    }).catch((err) => {
      console.log(err.message)
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
        } catch (err) {
          console.log(err)
        }
        await this.$router.push('/')
      } else {
        // User is logged out
        await this.$router.replace('/auth')
        commit('clearData')
      }
    })
  },

  async getWeights({commit, state}) {
    const weightsQuery = query(collection(fbDB, `users/${state.userDetails.userId}/weights`), orderBy('date'));
    onSnapshot(weightsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let weight = change.doc.data()
        const id = change.doc.id
        const data = {
          id,
          weight: weight.weight.toString(),
          weightDiff: weight.weightDiff,
          date: new Date(weight.date)
        }

        if (change.type === 'added') {
          commit('addWeight', data)
        }
        if (change.type === 'modified') {
          commit('updateWeight', {data, id})
        }
        if (change.type === 'removed') {
          commit('deleteWeight', id);
        }
      });
    });
  },

  async addWeight({state}, payload) {

    // loop over weights array to find the date previous to current and compare weights
    let weightDiff = 0
    state.weightsData.some(weight => {
      if (payload.date > weight.date) {
        weightDiff = (-weight.weight + payload.weight).toFixed(1)
        return true
      }
    })

    // set the weight id as the current date
    const weightId = date.formatDate(payload.date, 'DD-MM-YYYY')
    const weightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, weightId)
    try {
      // check if weight already exists in db
      const docSnap = await getDoc(weightDoc);
      if (docSnap.exists()) {
        Notify.create({
          progress: true,
          type: 'negative',
          color: 'negative',
          timeout: 2000,
          position: 'top',
          message: 'Weight already exists!'
        })
      } else {
        //if weight does not exist, add it
        await setDoc(weightDoc, {
          weight: payload.weight,
          date: payload.date.toISOString(),
          weightDiff
        })
        Notify.create({
          progress: true,
          type: 'positive',
          color: 'positive',
          timeout: 2000,
          position: 'top',
          message: 'Weight added successfully!'
        })

        // recalculate previous weight difference when a weight is added after it
        const currentWeightIndex = state.weightsData.findIndex(item => item.id === weightId);
        if (currentWeightIndex > 0) {
          const prevWeight = state.weightsData[currentWeightIndex - 1]
          const prevWeightRef = doc(fbDB, `users/${state.userDetails.userId}/weights`, prevWeight.id)
          await updateDoc(prevWeightRef, {
            weightDiff: (prevWeight.weight - payload.weight).toFixed(1)
          });
        }
      }
    } catch (err) {
      console.log(err)
    }

    /*try {
      await runTransaction(fbDB, async (transaction) => {
        const sfDoc = await transaction.get(weightDoc);
        if (sfDoc.exists()) {
          Notify.create({
            progress: true,
            type: 'negative',
            color: 'negative',
            timeout: 2000,
            position: 'top',
            message: 'Weight already exists!'
          })
          throw "Weight already exist!";
        }

        await transaction.set(weightDoc, {
          weight: payload.weight,
          date: payload.date.toISOString(),
          weightDiff
        })

        Notify.create({
          progress: true,
          type: 'positive',
          color: 'positive',
          timeout: 2000,
          position: 'top',
          message: 'Weight added successfully!'
        })
      });
      // console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }*/

  },

  async deleteWeight({state}, payload) {
      await deleteDoc()
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
