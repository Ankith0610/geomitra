// âœ… Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// âœ… Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsRkcy9O4_4ueIi3_2VsujZp-P_mPgUCc",
    authDomain: "geomitra-2026.firebaseapp.com",
    projectId: "geomitra-2026",
    storageBucket: "geomitra-2026.firebasestorage.app",
    messagingSenderId: "972091418735",
    appId: "1:972091418735:web:c1a2474dbe252af093459a",
    measurementId: "G-9NY9LX2MCC"
};

// âœ… Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// âœ… Event Listener to Add Team Member
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitTeam);
    }
});

// âœ… Add Team Member
async function submitTeam(event) {
    event.preventDefault(); // Prevent form refresh

    const name = document.getElementById("teamName").value.trim();
    const usn = document.getElementById("teamUSN").value.trim();
    const userId = localStorage.getItem('loggedInUserId');

    if (!userId) {
        alert("Please login first!");
        return;
    }

    if (!name || !usn) {
        alert("Please fill in both fields.");
        return;
    }

    try {
        const teamRef = collection(db, "users", userId, "teams");
        const existingMembers = await getDocs(teamRef);

        // âœ… Check if one member already exists
        if (existingMembers.size >= 1) {
            alert("Only one team member can be added.");
            hideAddTeamSection();
            return;
        }

        // âœ… Add team member if not existing
        await addDoc(teamRef, { name, usn });
        alert("Team Member Added Successfully!");

        // Clear input fields
        document.getElementById("teamName").value = "";
        document.getElementById("teamUSN").value = "";

        // Refresh and Hide Form
        loadTeams();
        hideAddTeamSection();

    } catch (error) {
        console.error("Error adding team member: ", error);
        alert("Failed to add team member.");
    }
}

// âœ… Load Team Members and Main User
async function loadTeams() {
    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) return;

    const teamList = document.getElementById("teamList");
    teamList.innerHTML = ""; // Clear list

    // âœ… Load Main User
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const mainUserLi = document.createElement("li");
        mainUserLi.innerHTML = `<strong>${userData.firstName} (${userData.usn}) (Main User)</strong>`;
        teamList.appendChild(mainUserLi);
    }

    // âœ… Load Team Members
    const teamRef = collection(db, "users", userId, "teams");
    const querySnapshot = await getDocs(teamRef);

    // âœ… Hide Add Button if already 1 member exists
    if (querySnapshot.size >= 1) {
        hideAddTeamSection();
    } else {
        showAddTeamSection();
    }

    // âœ… Render members
    querySnapshot.forEach((docSnap) => {
        const teamData = docSnap.data();
        const li = document.createElement("li");
        li.textContent = `${teamData.name} (${teamData.usn})`;

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "âŒ";
        deleteBtn.classList.add("delete");
        deleteBtn.onclick = () => deleteTeamMember(userId, docSnap.id);

        li.appendChild(deleteBtn);
        teamList.appendChild(li);
    });
}

// âœ… Hide Add Button + Form
function hideAddTeamSection() {
    const addBtn = document.getElementById("addTeamBtn");
    const inputBox = document.getElementById("inputBox");
    const container = document.querySelector(".container"); // âœ… Get container div

    if (addBtn) addBtn.style.display = "none";
    if (inputBox) inputBox.style.display = "none";
    if (container) container.style.display = "none"; // âœ… Hide full container
}


// âœ… Show Add Button + Form
function showAddTeamSection() {
    const addBtn = document.getElementById("addTeamBtn");
    const inputBox = document.getElementById("inputBox");
    if (addBtn) addBtn.style.display = "block";
    if (inputBox) inputBox.style.display = "none"; // Keep form hidden until "Add Team" clicked
}

// âœ… Delete Member
async function deleteTeamMember(userId, teamId) {
    if (confirm("Are you sure you want to delete this team member?")) {
        await deleteDoc(doc(db, "users", userId, "teams", teamId));
        alert("Team Member Deleted!");
        loadTeams(); // Refresh list
        showAddTeamSection(); // Allow to add again
    }
}

// âœ… Auto Load Data when logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem('loggedInUserId', user.uid);
        loadTeams(); // Load data
    } else {
        alert("Please log in to access this page.");
        window.location.href = "index.html"; // Redirect to login
    }
});

