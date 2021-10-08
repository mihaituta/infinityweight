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
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  runTransaction,
  writeBatch,
  limit,
  where
} from 'boot/firebase'

import {date, Notify} from "quasar";

const state = {
  userDetails: {},
  weightsData: [],
  loadingStatus: true,
  weightsListener: null,
}

const mutations = {
  setLoadingStatus(state, payload) {
    state.loadingStatus = payload
  },
  setUserDetails(state, payload) {
    state.userDetails = payload
  },
  setWeightsListener(state, payload) {
    state.weightsListener = payload
  },
  setWeights(state, payload) {
    state.weightsData = payload;
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
              email: payload.email,
            })
          } catch (err) {
            console.error("Error creating account: ", err)
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
            message: 'Email is taken!'
          })
        }
      });
  },

  loginUser(state, payload) {
    signInWithEmailAndPassword(fbAuth, payload.email, payload.password)
      .then(async res => {
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
            email: userDetails.email,
            userId: user.uid
          })
          dispatch('getAllWeights')
          dispatch('weightsListener')
        } catch (err) {
          console.log(err)
        }
        if (this.$router.currentRoute.value.name === 'auth') {
          await this.$router.replace('/')
        }
      } else {
        // User is logged out
        await this.$router.replace('/auth')
        commit('clearData')
      }
    })
  },

  async getAllWeights({commit, state}) {
    const weightsQuery = query(collection(fbDB, `users/${state.userDetails.userId}/weights`), orderBy('date'));
    try {
      const snapshot = await getDocs(weightsQuery);
      const weightData = []
      await snapshot.forEach(doc => {
        let weight = doc.data()
        const id = doc.id
        const temp = {
          id,
          weight: weight.weight.toString(),
          weightDiff: weight.weightDiff,
          date: new Date(weight.date)
        }
        weightData.unshift(temp)
      });
      await commit('setLoadingStatus', false)
      await commit('setWeights', weightData)
    } catch (e) {
      console.log(e.message)
    }
  },

  async weightsListener({commit, state}) {
    const weightsQuery = query(collection(fbDB, `users/${state.userDetails.userId}/weights`), orderBy('date'),);
    let initState = true
    const weightsListener = onSnapshot(weightsQuery, snapshot => {
      if (initState) {
        initState = false;
      } else {
        if (!snapshot.docChanges().empty) {
          snapshot.docChanges().forEach(change => {
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
            } else if (change.type === 'modified') {
              commit('updateWeight', {data, id})
            } else if (change.type === 'removed') {
              commit('deleteWeight', id);
            }
          });
        }
      }
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
        await updateDoc(nextDayWeightDoc, {
          weightDiff: parseFloat(weightDiff)
        })
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
        weightDiff: parseFloat(selectedWeightDiff)
      })
      // only update next day difference if selected is not the most recent, since there is no next day
      if (selectedWeightIndex !== 0 && canUpdateNextDayWeight) {
        const nextDayWeightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, nextDayWeight.id)
        await updateDoc(nextDayWeightDoc, {
          weightDiff: parseFloat(nextDayWeightDiff)
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

  async addWeight({state, commit}, payload) {
    // loop over weights array to find the date previous to current and compare weights
    let weightDiff = 0
    state.weightsData.some(weightInState => {
      if (payload.date > weightInState.date) {
        weightDiff = (-weightInState.weight + payload.weight).toFixed(1)
        return true
      }
    })

    // set the weight id as the current date
    const weightId = date.formatDate(payload.date, 'DD MMM YYYY')
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
          weightDiff: parseFloat(weightDiff)
        })
        // recalculate the next day's weight difference when a weight is added before it
        const addedWeightIndex = state.weightsData.findIndex(item => item.id === weightId);
        if (addedWeightIndex > 0) {
          const nextDayWeight = state.weightsData[addedWeightIndex - 1]
          const nextDayWeightDoc = doc(fbDB, `users/${state.userDetails.userId}/weights`, nextDayWeight.id)
          await updateDoc(nextDayWeightDoc, {
            weightDiff: parseFloat((nextDayWeight.weight - payload.weight).toFixed(1))
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
  },

  //populates db with weights for testing features
  async populateDb() {
    const weightsArray = [
      {
        date: '8 Oct 2021',
        weight: 76.6
      }, {
        date: '7 Oct 2021',
        weight: 76.2
      }, {
        date: '6 Oct 2021',
        weight: 76.1
      }, {
        date: '5 Oct 2021',
        weight: 75.9
      }, {
        date: '3 Oct 2021',
        weight: 76
      }, {
        date: '2 Oct 2021',
        weight: 76.1
      }, {
        date: '1 Oct 2021',
        weight: 76.8
      }, {
        date: '30 Sep 2021',
        weight: 76.8
      }, {
        date: '24 Sep 2021',
        weight: 77.4
      }, {
        date: '23 Sep 2021',
        weight: 77.1
      }, {
        date: '22 Sep 2021',
        weight: 77.3
      }, {
        date: '21 Sep 2021',
        weight: 78.4
      }, {
        date: '20 Sep 2021',
        weight: 78.5
      }, {
        date: '19 Sep 2021',
        weight: 78.8
      }, {
        date: '18 Sep 2021',
        weight: 77.6
      }, {
        date: '17 Sep 2021',
        weight: 78.3
      }, {
        date: '16 Sep 2021',
        weight: 78.1
      }, {
        date: '13 Sep 2021',
        weight: 78.3
      }, {
        date: '12 Sep 2021',
        weight: 78.1
      }, {
        date: '11 Sep 2021',
        weight: 79.5
      }, {
        date: '10 Sep 2021',
        weight: 77.5
      }, {
        date: '9 Sep 2021',
        weight: 77.6
      }, {
        date: '8 Sep 2021',
        weight: 78.1
      }, {
        date: '7 Sep 2021',
        weight: 78.2
      }, {
        date: '3 Sep 2021',
        weight: 78.3
      }, {
        date: '2 Sep 2021',
        weight: 78.4
      }, {
        date: '1 Sep 2021',
        weight: 78.2
      }, {
        date: '31 Aug 2021',
        weight: 78.4
      }, {
        date: '30 Aug 2021',
        weight: 78.9
      }, {
        date: '29 Aug 2021',
        weight: 79.2
      }, {
        date: '28 Aug 2021',
        weight: 79.5
      }, {
        date: '27 Aug 2021',
        weight: 78.8
      }, {
        date: '26 Aug 2021',
        weight: 79.0
      }, {
        date: '25 Aug 2021',
        weight: 78.8
      }, {
        date: '24 Aug 2021',
        weight: 78.6
      }, {
        date: '23 Aug 2021',
        weight: 78.5
      }, {
        date: '22 Aug 2021',
        weight: 78.5
      }, {
        date: '21 Aug 2021',
        weight: 78.5
      }, {
        date: '19 Aug 2021',
        weight: 78.9
      }, {
        date: '18 Aug 2021',
        weight: 79.4
      }, {
        date: '17 Aug 2021',
        weight: 79.2
      }, {
        date: '16 Aug 2021',
        weight: 79.4
      }, {
        date: '15 Aug 2021',
        weight: 79.3
      }, {
        date: '14 Aug 2021',
        weight: 79.6
      }, {
        date: '9 Aug 2021',
        weight: 80.3
      }, {
        date: '8 Aug 2021',
        weight: 80.9
      }, {
        date: '7 Aug 2021',
        weight: 80.9
      }, {
        date: '6 Aug 2021',
        weight: 80.6
      }, {
        date: '5 Aug 2021',
        weight: 80.7
      }, {
        date: '4 Aug 2021',
        weight: 80.8
      }, {
        date: '3 Aug 2021',
        weight: 81.0
      }, {
        date: '1 Aug 2021',
        weight: 81.4
      }, {
        date: '21 May 2021',
        weight: 87.4
      }, {
        date: '25 Dec 2020',
        weight: 77.7
      }, {
        date: '3 Oct 2020',
        weight: 79.1
      }, {
        date: '26 Sep 2020',
        weight: 79.4
      }, {
        date: '20 Sep 2020',
        weight: 79.4
      }, {
        date: '17 Sep 2020',
        weight: 79.3
      }, {
        date: '6 Sep 2020 ',
        weight: 80.1
      }, {
        date: '5 Sep 2020 ',
        weight: 80.2
      }, {
        date: '31 Aug 2020',
        weight: 80.4
      }, {
        date: '30 Aug 2020',
        weight: 80.2
      }, {
        date: '29 Aug 2020',
        weight: 80.0
      }, {
        date: '28 Aug 2020',
        weight: 80.0
      }, {
        date: '27 Aug 2020',
        weight: 80.3
      }, {
        date: '26 Aug 2020',
        weight: 80.7
      }, {
        date: '25 Aug 2020',
        weight: 80.4
      }, {
        date: '24 Aug 2020',
        weight: 80.1
      }, {
        date: '23 Aug 2020',
        weight: 79.5
      }, {
        date: '22 Aug 2020',
        weight: 79.9
      }, {
        date: '21 Aug 2020',
        weight: 80.5
      }, {
        date: '20 Aug 2020',
        weight: 80.8
      }, {
        date: '19 Aug 2020',
        weight: 80.2
      }, {
        date: '18 Aug 2020',
        weight: 80.4
      }, {
        date: '16 Aug 2020',
        weight: 81.5
      }, {
        date: '15 Aug 2020',
        weight: 81.6
      }, {
        date: '14 Aug 2020',
        weight: 81.6
      }, {
        date: '13 Aug 2020',
        weight: 80.9
      }, {
        date: '12 Aug 2020',
        weight: 80.9
      }, {
        date: '11 Aug 2020',
        weight: 81.1
      }, {
        date: '10 Aug 2020',
        weight: 81.8
      }, {
        date: '9 Aug 2020',
        weight: 81.9
      }, {
        date: '8 Aug 2020',
        weight: 81.7
      }, {
        date: '7 Aug 2020',
        weight: 81.7
      }, {
        date: '6 Aug 2020',
        weight: 82.5
      }, {
        date: '5 Aug 2020',
        weight: 82.2
      }, {
        date: '4 Aug 2020',
        weight: 82.9
      }, {
        date: '3 Aug 2020',
        weight: 83.7
      }, {
        date: '2 Aug 2020',
        weight: 83.4
      }, {
        date: '1 Aug 2020',
        weight: 83.3
      }, {
        date: '31 Jul 2020',
        weight: 83.5
      }, {
        date: '30 Jul 2020',
        weight: 84.3
      }, {
        date: '29 Jul 2020',
        weight: 84.7
      }, {
        date: '28 Jul 2020',
        weight: 85.0
      }, {
        date: '27 Jul 2020',
        weight: 84.7
      }, {
        date: '26 Jul 2020',
        weight: 84.8
      }, {
        date: '25 Jul 2020',
        weight: 85.1
      }, {
        date: '24 Jul 2020',
        weight: 85.4
      }, {
        date: '23 Jul 2020',
        weight: 85.0
      }, {
        date: '22 Jul 2020',
        weight: 85.7
      }, {
        date: '21 Jul 2020',
        weight: 86.0
      }, {
        date: '19 Jul 2020',
        weight: 86.4
      }, {
        date: '18 Jul 2020',
        weight: 85.8
      }, {
        date: '17 Jul 2020',
        weight: 85.7
      }, {
        date: '16 Jul 2020',
        weight: 85.1
      }, {
        date: '15 Jul 2020',
        weight: 85.7
      }, {
        date: '14 Jul 2020',
        weight: 85.1
      }, {
        date: '12 Jul 2020',
        weight: 85.8
      }, {
        date: '11 Jul 2020',
        weight: 86.1
      }, {
        date: '10 Jul 2020',
        weight: 86.3
      }, {
        date: '9 Jul 2020',
        weight: 86.5
      }, {
        date: '8 Jul 2020',
        weight: 86.5
      }, {
        date: '7 Jul 2020',
        weight: 87.5
      }, {
        date: '6 Jul 2020',
        weight: 86.8
      }, {
        date: '5 Jul 2020',
        weight: 87.1
      }, {
        date: '4 Jul 2020',
        weight: 87.0
      }, {
        date: '3 Jul 2020',
        weight: 87.5
      }, {
        date: '2 Jul 2020',
        weight: 88.0
      }, {
        date: '1 Jul 2020',
        weight: 88.5
      }, {
        date: '30 Jun 2020',
        weight: 89.0
      }, {
        date: '29 Jun 2020',
        weight: 89.5
      }, {
        date: '28 Jun 2020',
        weight: 89.8
      }, {
        date: '27 Jun 2020',
        weight: 90.1
      }
    ]
    const batch = writeBatch(fbDB);

    weightsArray.forEach((weight, index, arr) => {
      // use this if the date's format in weightsArray is another than (DD MMM YYYY)
      // const docId = date.formatDate(weight.date, 'DD MMM YYYY')
      const docId = weight.date
      const docRef = doc(fbDB, `users/${state.userDetails.userId}/weights`, docId);
      batch.set(docRef, {
        weight: weight.weight,
        date: new Date(weight.date).toISOString(),
        weightDiff: index < arr.length - 1 ? parseFloat((weight.weight - arr[index + 1].weight).toFixed(1)) : 0
      })
    })

    await batch.commit();
  }
}

const getters = {
  weights: state => state.weightsData,
  loadingStatus: state => state.loadingStatus
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
