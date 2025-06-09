// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importa getAuth

// Tu configuración de Firebase (ahora con los valores reales)
const firebaseConfig = {
  apiKey: "AIzaSyBqzusGFxxTms_i-xdB-9vNa2dqB08ZsFo", // <-- ¡Este es el real!
  authDomain: "barberia-artear.firebaseapp.com", // <-- ¡Este es el real!
  projectId: "barberia-artear",
  storageBucket: "barberia-artear.firebasestorage.app",
  messagingSenderId: "238753993674",
  appId: "1:238753993674:web:ffd460b496b5d8c4c27533",
  measurementId: "G-87BT1RJ071" // Este es para Analytics, no es estrictamente necesario para Auth/Firestore
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // No necesitas getAnalytics si no lo usas

// Inicializa Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app); // Exporta la instancia de Auth