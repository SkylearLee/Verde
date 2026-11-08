
/* =========================================
   VERDE — YOUR LITTLE GARDEN
   Daily check-ins and visit streaks
========================================= */

const GARDEN_STORAGE_KEY = "verde_garden_checkins_v1";

function getGardenDates() {
    try {
        const dates = JSON.parse(
            localStorage.getItem(GARDEN_STORAGE_KEY)
        );

        return Array.isArray(dates) ? dates : [];
    } catch (error) {
        console.error("Could not load garden check-ins:", error);
        return [];
    }
}

function saveGardenDates(dates) {
    localStorage.setItem(
        GARDEN_STORAGE_KEY,
        JSON.stringify([...new Set(dates)].sort())
    );
}

function getGardenToday() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}

function getGardenDateOffset(dateString, offset) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    date.setDate(date.getDate() + offset);

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
}

function getGardenStreak(dates) {
    const checkedIn = new Set(dates);
    const today = getGardenToday();

    // If today hasn't been checked in yet, yesterday's streak
    // remains active until the end of today.
    const startingDate = checkedIn.has(today)
        ? today
        : getGardenDateOffset(today, -1);

    let streak = 0;
    let currentDate = startingDate;

    while (checkedIn.has(currentDate)) {
        streak++;
        currentDate = getGardenDateOffset(currentDate, -1);
    }

    return streak;
}

function renderGarden() {
    const calendar = document.getElementById("garden-calendar");
    if (!calendar) return;

    const dates = getGardenDates();
    const today = getGardenToday();
    const streak = getGardenStreak(dates);

    const [year, month] = today.split("-").map(Number);

    const monthName = new Date(year, month - 1, 1)
        .toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

    document.getElementById("garden-calendar-month").textContent =
        monthName;

    document.getElementById("garden-streak-count").textContent =
        streak;

    const hasCheckedIn = dates.includes(today);
    // GARDEN MILESTONES
const milestones = [
    {
        days: 3,
        icon: "🌱",
        name: "Little Sprout",
        message: "Your little garden is beginning to grow!"
    },
    {
        days: 7,
        icon: "🌷",
        name: "Blooming Flower",
        message: "One whole week of showing up for yourself!"
    },
    {
        days: 14,
        icon: "🪴",
        name: "Little Plant",
        message: "Two weeks of growth. Look how far you've come!"
    },
    {
        days: 30,
        icon: "🌸",
        name: "Flourishing Garden",
        message: "Thirty days! Your garden is flourishing!"
    }
];

const achievedMilestones = milestones.filter(
    milestone => streak >= milestone.days
);

const nextMilestone = milestones.find(
    milestone => streak < milestone.days
);

const milestoneIcon = document.getElementById("garden-milestone-icon");
const milestoneLabel = document.getElementById("garden-milestone-label");
const milestoneTitle = document.getElementById("garden-milestone-title");
const milestoneProgress = document.getElementById("garden-milestone-progress");

if (nextMilestone) {
    milestoneIcon.textContent = achievedMilestones.length
        ? achievedMilestones[achievedMilestones.length - 1].icon
        : "🌱";

    milestoneLabel.textContent = achievedMilestones.length
        ? "YOUR GARDEN IS GROWING"
        : "YOUR NEXT MILESTONE";

    milestoneTitle.textContent = nextMilestone.name;

    const remaining = nextMilestone.days - streak;

    milestoneProgress.textContent =
        `${remaining} more ${remaining === 1 ? "day" : "days"} to reach your next milestone`;
} else {
    milestoneIcon.textContent = "🌸";
    milestoneLabel.textContent = "ALL GROWN UP";
    milestoneTitle.textContent = "Flourishing Garden";
    milestoneProgress.textContent = "You've reached every garden milestone. Keep growing!";
}

    const button = document.getElementById("garden-checkin-button");
    const status = document.getElementById("garden-streak-status");
    const message = document.getElementById("garden-streak-message");

    button.disabled = hasCheckedIn;
    button.textContent = hasCheckedIn
        ? "✓ Checked in today"
        : "✿ Check in today";

    status.textContent = hasCheckedIn
        ? "You showed up for yourself today ♡"
        : "Your garden is waiting for you ♡";

    if (streak === 0) {
        message.textContent =
            "Every visit is a little way of showing up for yourself.";
    } else if (streak === 1) {
        message.textContent =
            "A lovely little beginning. Keep growing at your own pace.";
    } else {
        message.textContent =
            `${streak} days of making room for yourself. Look at you growing!`;
    }

    // Build the current month's calendar.
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

    let calendarHTML = weekdays.map(day =>
        `<div class="garden-weekday">${day}</div>`
    ).join("");

    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div class="garden-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = [
            year,
            String(month).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

        const checked = dates.includes(date);
        const isToday = date === today;

        calendarHTML += `
            <div class="garden-day
                ${checked ? "visited" : ""}
                ${isToday ? "today" : ""}"
                title="${date}">
                <span>${day}</span>
                ${checked ? `<span class="garden-flower">✿</span>` : ""}
            </div>
        `;
    }

    calendar.innerHTML = calendarHTML;
}

function initializeGarden() {
    const button = document.getElementById("garden-checkin-button");

    if (!button || button.dataset.initialized === "true") return;

    button.dataset.initialized = "true";

    button.addEventListener("click", () => {
        const dates = getGardenDates();
        const today = getGardenToday();

        if (!dates.includes(today)) {
            dates.push(today);
            saveGardenDates(dates);
        }

        renderGarden();
    });

    renderGarden();
}

document.addEventListener("DOMContentLoaded", initializeGarden);

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "home") {
        initializeGarden();
        renderGarden();
    }
});
