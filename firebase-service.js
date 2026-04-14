import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsRkcy9O4_4ueIi3_2VsujZp-P_mPgUCc",
    authDomain: "geomitra-2026.firebaseapp.com",
    projectId: "geomitra-2026",
    storageBucket: "geomitra-2026.firebasestorage.app",
    messagingSenderId: "972091418735",
    appId: "1:972091418735:web:c1a2474dbe252af093459a",
    measurementId: "G-9NY9LX2MCC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, firebaseConfig };
