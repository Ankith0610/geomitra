import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { auth } from "./firebase-service.js";
import { getSiteConfig } from "./site-config.js";

let currentQuizPassword = "20250322";

function updateMeta(config) {
    const quizMeta = document.getElementById("quizMeta");
    if (!quizMeta) {
        return;
    }

    quizMeta.textContent = `${config.eventTitle} | ${config.quizDate} | ${config.quizTime}`;
}

function verifyPassword() {
    const enteredPassword = document.getElementById("quizPassword").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (enteredPassword === currentQuizPassword) {
        window.location.href = "quiz.html";
        return;
    }

    errorMessage.textContent = "Incorrect password! Try again.";
}

document.getElementById("startQuizButton").addEventListener("click", verifyPassword);
document.getElementById("quizPassword").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        verifyPassword();
    }
});

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    localStorage.setItem("loggedInUserId", user.uid);
    const config = await getSiteConfig();
    currentQuizPassword = config.quizPassword;
    updateMeta(config);
});
