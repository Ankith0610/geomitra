import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { auth } from "./firebase-service.js";
import { getSiteOwnershipState } from "./site-config.js";

const sidebar = document.getElementById("sidebar");
const adminMenuItem = document.getElementById("adminMenuItem");
const adminMenuLink = document.getElementById("adminMenuLink");
const ownerBadge = document.getElementById("ownerBadge");
const dashboardMessage = document.getElementById("dashboardMessage");
const quizTitle = document.getElementById("geomitraquiz");
const quizDate = document.getElementById("quizDate");
const quizTime = document.getElementById("quizTime");
const quizHint = document.getElementById("quizHint");

window.toggleSidebar = function () {
    if (!sidebar) {
        return;
    }

    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-250px";
    } else {
        sidebar.style.right = "0px";
    }
};

window.redirectToLogin = async function () {
    localStorage.removeItem("loggedInUserId");

    try {
        await signOut(auth);
    } catch (error) {
        console.error("Unable to sign out cleanly:", error);
    }

    window.location.href = "login.html";
};

window.redirectToProfile = function () {
    window.location.href = "profile.html";
};

const closeButton = document.getElementById("closeSidebarButton");
if (closeButton) {
    closeButton.addEventListener("click", window.toggleSidebar);
}

const menuButton = document.getElementById("menuButton");
if (menuButton) {
    menuButton.addEventListener("click", window.toggleSidebar);
}

const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
    logoutLink.addEventListener("click", async (event) => {
        event.preventDefault();
        await window.redirectToLogin();
    });
}

document.getElementById("startQuizBtn").addEventListener("click", () => {
    localStorage.setItem("quizStarted", "true");
    window.location.href = "start-quiz.html";
});

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    localStorage.setItem("loggedInUserId", user.uid);

    const ownership = await getSiteOwnershipState(user);
    const { config, isOwner, canClaimOwner } = ownership;

    dashboardMessage.textContent = config.dashboardMessage;
    quizTitle.textContent = config.eventTitle;
    quizDate.textContent = config.quizDate;
    quizTime.textContent = config.quizTime;

    if (isOwner) {
        ownerBadge.hidden = false;
        quizHint.textContent = "Open the menu to manage the live quiz content from the Admin Panel.";
    } else if (canClaimOwner) {
        ownerBadge.hidden = false;
        ownerBadge.textContent = "No owner set yet. Open the menu to claim admin access.";
        quizHint.textContent = "The first signed-in owner can claim the Admin Panel from the menu.";
    } else {
        ownerBadge.hidden = true;
        quizHint.textContent = "Use the menu to manage your team and profile.";
    }

    if (isOwner || canClaimOwner) {
        adminMenuItem.hidden = false;
        adminMenuLink.textContent = isOwner ? "Admin Panel" : "Claim Admin Access";
    } else {
        adminMenuItem.hidden = true;
    }
});

