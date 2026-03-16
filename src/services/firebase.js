// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCecTDoznhHSRwpGyJpssoC14aRXpW4w0E",
  authDomain: "dgustesaas.firebaseapp.com",
  databaseURL: "https://dgustesaas-default-rtdb.firebaseio.com",
  projectId: "dgustesaas",
  storageBucket: "dgustesaas.firebasestorage.app",
  messagingSenderId: "58596929142",
  appId: "1:58596929142:web:a69c15eab8565361613957"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
