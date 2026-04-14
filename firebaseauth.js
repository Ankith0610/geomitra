// Import Firebase SDKs
import { auth, db } from "./firebase-service.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } 
 from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getSiteConfig } from "./site-config.js";

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isAllowedEmail(email, domain) {
    if (!domain) {
        return true;
    }

    const pattern = new RegExp(`^[a-zA-Z0-9._%+-]+@${escapeRegExp(domain)}$`, "i");
    return pattern.test(email);
}

async function getAllowedEmailDomain() {
    try {
        const config = await getSiteConfig(true);
        return config.allowedEmailDomain || "nmamit.in";
    } catch (error) {
        console.error("Unable to load the allowed email domain:", error);
        return "nmamit.in";
    }
}

// âœ… Function to display messages
function showMessage(message, divId, color = "red") {
    var messageDiv = document.getElementById(divId);
    if (!messageDiv) return;
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.color = color;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// âœ… Register User Function
document.getElementById('submitSignUp')?.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('rEmail').value.trim();
    const password = document.getElementById('rPassword').value.trim();
    const firstName = document.getElementById('fName').value.trim();
    const lastName = document.getElementById('lName').value.trim();
    const usn = document.getElementById('usn').value.trim();
    const allowedDomain = await getAllowedEmailDomain();

    if (!isAllowedEmail(email, allowedDomain)) {
        showMessage(`Only @${allowedDomain} email addresses are allowed.`, 'signUpMessage');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return setDoc(doc(db, "users", user.uid), {
                email: email,
                firstName: firstName,
                lastName: lastName,
                usn: usn,
                createdAt: new Date().toISOString()
            });
        })
        .then(() => {
            showMessage('Registration successful! Please sign in.', 'signUpMessage', 'green');
            setTimeout(() => window.location.href = 'login.html', 2000); // Redirect after 2s
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'signUpMessage');
            } else {
                showMessage('Unable to create user: ' + error.message, 'signUpMessage');
            }
        });
});

// âœ… Login Function
document.getElementById('submitSignIn')?.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const allowedDomain = await getAllowedEmailDomain();

    if (!isAllowedEmail(email, allowedDomain)) {
        showMessage(`Only @${allowedDomain} email addresses are allowed.`, 'signInMessage');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            localStorage.setItem('loggedInUserId', userCredential.user.uid);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist: ' + error.message, 'signInMessage');
            }
        });
});

// âœ… Recover Password Function
async function recoverPassword() {
    const emailInput = document.getElementById("recoverEmail");
    const message = document.getElementById("recoverMessage");

    if (!emailInput) return;

    const email = emailInput.value.trim();
    const allowedDomain = await getAllowedEmailDomain();

    if (!email) {
        message.textContent = "Please enter your email.";
        message.style.color = "red";
        return;
    }

    if (!isAllowedEmail(email, allowedDomain)) {
        message.textContent = `Only @${allowedDomain} email addresses are allowed.`;
        message.style.color = "red";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            message.textContent = "Password reset link sent! Check your email.";
            message.style.color = "green";
        })
        .catch((error) => {
            message.textContent = "Error: " + error.message;
            message.style.color = "red";
        });
}

// âœ… Password Visibility Toggle
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", function () {
            let input = this.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                this.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                this.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    // Attach recover password function to button
    document.getElementById("recoverBtn")?.addEventListener("click", recoverPassword);
});

