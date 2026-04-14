let currentQuestion = 0;
const totalQuestions = 11;
let answers = JSON.parse(localStorage.getItem("quizAnswers")) || new Array(totalQuestions).fill("");
let timerDuration = 2 * 60 * 60; // 2 hours in seconds
let timerInterval;
let tabSwitchCount = 0;
 // Minimum height allowed
let violationCount = 0; // Unified counter for tab switch + resize
const maxViolations = 1; // Max allowed violations before auto-submission
// Questions & Notes Data
const questions = [
    {
        question: "A = Number of quadrants in a Two-Dimensional Cartesian plane",
        image: "blank.png",
    },
    {
        question: "B = Area of shaded region in the given figure :",
        image: "GM_Image_01.png",
    },
    {
        question: "C = LCM(7,4).",
        image: "blank.png",
    },
    {
        question: "D = Number of overs in an innings of a T20 match",
        image: "blank.png",
    },
    {
        question: "E = ( 1 + 5 / 2 )",
        image: "blank.png",
    },
    {
        question: "F = Age at which you get the Right to Vote in India",
        image: "blank.png",
    },
    {
        question:"G = Number of months in a calender year having the number of days greater than or equal to 30 ",
        image: "GM_Image_02.png",
    },
    {
        question: "H = Determinant of the following matrix",
        image: "GM_Image_03.png",
    },
    {
        question: "I = The resistance between points A and B",
        image: "GM_Image_04.png",
    },
    {
        question: "J = Perimeter of the circle of Radius 4/π",
        image: "GM_Image_05.png",
    },
    {
        question: "Hints contined...",
        image: "GM_Image_06.png",
    },
];


const notes = [
   "Keep Your grid sheets in portrait position\nMark X axis from left to right and Y axis from down to up at the border of the grid sheet\n The bottom left corner will be the origin (0,0) \n Draw the horizontal line L0 at y=A \n Let Series P=0, 0, 1, 1, 2, 2..... and Series Q= 4, 5.5, 7, 8.5, 10, 11.5..... \nPlot and join the points (P1,Q1), (P2,Q2), (P3,Q3),.....till (P12,Q12) \nHint: ( P1 , Q1 ) = ( 0 , 4 ) and ( P12 , Q12) = ( 5 , 20.5)",
    "",
    "",
    "",
    "",
    "",
    "Draw a line joining the following points: \nL1 = ( B , C ) to ( 15.5 , C ) \nL2 = ( 15.5 , C ) to ( D , A ) \nL3 = ( E , A ) to ( 5.5 , F ) \nL4 = ( G , A) to ( G , C ) \nL5 = From the point ( 5.5 , F ) \nDraw a line towards positive X-axis (Right) till it intersects the line L2 \nDraw 12 lines upwards (Till the top end) from L1 parallel to Y-axis (Vertical) at all the following points as shown above \nx= 6, 8, 8.5, 9, 9.75, 10, 10.75, 11.5, 12.5, 13.5, 14.5, 15 \nJoin (6,35.5) to (15,35.5)  \nAlso join (6, 37.5) to (15, 37.5) \nInside the quadrilateral made of lines L0, L3, L4 and L5, join the following points (Vertical lines)\n( 6.5 , F ) to ( 5 , A ); \n( 8 , F ) to ( 7 , A );\n( 9 , F ) to ( 8 , A ) ; \n( 10 , F ) to ( 9 , A ) \nInside the quadrilateral made of lines L0, L1, L2 and L4, join the following points (Vertical lines) ( 11.5 , C ) to ( 12 , A ) ; \n( 12 , C ) to ( 13 , A ) ;\n( 13 , C ) to ( 14.5 , A ) ; \n( 13.5 , C ) to ( 15.5 , A ) ;\n( 14 , C ) to ( 16.5 , A ) ; \n( 14.5 , C ) to ( 18 , A ) ;\n( 15 , F ) to ( 19 , A ) \nBetween the lines L2 and L3, draw 5 Horizontal lines at following Y values: \n5.5, 8, 10.5, 13, 15.5 \nExtend the 15.5 line till ( 19 , 15.5 ) \nBetween the lines L2 and L4, draw 3 Horizontal lines at following Y values: 22.5, 25, 26.5",
    "",
    "",
    "Join the following points in order \ni. ( 8.5 , F ) → ( 7.5 , 23.5 ) → ( 9 , I ) → ( J , C ) → ( 8.5 , C ) → ( 9.5 , I ) → ( J , 23.5 ) → ( 9 , F ) → ( H , D ) → ( 9.5 , I ) \nii. ( J , 23.5 ) → ( 1 , 23.5 ) → ( E , 27.5 ) → Extend it towards Right (positive Xaxis) till it intersects any line \niii. ( 2 , 25 ) → ( 7 , 25 ) → ( J , I ) → ( 7.5 , 26.5 ) → Extend it towards Left (negative X- axis) till it intersects any line \niv. ( 7.5 , 25.5 ) → ( 7 , I ) → Extend it towards Left (negative X- axis) till it intersects any line \nv. ( 19 , 15.5 ) → ( 17.5 , 23.5 ) → Extend it towards Left (negative X- axis) till it intersects any line \nvi. ( 0 , 24 ) → ( 4.5 , 30 ) → ( 5.5 , 34.5 ) → ( 5.5 , 40 ) \nvii. ( 0 , 33.5 ) → ( 2.5 , 35 ) → ( E , 40 ) \nJoin the following ( 5.5 , 26.5 ) → ( 5 , 25 ) ; \n( 6 , 26.5 ) → ( 5.5 , 25 ) ; \n( 3 , 23 ) → ( 0 , 14.5 ) ; \n( 0 , 10 ) → ( 3.5 , 20.5 ) ;\n( 4.5 , 23 ) → ( 5.5 , 18 ) ; \n( 1 , 23.5 ) → ( 2 , 20 ) ;\n( 5 , 20.5 ) → ( 2 , 20.5 ) ; \n( 6.5 , 18 ) → ( 5.5 , 22.5 ) ;\n( 5.5 , 22.5 ) → 2.2 cm line towards Right ( Positive X-axis) ;\n( 7.5 , 23 ) → 6.4 cm line towards Left ( Negative X-axis) ;\n( 4 , 17.5 ) → ( 2.5 , 17.5 ) ; \n( 3 , 14.5 ) → ( 1.5 , 14.5 ) ;\n( 2 , 11.5 ) → ( 0.5 , 11.5 ) ; \n( 1 , 8.5 ) → ( 0 , 8.5 ) \nDraw lines towards Bottom-Right direction with angle 290°(-70°) from the following points till it touches L3 (or L0) \n( 1 , 7 ) , ( 1 , 8.5 ) , ( 2 , 10 ) , ( 2 , 11.5 ) , ( 3 , 13 ) , ( 3 , 14.5 ) , ( 4 , 16 ) , ( 4 , 17.5 ) , ( 5 , 19 ) \nDraw 1.5 cm lines to the right of the following points parallel to the X axis: \n( 6, 29 ), ( 6, 30 ), ( 6, 31 ), ( 6, 32 ), ( 6, 33 ), ( 6, 34 ), ( 6, 35 ), ( 6, 36 ), ( 6, 37 ) \nJoin ( 7.5 , 28 ) → ( 8 , 28.5 ) → ( 7.5 , 29 ) \n( 7.5 , 30 ) → ( 8 , 30.5 ) → ( 7.5 , 31 ) \n( 7.5 , 32 ) → ( 8 , 32.5 ) → ( 7.5 , 33 ) \n( 7.5 , 34 ) → ( 8 , 34.5 ) → ( 7.5 , 35 ) \n( 7.5 , 36 ) → ( 7.5, 37 ) \n( 11.5 , 34 ) → ( 12.5, 34 ) ; \n( 13.5 , 34 ) → ( 14.5, 34 ) ;\n( 11.5 , 32.5 ) → ( 12.5, 32.5 ) ; \n( 13.5 , 32.5 ) → ( 14.5, 32.5 ) ;\n( 11.5 , 31 ) → ( 12.5, 31 ) ; \n( 13.5 , 31 ) → ( 14.5, 31 ) ;\n( 11.5 , 29.5 ) → ( 12.5, 29.5 ) ; \n( 13.5 , 29.5 ) → ( 14.5, 29.5 ) \nAbove L1, Between the lines at x=9 and x=9.75, draw horizontal lines for every 0.5 cm (on grid) \nRepeat the same between the lines x=10 and x=10.75 \nThe pattern obtained should look like shown above \n" ,
    "As diagram shown above, draw and shade windows of 0.5 cm thickness between the following Vertical lines and do not place the windows adjacent to Horizontal lines \nBetween the lines starting at ( 5 , A ) and ( 7 , A ) \nBetween the lines starting at ( 9 , A ) and ( 11 , A ) \nBetween the lines starting at ( 13 , A ) and ( 14.5 , A ) \nBetween the lines starting at ( 16.5 , A ) and ( 18 , A ) \nNote: The dotted lines are 0.5 cm apart \nShade the area made up of the polygon with vertices: \n( 3.5 , 27.5 ) , ( 3 , 26.5 ) , ( 7.5 , 26.5 ) , ( 8 , 26 ) , ( 7 , 25 ) , ( 2 , 25 ), ( 1 , 23.5 ) , ( 7.5 , 23.5 ) , ( 9 ,26 ) , ( 8 , 27.5 )",

];

// Save Answer Before Moving
function saveAnswer() {
    const answerBox = document.getElementById("answer-box");
    if (answerBox) {
        answers[currentQuestion] = answerBox.value.trim();
        localStorage.setItem("quizAnswers", JSON.stringify(answers));
    }
}

// Update UI Correctly
function updateQuestionUI() {
    document.getElementById("question-text").innerText = `${currentQuestion + 1}. ${questions[currentQuestion].question}`;

    // ✅ Dynamically update the question image
    const questionImage = document.getElementById("question-image");
    questionImage.src = questions[currentQuestion].image;
    questionImage.alt = "Question Image";

    document.getElementById("answer-box").value = answers[currentQuestion] || "";
    document.getElementById("notes-box").innerText = notes[currentQuestion];

    document.getElementById("prev-btn").disabled = currentQuestion === 0;

    if (currentQuestion === totalQuestions - 1) {
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("submit-btn").style.display = "inline-block";
    } else {
        document.getElementById("next-btn").style.display = "inline-block";
        document.getElementById("submit-btn").style.display = "none";
    }
}


// Move to Next Question
function nextQuestion() {
    saveAnswer();
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        updateQuestionUI();
    }
}

// Move to Previous Question
function prevQuestion() {
    saveAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        updateQuestionUI();
    }
}

// Timer Function
function startTimer(duration) {
    let startTime = localStorage.getItem("quizStartTime");
    let currentTime = Math.floor(Date.now() / 1000);
    let timeLeft;

    if (startTime) {
        timeLeft = duration - (currentTime - parseInt(startTime));
        if (timeLeft <= 0) {
            timeLeft = 0;
            alert("Time's up! Submitting your quiz...");
            submitQuiz();
            return;
        }
    } else {
        localStorage.setItem("quizStartTime", currentTime);
        timeLeft = duration;
    }

    function updateTimerDisplay() {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timer").textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTimerDisplay(); // Update display initially

    let timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting your quiz...");
            submitQuiz();
        } else {
            updateTimerDisplay();
        }
    }, 1000);
} 



// Submit Quiz
function submitQuiz() {
    saveAnswer();
    clearInterval(timerInterval); // Stop timer when submitting

   // if (answers.includes("")) {
    //    alert("Please answer all questions before submitting!");
     //   return;
   // }

    console.log("Submit button function called!"); // Debugging

    if (confirm("Are you sure you want to submit the quiz?")) {
        console.log("User confirmed submission");

        localStorage.setItem("quizSubmitted", "true");
        localStorage.removeItem("quizAnswers");

        setTimeout(() => {
            console.log("Redirecting to score.html");
            window.location.href = "score.html";  // Ensure correct path
        }, 500);
    } else {
        console.log("User canceled submission");
    }
}

// **Tab Change Detection**
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        tabSwitchCount++;
        alert(`Warning! You have switched tabs ${tabSwitchCount} times. Further violations may lead to automatic submission.`);

        if (tabSwitchCount >= 3) {
            alert("You have switched tabs too many times. Your quiz is being submitted.");
            submitQuiz();
        }
    }
});

// **Prevent Right Click to Avoid Copying**
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    alert("Right-click is disabled during the quiz.");
});

// **Prevent Copy & Paste**
document.addEventListener("copy", (event) => {
    event.preventDefault();
    alert("Copying content is disabled during the quiz.");
});

document.addEventListener("paste", (event) => {
    event.preventDefault();
    alert("Pasting content is disabled during the quiz.");
});

// **Prevent DevTools Usage**
document.addEventListener("keydown", (event) => {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
        alert("Developer tools are disabled during the quiz.");
    }
});



// **Attach Event Listeners**
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("next-btn").addEventListener("click", nextQuestion);
    document.getElementById("prev-btn").addEventListener("click", prevQuestion);
    document.getElementById("submit-btn").addEventListener("click", submitQuiz);
    updateQuestionUI();
    startTimer(timerDuration); // Start Timer with 2 hours
});
const resumePassword = "2684"; // Change this to your desired password

function handleViolation() {
    violationCount++;

    if (violationCount >= maxViolations) {
        document.getElementById("resume-modal").style.display = "block";
    } else {
        alert(`Warning! You have violated the quiz rules ${violationCount}/${maxViolations} times.`);
        
    }
    document.getElementById("resumePassword").value = "";
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        handleViolation();
    }
});
window.addEventListener("resize", () => {
    if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
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
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
        alert("Developer tools are disabled during the quiz.");
    }
});

function verifyResumePassword() {
    const passwordField = document.getElementById("resume-password");
    const enteredPassword = passwordField.value.trim();

    if (enteredPassword === resumePassword) {
        document.getElementById("resume-modal").style.display = "none";
        violationCount = 0; // Reset violation count after successful resume
    } else {
        alert("Incorrect password. You cannot resume the quiz.");
    }

    // Always clear the password field after an attempt
    passwordField.value = "";
}

