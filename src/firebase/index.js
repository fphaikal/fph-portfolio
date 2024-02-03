// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvlJYfskzZzX4Y3Rl_p-ZQjq7izTFSr5Y",
  authDomain: "fphaikal-70d7c.firebaseapp.com",
  databaseURL: "https://fphaikal-70d7c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fphaikal-70d7c",
  storageBucket: "fphaikal-70d7c.appspot.com",
  messagingSenderId: "823682865750",
  appId: "1:823682865750:web:fa7fb42624fd9a547d39f7",
  measurementId: "G-RG5K1RDDZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };