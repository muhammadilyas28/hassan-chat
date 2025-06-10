// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzq8RIVsh_CXlduDyGbqjvDuU3iomGxLM",
  authDomain: "sypchat-2eb4f.firebaseapp.com",
  projectId: "sypchat-2eb4f",
  storageBucket: "sypchat-2eb4f.firebasestorage.app",
  messagingSenderId: "681016324843",
  appId: "1:681016324843:web:dfcce1a01ae86a756ec4ae",
  measurementId: "G-7J9DER1LQN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };