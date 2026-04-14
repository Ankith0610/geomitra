import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { auth } from "./firebase-service.js";
import {
    cloneSiteConfig,
    defaultSiteConfig,
    getSiteOwnershipState,
    saveSiteConfig
} from "./site-config.js";

let currentUser = null;
let activeConfig = cloneSiteConfig(defaultSiteConfig);

const adminStatus = document.getElementById("adminStatus");
const claimSection = document.getElementById("claimSection");
const claimMessage = document.getElementById("claimMessage");
const claimOwnerButton = document.getElementById("claimOwnerButton");
const lockedSection = document.getElementById("lockedSection");
const lockedMessage = document.getElementById("lockedMessage");
const adminForm = document.getElementById("adminForm");
const questionsContainer = document.getElementById("questionsContainer");
const ownerEmail = document.getElementById("ownerEmail");
const updatedAt = document.getElementById("updatedAt");

document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

document.getElementById("logoutButton").addEventListener("click", async () => {
    localStorage.removeItem("loggedInUserId");
    await signOut(auth);
    window.location.href = "login.html";
});

document.getElementById("addQuestionButton").addEventListener("click", () => {
    renderQuestionCards([
        ...readQuestionsFromForm(),
        {
            question: "",
            image: "blank.png",
            note: ""
        }
    ]);
});

document.getElementById("resetDefaultsButton").addEventListener("click", () => {
    if (!confirm("Reset the admin form back to the current built-in defaults?")) {
        return;
    }

    activeConfig = cloneSiteConfig(defaultSiteConfig);
    populateForm(activeConfig);
    setStatus("Loaded the built-in defaults into the form. Save if you want to publish them.", false);
});

claimOwnerButton.addEventListener("click", async () => {
    await saveFromForm(true);
});

adminForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveFromForm(false);
});

questionsContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-btn");

    if (!removeButton) {
        return;
    }

    const cards = Array.from(document.querySelectorAll(".question-card"));

    if (cards.length === 1) {
        alert("At least one question is required.");
        return;
    }

    removeButton.closest(".question-card").remove();
    updateQuestionHeadings();
});

function setStatus(message, isError) {
    adminStatus.textContent = message;
    adminStatus.style.color = isError ? "#9e132b" : "#213364";
}

function formatUpdatedAt(value) {
    if (!value) {
        return "Not yet saved";
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function updateQuestionHeadings() {
    Array.from(document.querySelectorAll(".question-card")).forEach((card, index) => {
        const heading = card.querySelector("h3");

        if (heading) {
            heading.textContent = `Question ${index + 1}`;
        }
    });
}

function createQuestionCard(question, index) {
    const card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML = `
        <div class="question-card-header">
            <h3>Question ${index + 1}</h3>
            <button type="button" class="remove-btn">Remove</button>
        </div>
        <label>
            Question Text
            <textarea class="question-text" rows="3"></textarea>
        </label>
        <label>
            Image File Name
            <input class="question-image" type="text" placeholder="blank.png">
        </label>
        <label>
            Guidance / Notes
            <textarea class="question-note" rows="6"></textarea>
        </label>
    `;

    card.querySelector(".question-text").value = question.question || "";
    card.querySelector(".question-image").value = question.image || "blank.png";
    card.querySelector(".question-note").value = question.note || "";

    return card;
}

function renderQuestionCards(questions) {
    questionsContainer.innerHTML = "";
    questions.forEach((question, index) => {
        questionsContainer.appendChild(createQuestionCard(question, index));
    });
    updateQuestionHeadings();
}

function populateForm(config) {
    document.getElementById("eventTitle").value = config.eventTitle || "";
    document.getElementById("dashboardMessage").value = config.dashboardMessage || "";
    document.getElementById("quizDate").value = config.quizDate || "";
    document.getElementById("quizTime").value = config.quizTime || "";
    document.getElementById("quizDurationMinutes").value = config.quizDurationMinutes || 120;
    document.getElementById("allowedEmailDomain").value = config.allowedEmailDomain || "";
    document.getElementById("quizPassword").value = config.quizPassword || "";
    document.getElementById("resumePassword").value = config.resumePassword || "";
    document.getElementById("instructionsText").value = (config.instructions || []).join("\n");
    ownerEmail.textContent = config.ownerEmail || "Not assigned";
    updatedAt.textContent = formatUpdatedAt(config.updatedAt);

    renderQuestionCards(config.questions || cloneSiteConfig(defaultSiteConfig.questions));
}

function readQuestionsFromForm() {
    return Array.from(document.querySelectorAll(".question-card"))
        .map((card) => ({
            question: card.querySelector(".question-text").value.trim(),
            image: card.querySelector(".question-image").value.trim() || "blank.png",
            note: card.querySelector(".question-note").value.trim()
        }))
        .filter((question) => question.question);
}

function readFormConfig() {
    const instructions = document.getElementById("instructionsText")
        .value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

    const questions = readQuestionsFromForm();

    return {
        eventTitle: document.getElementById("eventTitle").value.trim(),
        dashboardMessage: document.getElementById("dashboardMessage").value.trim(),
        quizDate: document.getElementById("quizDate").value.trim(),
        quizTime: document.getElementById("quizTime").value.trim(),
        quizDurationMinutes: Number(document.getElementById("quizDurationMinutes").value.trim()),
        allowedEmailDomain: document.getElementById("allowedEmailDomain").value.trim(),
        quizPassword: document.getElementById("quizPassword").value.trim(),
        resumePassword: document.getElementById("resumePassword").value.trim(),
        instructions,
        questions
    };
}

async function saveFromForm(isClaimAction) {
    if (!currentUser) {
        alert("Please sign in again to continue.");
        window.location.href = "login.html";
        return;
    }

    const formConfig = readFormConfig();

    if (!formConfig.questions.length) {
        alert("Please keep at least one question in the quiz.");
        return;
    }

    if (!formConfig.instructions.length) {
        alert("Please add at least one instruction.");
        return;
    }

    try {
        setStatus(isClaimAction ? "Claiming owner access..." : "Saving admin changes...", false);
        const savedConfig = await saveSiteConfig(formConfig, currentUser);
        activeConfig = savedConfig;
        populateForm(savedConfig);
        claimSection.hidden = true;
        adminForm.hidden = false;
        lockedSection.hidden = true;

        setStatus(
            savedConfig.justClaimedOwner
                ? "Owner access claimed successfully. This account can now manage the website."
                : "Admin changes saved successfully.",
            false
        );
    } catch (error) {
        console.error(error);
        setStatus(error.message || "Unable to save the admin settings.", true);
        alert(error.message || "Unable to save the admin settings.");
    }
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;
    localStorage.setItem("loggedInUserId", user.uid);

    const ownership = await getSiteOwnershipState(user);
    activeConfig = ownership.config;
    populateForm(activeConfig);

    if (ownership.isOwner) {
        claimSection.hidden = true;
        lockedSection.hidden = true;
        adminForm.hidden = false;
        setStatus(`Signed in as owner: ${user.email}`, false);
        return;
    }

    if (ownership.canClaimOwner) {
        claimSection.hidden = false;
        lockedSection.hidden = true;
        adminForm.hidden = false;
        claimMessage.textContent = `No owner is set yet. Saving here will make ${user.email} the owner of this website.`;
        setStatus("No owner found yet. Save once to claim owner access for this account.", false);
        return;
    }

    adminForm.hidden = true;
    claimSection.hidden = true;
    lockedSection.hidden = false;
    lockedMessage.textContent = `This website is currently owned by ${ownership.config.ownerEmail || "another account"}. Sign in with the owner account to continue.`;
    setStatus("This account does not have admin access.", true);
});
