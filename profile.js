import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsRkcy9O4_4ueIi3_2VsujZp-P_mPgUCc",
    authDomain: "geomitra-2026.firebaseapp.com",
    projectId: "geomitra-2026",
    storageBucket: "geomitra-2026.firebasestorage.app",
    messagingSenderId: "972091418735",
    appId: "1:972091418735:web:c1a2474dbe252af093459a",
    measurementId: "G-9NY9LX2MCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, async (user) => {
        console.log("Auth State Changed: ", user); // Debugging

        if (!user) {
            alert("User not logged in. Redirecting...");
            window.location.href = "login.html";
            return;
        }

        try {
            console.log("Fetching Firestore data...");
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log("User data retrieved:", userData);

                document.getElementById("profileName").textContent = `${userData.firstName} `;
                document.getElementById("profileEmail").textContent = userData.email;
                document.getElementById("lastName").textContent = userData.lastName || "N/A";
                document.getElementById("profileLogo").textContent = userData.firstName.charAt(0).toUpperCase();
            } else {
                console.error("User data not found in Firestore");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    });

    // Logout Functionality
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                localStorage.removeItem("loggedInUserId");
                window.location.href = "login.html";
            }).catch(error => {
                console.error("Logout Error:", error);
            });
        });
    }

    // Back Button Function
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "dashboard.html";
        });
    }
});

