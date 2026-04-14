import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { auth } from "./firebase-service.js";
import { cloneSiteConfig, defaultSiteConfig, getSiteConfig } from "./site-config.js";

let siteConfig = cloneSiteConfig(defaultSiteConfig);
let currentQuestion = 0;
let answers = [];
let timerInterval = null;
let timeLeft = 0;
let violationCount = 0;

const elements = {
    timer: document.getElementById("timer"),
    questionText: document.getElementById("question-text"),
    questionImage: document.getElementById("question-image"),
    answerBox: document.getElementById("answer-box"),
    notesBox: document.getElementById("notes-box"),
    prevButton: document.getElementById("prev-btn"),
    nextButton: document.getElementById("next-btn"),
    submitButton: document.getElementById("submit-btn"),
    resumeModal: document.getElementById("resume-modal"),
    resumePassword: document.getElementById("resume-password")
};

function getQuestions() {
    return siteConfig.questions || cloneSiteConfig(defaultSiteConfig.questions);
}

function syncAnswers() {
    const savedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
    const questions = getQuestions();
    answers = new Array(questions.length).fill("").map((_, index) => savedAnswers[index] || "");
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
}

function saveAnswer() {
    answers[currentQuestion] = elements.answerBox.value.trim();
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
}

function updateQuestionUI() {
    const questions = getQuestions();
    const question = questions[currentQuestion];

    elements.questionText.textContent = `${currentQuestion + 1}. ${question.question}`;
    elements.questionImage.src = question.image || "blank.png";
    elements.questionImage.alt = question.question || "Question Image";
    elements.answerBox.value = answers[currentQuestion] || "";
    elements.notesBox.textContent = question.note || "Answer the question based on the given image and description.";
    elements.prevButton.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {
        elements.nextButton.style.display = "none";
        elements.submitButton.style.display = "inline-block";
    } else {
        elements.nextButton.style.display = "inline-block";
        elements.submitButton.style.display = "none";
    }
}

function nextQuestion() {
    saveAnswer();

    if (currentQuestion < getQuestions().length - 1) {
        currentQuestion += 1;
        updateQuestionUI();
    }
}

function previousQuestion() {
    saveAnswer();

    if (currentQuestion > 0) {
        currentQuestion -= 1;
        updateQuestionUI();
    }
}

function renderTimer() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    elements.timer.textContent = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function submitQuiz(skipConfirmation = false) {
    saveAnswer();
    clearInterval(timerInterval);

    if (!skipConfirmation && !confirm("Are you sure you want to submit the quiz?")) {
        startTimer();
        return;
    }

    localStorage.setItem("quizSubmitted", "true");
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizStartTime");
    window.location.href = "score.html";
}

function startTimer() {
    clearInterval(timerInterval);

    const durationSeconds = Math.max(60, Number(siteConfig.quizDurationMinutes || 120) * 60);
    const now = Math.floor(Date.now() / 1000);
    let startTime = Number(localStorage.getItem("quizStartTime"));

    if (!startTime) {
        startTime = now;
        localStorage.setItem("quizStartTime", String(now));
    }

    timeLeft = durationSeconds - (now - startTime);

    if (timeLeft <= 0) {
        alert("Time's up! Submitting your quiz...");
        submitQuiz(true);
        return;
    }

    renderTimer();

    timerInterval = setInterval(() => {
        timeLeft -= 1;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting your quiz...");
            submitQuiz(true);
            return;
        }

        renderTimer();
    }, 1000);
}

function handleViolation() {
    violationCount += 1;
    elements.resumeModal.style.display = "flex";

    if (violationCount === 1) {
        alert("Quiz paused. Enter the resume password to continue.");
    }
}

window.verifyResumePassword = function () {
    const enteredPassword = elements.resumePassword.value.trim();

    if (enteredPassword === siteConfig.resumePassword) {
        elements.resumeModal.style.display = "none";
        elements.resumePassword.value = "";
        violationCount = 0;
        return;
    }

    alert("Incorrect password. You cannot resume the quiz.");
    elements.resumePassword.value = "";
};

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        handleViolation();
    }
});

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    alert("Right-click is disabled during the quiz.");
});

document.addEventListener("copy", (event) => {
    event.preventDefault();
    alert("Copying content is disabled during the quiz.");
});

document.addEventListener("paste", (event) => {
    event.preventDefault();
    alert("Pasting content is disabled during the quiz.");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === "I")) {
        event.preventDefault();
        alert("Developer tools are disabled during the quiz.");
    }
});

elements.nextButton.addEventListener("click", nextQuestion);
elements.prevButton.addEventListener("click", previousQuestion);
elements.submitButton.addEventListener("click", () => submitQuiz(false));

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    localStorage.setItem("loggedInUserId", user.uid);
    siteConfig = await getSiteConfig();
    syncAnswers();
    updateQuestionUI();
    startTimer();
});
