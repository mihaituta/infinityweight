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
  runTransaction,
  writeBatch
} from 'boot/firebase'

import {date, Notify} from "quasar";

const state = {
  userDetails: {},
  weightsData: [],
  weightsListener: null
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload
  },
  setWeightsListener(state, payload) {
    state.weightsListener = payload
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
    const selectedWeightIndex = state.weightsData.findIndex(item => item.id === weightId);
    state.weightsData.splice(selectedWeightIndex, 1)
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
            color: 'secondary',
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
            color: 'secondary',
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

  async logoutUser({state}) {
    // this unsubscribes from the listener so it doesn't throw error because of firebase rules trying to listen for changes when there is no user authenticated
    state.weightsListener()

    await signOut(fbAuth).then(() => {
      Notify.create({
        progress: true,
        type: 'positive',
        color: 'secondary',
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
    const weightsListener = onSnapshot(weightsQuery, (snapshot) => {
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
    commit('setWeightsListener', weightsListener)
  },

  async deleteWeight({state, commit}, payload) {
    const selectedWeightIndex = state.weightsData.findIndex(item => item.id === payload.id);

    const nextDayWeightIndex = selectedWeightIndex - 1
    const prevDayWeightIndex = selectedWeightIndex + 1

    const nextDayWeight = state.weightsData[nextDayWeightIndex]
    const prevDayWeight = state.weightsData[prevDayWeightIndex]

    let weightDiff = 0
    let canUpdate = false

    // if the user only has one weight there's no need to re-calculate any difference
    if (state.weightsData.length !== 1) {
      // if the selected weight is not the most recent or oldest calculate the difference between the previous day and the next day weight
      if (selectedWeightIndex !== 0 && selectedWeightIndex !== state.weightsData.length - 1) {
        weightDiff = (parseFloat(nextDayWeight.weight) - parseFloat(prevDayWeight.weight)).toFixed(1)
        canUpdate = true
      }
      /* if the selected weight is the oldest (first ever added),
      the next day's difference should be 0 since there's nothing before it to compare */
      else if (selectedWeightIndex === state.weightsData.length - 1) {
        weightDiff = 0
        canUpdate = true
      }
    }

    const weightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, payload.id)

    try {
      await deleteDoc(weightDoc)
      if (canUpdate) {
        const nextDayWeightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, nextDayWeight.id)
        await updateDoc(nextDayWeightDoc, {weightDiff})
      }
      Notify.create({
        progress: true,
        type: 'positive',
        color: 'secondary',
        timeout: 2000,
        position: 'top',
        message: 'Weight deleted successfully!'
      })

      canUpdate = false
    } catch (err) {
      console.log(err)
    }
  },

  async updateWeight({state}, payload) {
    const selectedWeightIndex = state.weightsData.findIndex(item => item.id === payload.id);
    const nextDayWeightIndex = selectedWeightIndex - 1
    const prevDayWeightIndex = selectedWeightIndex + 1

    const nextDayWeight = state.weightsData[nextDayWeightIndex]
    const prevDayWeight = state.weightsData[prevDayWeightIndex]

    let selectedWeightDiff = 0, nextDayWeightDiff = 0

    let canUpdateNextDayWeight = true

    // if the user only has one weight there's no need to re-calculate any difference
    if (state.weightsData.length !== 1) {
      // if selected weight is the most recent (first in array), only update it's weight difference since there is no next day
      if (selectedWeightIndex === 0) {
        selectedWeightDiff = (payload.weight - prevDayWeight.weight).toFixed(1)
        canUpdateNextDayWeight = false
      }
      /* if selected weight is the first ever added (oldest date) (last in array)
       don't update selected weight difference since there is nothing before it to compare to
       only update next day's weight difference */
      else if (selectedWeightIndex === state.weightsData.length - 1) {
        nextDayWeightDiff = (nextDayWeight.weight - payload.weight).toFixed(1)
      }
      // if selected weight is neither first or last, update both the selected and the next day's weight
      else {
        selectedWeightDiff = (payload.weight - prevDayWeight.weight).toFixed(1)
        nextDayWeightDiff = (nextDayWeight.weight - payload.weight).toFixed(1)
      }
    }

    const weightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, payload.id)

    try {
      await updateDoc(weightDoc, {
        weight: payload.weight,
        weightDiff: selectedWeightDiff
      })
      // only update next day difference if selected is not the most recent, since there is no next day
      if (selectedWeightIndex !== 0 && canUpdateNextDayWeight) {
        const nextDayWeightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, nextDayWeight.id)
        await updateDoc(nextDayWeightDoc, {
          weightDiff: nextDayWeightDiff
        })
      }

      Notify.create({
        progress: true,
        type: 'positive',
        color: 'secondary',
        timeout: 2000,
        position: 'top',
        message: 'Weight updated successfully!'
      })
    } catch (err) {
      console.log(err)
    }
  },

  async addWeight({state}, payload) {
    // loop over weights array to find the date previous to current and compare weights
    let weightDiff = 0
    state.weightsData.some(weightInState => {
      if (payload.date > weightInState.date) {
        weightDiff = (-weightInState.weight + payload.weight).toFixed(1)
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
        return
      } else {
        //if weight does not exist, add it
        await setDoc(weightDoc, {
          weight: payload.weight,
          date: payload.date.toISOString(),
          weightDiff
        })

        // recalculate the next day's weight difference when a weight is added before it
        const addedWeightIndex = state.weightsData.findIndex(item => item.id === weightId);
        if (addedWeightIndex > 0) {
          const nextDayWeight = state.weightsData[addedWeightIndex - 1]
          const nextDayWeightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, nextDayWeight.id)
          await updateDoc(nextDayWeightDoc, {
            weightDiff: (nextDayWeight.weight - payload.weight).toFixed(1)
          });
        }
      }
      Notify.create({
        progress: true,
        type: 'positive',
        color: 'secondary',
        timeout: 2000,
        position: 'top',
        message: 'Weight added successfully!'
      })
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
          color: 'secondary',
          timeout: 2000,
          position: 'top',
          message: 'Weight added successfully!'
        })
      });
      // console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }*/

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
