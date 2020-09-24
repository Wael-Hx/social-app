import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: "***",
  authDomain: "***",
  databaseURL: "***",
  projectId: "****",
  storageBucket: "***",
  messagingSenderId: "***",
  appId: "*****",
  measurementId: "*****",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
