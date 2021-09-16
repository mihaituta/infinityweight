// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore, collection, getDocs, addDoc, setDoc, getDoc, doc} from 'firebase/firestore'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

// Initialize Firebase
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAAadtu6R14A7QVs-lyYNWDwCshioOdnD0",
  authDomain: "infinityweight-35abe.firebaseapp.com",
  projectId: "infinityweight-35abe",
  storageBucket: "infinityweight-35abe.appspot.com",
  messagingSenderId: "708464725936",
  appId: "1:708464725936:web:79c6f4857bdbee03281075"
})

const fbAuth = getAuth(firebaseApp)
const fbDB = getFirestore(firebaseApp)

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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  addDoc,
  setDoc,
  getDoc,
  doc,
  collection,
}
