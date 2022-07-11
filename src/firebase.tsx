import firebase from "firebase/app";
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

const devFirebaseConfig = {
  apiKey: "AIzaSyBhKuSCJuDF0RDVoaDXEbmRkQK3q9Dj1p8",
  authDomain: "kixlab-surch.firebaseapp.com",
  projectId: "kixlab-surch",
  storageBucket: "kixlab-surch.appspot.com",
  messagingSenderId: "110197931712",
  appId: "1:110197931712:web:177e8f8586387e3a277725",
  measurementId: "G-0MG5CWS0WD",
};

const labelingFirebaseConfig = {
  apiKey: "AIzaSyBaGWRUFXnBMn6hnk1urnGgiprz3szp5EQ",
  authDomain: "surch-labeling.firebaseapp.com",
  projectId: "surch-labeling",
  storageBucket: "surch-labeling.appspot.com",
  messagingSenderId: "245048790207",
  appId: "1:245048790207:web:1f4f746e4329dd11168a0a",
  measurementId: "G-HRZQTN4VGR",
};

const firebaseConfig = {
  apiKey: "AIzaSyDF-WnJ8tpns_uBQABDdauZmaTsvkwHJ-8",
  authDomain: "kixlab-surch-music.firebaseapp.com",
  projectId: "kixlab-surch-music",
  storageBucket: "kixlab-surch-music.appspot.com",
  messagingSenderId: "573754089129",
  appId: "1:573754089129:web:009d3feb7fe860e7e853b8",
  measurementId: "G-C7KXD5505L",
};

// firebase.initializeApp(devFirebaseConfig);
firebase.initializeApp(labelingFirebaseConfig);
// firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
// export const firestore = firebase.firestore();
// var db = firebase.firestore();

export default firebase;
