import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Configurações extraídas do seu código inicial
const firebaseConfig = {
  apiKey: "AIzaSyCecTDoznhHSRwpGyJpssoC14aRXpW4w0E",
  authDomain: "dgustesaas.firebaseapp.com",
  projectId: "dgustesaas",
  storageBucket: "dgustesaas.firebasestorage.app",
  messagingSenderId: "58596929142",
  appId: "1:58596929142:web:a69c15eab8565361613957",
  databaseURL: "https://dgustesaas-default-rtdb.firebaseio.com" // Pego pelo print da URL
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Instâncias
export const auth = getAuth(app);
export const db = getDatabase(app); // Note que agora exportamos getDatabase
export const storage = getStorage(app);
