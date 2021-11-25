import firebase from "firebase/app";
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

const firebaseConfig_old = {
  apiKey: "AIzaSyDUEzme_wp01pss9CcD8TEmvrNkbkbEb1Y",
  authDomain: "kixlab-music.firebaseapp.com",
  projectId: "kixlab-music",
  storageBucket: "kixlab-music.appspot.com",
  messagingSenderId: "1022438807541",
  appId: "1:1022438807541:web:3d32f559ac72c1f710b2bc",
};

const firebaseConfig = {
  apiKey: "AIzaSyBhKuSCJuDF0RDVoaDXEbmRkQK3q9Dj1p8",
  authDomain: "kixlab-surch.firebaseapp.com",
  projectId: "kixlab-surch",
  storageBucket: "kixlab-surch.appspot.com",
  messagingSenderId: "110197931712",
  appId: "1:110197931712:web:177e8f8586387e3a277725",
  measurementId: "G-0MG5CWS0WD",
};

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
// export const firestore = firebase.firestore();
// var db = firebase.firestore();

export default firebase;
