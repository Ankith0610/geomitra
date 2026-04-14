import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { db } from "./firebase-service.js";

const siteConfigRef = doc(db, "site", "config");

const defaultSiteConfig = {
    eventTitle: "GEOMITRA QUIZ",
    dashboardMessage: "Welcome to your dashboard. Add your team member.",
    quizDate: "22-03-2025",
    quizTime: "10:00 AM",
    quizDurationMinutes: 120,
    quizPassword: "20250322",
    resumePassword: "2684",
    allowedEmailDomain: "nmamit.in",
    instructions: [
        "Duration of the event is 2 hours.",
        "Carry one android phone (fully charged) for the test. If your team has two members, the other person's phone should be switched off and kept above the table.",
        "Ensure that you have the essential equipment before starting the test (pen, pencil, eraser, scale, protractor).",
        "Drawing sheet for the model will be provided.",
        "There are a total of 10 questions.",
        "The answer should be entered in mobile phone and also written behind the grid sheet (answer including question number).",
        "The answer to each question is to be used in the clues provided to draw the final diagram.",
        "The internet should be kept on for the complete duration of the event.",
        "Do not exit the app until the completion of the event.",
        "You will be logged out from the test if you exit the app.",
        "Contact the organizers if you are logged out.",
        "Use of calculators (both physical and virtual) is prohibited. Do not attempt to use the internet (Google, ChatGPT, Bard, etc.).",
        "Any electronic devices (smartphones, smartwatches) should be kept inside the bag.",
        "Final evaluation will be carried out based on the correctness of answers to the questions and the final diagram.",
        "The decision of the judges and organizers is final.",
        "All the best!"
    ],
    questions: [
        {
            question: "A = Number of quadrants in a Two-Dimensional Cartesian plane",
            image: "blank.png",
            note: `Keep your grid sheets in portrait position.
Mark X axis from left to right and Y axis from down to up at the border of the grid sheet.
The bottom left corner will be the origin (0,0).
Draw the horizontal line L0 at y = A.
Let Series P = 0, 0, 1, 1, 2, 2... and Series Q = 4, 5.5, 7, 8.5, 10, 11.5...
Plot and join the points (P1,Q1), (P2,Q2), (P3,Q3)... till (P12,Q12).
Hint: (P1,Q1) = (0,4) and (P12,Q12) = (5,20.5).`
        },
        {
            question: "B = Area of shaded region in the given figure:",
            image: "GM_Image_01.png",
            note: ""
        },
        {
            question: "C = LCM(7,4).",
            image: "blank.png",
            note: ""
        },
        {
            question: "D = Number of overs in an innings of a T20 match",
            image: "blank.png",
            note: ""
        },
        {
            question: "E = (1 + 5 / 2)",
            image: "blank.png",
            note: ""
        },
        {
            question: "F = Age at which you get the right to vote in India",
            image: "blank.png",
            note: ""
        },
        {
            question: "G = Number of months in a calendar year having the number of days greater than or equal to 30",
            image: "GM_Image_02.png",
            note: `Draw a line joining the following points:
L1 = (B, C) to (15.5, C)
L2 = (15.5, C) to (D, A)
L3 = (E, A) to (5.5, F)
L4 = (G, A) to (G, C)
L5 = From the point (5.5, F), draw a line towards positive X-axis till it intersects the line L2.

Draw 12 lines upwards from L1 parallel to the Y-axis at:
x = 6, 8, 8.5, 9, 9.75, 10, 10.75, 11.5, 12.5, 13.5, 14.5, 15

Join (6,35.5) to (15,35.5).
Also join (6,37.5) to (15,37.5).

Inside the quadrilateral made by L0, L3, L4 and L5, join:
(6.5, F) to (5, A)
(8, F) to (7, A)
(9, F) to (8, A)
(10, F) to (9, A)

Inside the quadrilateral made by L0, L1, L2 and L4, join:
(11.5, C) to (12, A)
(12, C) to (13, A)
(13, C) to (14.5, A)
(13.5, C) to (15.5, A)
(14, C) to (16.5, A)
(14.5, C) to (18, A)
(15, F) to (19, A)

Between the lines L2 and L3, draw horizontal lines at:
5.5, 8, 10.5, 13, 15.5

Extend the 15.5 line till (19,15.5).
Between the lines L2 and L4, draw horizontal lines at:
22.5, 25, 26.5.`
        },
        {
            question: "H = Determinant of the following matrix",
            image: "GM_Image_03.png",
            note: ""
        },
        {
            question: "I = The resistance between points A and B",
            image: "GM_Image_04.png",
            note: ""
        },
        {
            question: "J = Perimeter of the circle of radius 4/pi",
            image: "GM_Image_05.png",
            note: `Join the following points in order:
i. (8.5, F) -> (7.5, 23.5) -> (9, I) -> (J, C) -> (8.5, C) -> (9.5, I) -> (J, 23.5) -> (9, F) -> (H, D) -> (9.5, I)
ii. (J, 23.5) -> (1, 23.5) -> (E, 27.5) -> extend it towards right till it intersects any line
iii. (2, 25) -> (7, 25) -> (J, I) -> (7.5, 26.5) -> extend it towards left till it intersects any line
iv. (7.5, 25.5) -> (7, I) -> extend it towards left till it intersects any line
v. (19, 15.5) -> (17.5, 23.5) -> extend it towards left till it intersects any line
vi. (0, 24) -> (4.5, 30) -> (5.5, 34.5) -> (5.5, 40)
vii. (0, 33.5) -> (2.5, 35) -> (E, 40)

Join the following:
(5.5, 26.5) -> (5, 25)
(6, 26.5) -> (5.5, 25)
(3, 23) -> (0, 14.5)
(0, 10) -> (3.5, 20.5)
(4.5, 23) -> (5.5, 18)
(1, 23.5) -> (2, 20)
(5, 20.5) -> (2, 20.5)
(6.5, 18) -> (5.5, 22.5)
(5.5, 22.5) -> 2.2 cm line towards right
(7.5, 23) -> 6.4 cm line towards left
(4, 17.5) -> (2.5, 17.5)
(3, 14.5) -> (1.5, 14.5)
(2, 11.5) -> (0.5, 11.5)
(1, 8.5) -> (0, 8.5)

Draw lines towards the bottom-right direction with angle 290 degrees from:
(1, 7), (1, 8.5), (2, 10), (2, 11.5), (3, 13), (3, 14.5), (4, 16), (4, 17.5), (5, 19)

Draw 1.5 cm lines to the right of:
(6, 29), (6, 30), (6, 31), (6, 32), (6, 33), (6, 34), (6, 35), (6, 36), (6, 37)

Join:
(7.5, 28) -> (8, 28.5) -> (7.5, 29)
(7.5, 30) -> (8, 30.5) -> (7.5, 31)
(7.5, 32) -> (8, 32.5) -> (7.5, 33)
(7.5, 34) -> (8, 34.5) -> (7.5, 35)
(7.5, 36) -> (7.5, 37)
(11.5, 34) -> (12.5, 34)
(13.5, 34) -> (14.5, 34)
(11.5, 32.5) -> (12.5, 32.5)
(13.5, 32.5) -> (14.5, 32.5)
(11.5, 31) -> (12.5, 31)
(13.5, 31) -> (14.5, 31)
(11.5, 29.5) -> (12.5, 29.5)
(13.5, 29.5) -> (14.5, 29.5)

Above L1, between the lines at x = 9 and x = 9.75, draw horizontal lines for every 0.5 cm on the grid.
Repeat the same between the lines x = 10 and x = 10.75.
The pattern obtained should look like shown above.`
        },
        {
            question: "Hints continued...",
            image: "GM_Image_06.png",
            note: `As shown in the diagram above, draw and shade windows of 0.5 cm thickness between the following vertical lines and do not place the windows adjacent to horizontal lines:
Between the lines starting at (5, A) and (7, A)
Between the lines starting at (9, A) and (11, A)
Between the lines starting at (13, A) and (14.5, A)
Between the lines starting at (16.5, A) and (18, A)

Note: The dotted lines are 0.5 cm apart.

Shade the area made up of the polygon with vertices:
(3.5, 27.5), (3, 26.5), (7.5, 26.5), (8, 26), (7, 25), (2, 25), (1, 23.5), (7.5, 23.5), (9, 26), (8, 27.5).`
        }
    ],
    ownerUid: "",
    ownerEmail: "",
    updatedAt: ""
};

let cachedSiteConfig = null;

function cloneConfig(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeString(value, fallback = "") {
    if (typeof value !== "string") {
        return fallback;
    }

    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizePositiveNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeInstructions(value, fallback) {
    if (!Array.isArray(value)) {
        return cloneConfig(fallback);
    }

    const items = value
        .map((item) => String(item ?? "").trim())
        .filter(Boolean);

    return items.length ? items : cloneConfig(fallback);
}

function normalizeQuestions(value, fallback) {
    if (!Array.isArray(value)) {
        return cloneConfig(fallback);
    }

    const items = value
        .map((item, index) => {
            const fallbackQuestion = fallback[index] || fallback[fallback.length - 1];

            return {
                question: normalizeString(item?.question, fallbackQuestion.question),
                image: normalizeString(item?.image, fallbackQuestion.image),
                note: typeof item?.note === "string" ? item.note.trim() : fallbackQuestion.note
            };
        })
        .filter((item) => item.question);

    return items.length ? items : cloneConfig(fallback);
}

function normalizeSiteConfig(rawConfig = {}) {
    const defaults = cloneConfig(defaultSiteConfig);

    return {
        ...defaults,
        eventTitle: normalizeString(rawConfig.eventTitle, defaults.eventTitle),
        dashboardMessage: normalizeString(rawConfig.dashboardMessage, defaults.dashboardMessage),
        quizDate: normalizeString(rawConfig.quizDate, defaults.quizDate),
        quizTime: normalizeString(rawConfig.quizTime, defaults.quizTime),
        quizDurationMinutes: normalizePositiveNumber(rawConfig.quizDurationMinutes, defaults.quizDurationMinutes),
        quizPassword: normalizeString(rawConfig.quizPassword, defaults.quizPassword),
        resumePassword: normalizeString(rawConfig.resumePassword, defaults.resumePassword),
        allowedEmailDomain: normalizeString(rawConfig.allowedEmailDomain, defaults.allowedEmailDomain),
        instructions: normalizeInstructions(rawConfig.instructions, defaults.instructions),
        questions: normalizeQuestions(rawConfig.questions, defaults.questions),
        ownerUid: typeof rawConfig.ownerUid === "string" ? rawConfig.ownerUid : "",
        ownerEmail: typeof rawConfig.ownerEmail === "string" ? rawConfig.ownerEmail : "",
        updatedAt: typeof rawConfig.updatedAt === "string" ? rawConfig.updatedAt : ""
    };
}

async function getSiteConfig(forceRefresh = false) {
    if (cachedSiteConfig && !forceRefresh) {
        return cloneConfig(cachedSiteConfig);
    }

    try {
        const snapshot = await getDoc(siteConfigRef);

        if (!snapshot.exists()) {
            cachedSiteConfig = normalizeSiteConfig();
            return cloneConfig(cachedSiteConfig);
        }

        cachedSiteConfig = normalizeSiteConfig(snapshot.data());
        return cloneConfig(cachedSiteConfig);
    } catch (error) {
        console.error("Unable to load site configuration:", error);
        cachedSiteConfig = normalizeSiteConfig();
        return cloneConfig(cachedSiteConfig);
    }
}

async function getSiteOwnershipState(user) {
    const config = await getSiteConfig();
    const ownerExists = Boolean(config.ownerUid);
    const isOwner = Boolean(user && ownerExists && user.uid === config.ownerUid);

    return {
        config,
        ownerExists,
        isOwner,
        canClaimOwner: Boolean(user) && !ownerExists
    };
}

async function saveSiteConfig(nextConfig, user) {
    if (!user) {
        throw new Error("Please sign in to manage the site.");
    }

    const existingSnapshot = await getDoc(siteConfigRef);
    const existingConfig = existingSnapshot.exists() ? normalizeSiteConfig(existingSnapshot.data()) : null;

    if (existingConfig?.ownerUid && existingConfig.ownerUid !== user.uid) {
        throw new Error("Only the current owner can update the admin settings.");
    }

    const normalizedConfig = normalizeSiteConfig(nextConfig);
    const ownerUid = existingConfig?.ownerUid || user.uid;
    const ownerEmail = existingConfig?.ownerEmail || user.email || "";
    const justClaimedOwner = !existingConfig?.ownerUid;

    const payload = {
        ...normalizedConfig,
        ownerUid,
        ownerEmail,
        updatedAt: new Date().toISOString()
    };

    await setDoc(siteConfigRef, payload);
    cachedSiteConfig = payload;

    return {
        ...cloneConfig(payload),
        justClaimedOwner
    };
}

export {
    defaultSiteConfig,
    getSiteConfig,
    getSiteOwnershipState,
    normalizeSiteConfig,
    saveSiteConfig,
    cloneConfig as cloneSiteConfig
};
