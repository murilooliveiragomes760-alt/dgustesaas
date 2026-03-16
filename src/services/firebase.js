// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEH9m7zuCtld-XopVKuKRFBlUTsq_DbyM",
  authDomain: "dgusteapp.firebaseapp.com",
  projectId: "dgusteapp",
  storageBucket: "dgusteapp.firebasestorage.app",
  messagingSenderId: "67623445130",
  appId: "1:67623445130:web:54e746782c0b53aba44373"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
