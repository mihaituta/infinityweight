// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  orderBy,
  runTransaction,
  writeBatch,
  limit,
  where
} from 'firebase/firestore'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

// Initialize Firebase
const fbApp = initializeApp({
  apiKey: "AIzaSyAAadtu6R14A7QVs-lyYNWDwCshioOdnD0",
  authDomain: "infinityweight-35abe.firebaseapp.com",
  projectId: "infinityweight-35abe",
  storageBucket: "infinityweight-35abe.appspot.com",
  messagingSenderId: "708464725936",
  appId: "1:708464725936:web:79c6f4857bdbee03281075"
})

const fbAuth = getAuth(fbApp)
const fbDB = getFirestore(fbApp)

fbAuth.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(fbAuth, user => {
      unsubscribe();
      resolve(user);
    }, reject);
  })
}

export {
  fbAuth,
  fbDB,
  fbApp,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  collection,
  query,
  onSnapshot,
  orderBy,
  runTransaction,
  writeBatch,
  limit,
  where
}
