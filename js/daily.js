
/* =========================================
   VERDE — DAILY FOCUS
   Energy-based suggestions + daily intentions
========================================= */

const DAILY_STORAGE_KEY = "verde_daily_focus_v1";

let selectedDailyEnergy = null;
let dailySuggestionSet = [];
let dailySuggestionOffset = 0;

/* -----------------------------------------
   STORAGE HELPERS
----------------------------------------- */

function dailyLoad(key, fallback = []) {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        return saved ?? fallback;
    } catch (error) {
        console.error("Could not load:", key, error);
        return fallback;
    }
}

function dailySave(data) {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(data));
}

function dailyToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function dailyEscape(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

/* -----------------------------------------
   GET IDEAS FROM EXISTING VERDE PILLARS
----------------------------------------- */

function getDailySuggestions(energy) {
    const suggestions = [];

    const tasks = dailyLoad("verde_tasks_v1");
    const resources = dailyLoad("verde_research_library_v1");
    const internships = dailyLoad("verde_internships_v1");
    const stories = dailyLoad("verde_story_garden_v1");
    const journal = dailyLoad("verde_journal_v1");

    // BUILD: suggest unfinished tasks
    if (Array.isArray(tasks)) {
        tasks
            .filter(task => !task.completed)
            .forEach(task => {
                suggestions.push({
                    title: task.title,
                    pillar: "BUILD",
                    emoji: "💻",
                    description: "Continue making progress on your project.",
                    energy: "normal"
                });
            });
    }

    // LEARN: suggest resources not yet completed
    if (Array.isArray(resources)) {
        resources
            .filter(resource =>
                !["Completed", "Read", "Finished"].includes(resource.status)
            )
            .forEach(resource => {
                suggestions.push({
                    title: `Spend some time with: ${resource.title}`,
                    pillar: "LEARN",
                    emoji: "📚",
                    description: resource.subject || "Explore something interesting.",
                    energy: "low"
                });
            });
    }

    // ADVANCE: suggest active internship opportunities
    if (Array.isArray(internships)) {
        internships
            .filter(item =>
                !["Rejected", "Withdrawn", "Offer"].includes(item.status)
            )
            .forEach(item => {
                suggestions.push({
                    title: `Take a next step with ${item.company}`,
                    pillar: "ADVANCE",
                    emoji: "🚀",
                    description: item.position || "Move an opportunity forward.",
                    energy: "normal"
                });
            });
    }

    // CREATE: suggest working on existing stories
    if (Array.isArray(stories) && stories.length) {
        suggestions.push({
            title: "Spend a little time writing",
            pillar: "CREATE",
            emoji: "✍️",
            description: "Return to a story or develop a new idea.",
            energy: "normal"
        });
    }

    // CREATE: journaling
    suggestions.push({
        title: "Write a little in your journal",
        pillar: "CREATE",
        emoji: "🌷",
        description: journal.length
            ? "Reflect on what's been happening lately."
            : "Start with a few sentences about today.",
        energy: "low"
    });

    // LIVE: gentle activities
    const liveIdeas = [
        {
            title: "Go for a walk with music",
            description: "Get outside and enjoy a change of scenery.",
            energy: "low"
        },
        {
            title: "Visit a coffee shop",
            description: "Try somewhere new or revisit a favorite.",
            energy: "normal"
        },
        {
            title: "Go bouldering",
            description: "Try a new route or revisit one you've been working on.",
            energy: "high"
        },
        {
            title: "Have a cozy reading afternoon",
            description: "Slow down and enjoy a good book.",
            energy: "low"
        },
        {
            title: "Try a new creative activity",
            description: "Make something just because you feel like it.",
            energy: "normal"
        },
        {
            title: "Explore somewhere you've never been",
            description: "Give yourself a little adventure.",
            energy: "high"
        },
        {
            title: "Take a proper rest",
            description: "You don't have to accomplish anything right now.",
            energy: "low"
        }
    ];

    liveIdeas.forEach(idea => {
        suggestions.push({
            ...idea,
            pillar: "LIVE",
            emoji: "🌿"
        });
    });

    // Match ideas to energy level.
    const energyMatches = suggestions.filter(item =>
        item.energy === energy
    );

    // Add some flexibility: include general ideas if needed.
    const selected = energyMatches.length >= 3
        ? energyMatches
        : suggestions;

    // Remove duplicate titles.
    return selected.filter((item, index, array) =>
        array.findIndex(other =>
            other.title === item.title
        ) === index
    );
}

/* -----------------------------------------
   INITIALIZE DAILY FOCUS
----------------------------------------- */

function initializeDailyFocus() {
    const root = document.getElementById("daily-suggestions-root");
    if (!root) return;

    const page = root.closest("#page-container") || document;

    if (page.dataset.dailyInitialized === "true") return;

    page.dataset.dailyInitialized = "true";

    page.addEventListener("click", handleDailyClick);
    page.addEventListener("submit", handleDailySubmit);

    const saved = dailyLoad(DAILY_STORAGE_KEY, {});
    const today = dailyToday();

    if (saved.date === today) {
        selectedDailyEnergy = saved.energy || null;
    } else {
        selectedDailyEnergy = null;
    }

    updateDailyEnergyCards();

    if (selectedDailyEnergy) {
        showDailySuggestions();
    }

    renderDailyIntentions();
}

/* -----------------------------------------
   ENERGY SELECTION
----------------------------------------- */

function updateDailyEnergyCards() {
    document.querySelectorAll(".energy-card").forEach(card => {
        const isSelected =
            card.dataset.energy === selectedDailyEnergy;

        card.classList.toggle("selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
    });
}

function selectDailyEnergy(energy) {
    selectedDailyEnergy = energy;
    dailySuggestionOffset = 0;

    const previous = dailyLoad(DAILY_STORAGE_KEY, {});

    dailySave({
        ...previous,
        date: dailyToday(),
        energy: energy
    });

    updateDailyEnergyCards();
    showDailySuggestions();
}

/* -----------------------------------------
   SUGGESTION DISPLAY
----------------------------------------- */

function showDailySuggestions() {
    const section = document.getElementById(
        "daily-suggestions-section"
    );

    const root = document.getElementById(
        "daily-suggestions-root"
    );

    if (!section || !root || !selectedDailyEnergy) return;

    section.hidden = false;

    const energyLabels = {
        low: "A gentler kind of day 🌙",
        normal: "A little focused progress ☀️",
        high: "Let's explore what you can do ⚡"
    };

    dailySuggestionSet = getDailySuggestions(selectedDailyEnergy);

    if (!dailySuggestionSet.length) {
        root.innerHTML = `
            <div class="daily-suggestion-empty">
                <h3>Nothing waiting for you just yet.</h3>
                <p>Maybe today is a lovely day to explore something new.</p>
            </div>
        `;
        return;
    }

    // Shuffle suggestions when generating a new set.
    const shuffled = [...dailySuggestionSet];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    dailySuggestionSet = shuffled;

    const visibleSuggestions = dailySuggestionSet.slice(
        dailySuggestionOffset,
        dailySuggestionOffset + 3
    );

    root.innerHTML = `
        <div class="daily-suggestions-heading">
            <span class="section-eyebrow">A LITTLE DIRECTION</span>
            <h3>${energyLabels[selectedDailyEnergy]}</h3>
            <p>Here are a few ideas that might suit your day.</p>
        </div>

        <div class="daily-suggestion-list">
            ${visibleSuggestions.map((item, index) => `
                <article class="daily-suggestion-card">
                    <span class="daily-suggestion-emoji">
                        ${item.emoji}
                    </span>

                    <div class="daily-suggestion-info">
                        <span class="daily-suggestion-pillar">
                            ${dailyEscape(item.pillar)}
                        </span>
                        <h4>${dailyEscape(item.title)}</h4>
                        <p>${dailyEscape(item.description)}</p>
                    </div>

                    <div class="daily-suggestion-actions">
                        <button type="button"
                            data-daily-action="use-main"
                            data-index="${dailySuggestionOffset + index}">
                            Main thing
                        </button>

                        <button type="button"
                            data-daily-action="use-extra"
                            data-index="${dailySuggestionOffset + index}">
                            Extra
                        </button>
                    </div>
                </article>
            `).join("")}
        </div>

        <button type="button"
            class="daily-refresh-button"
            data-daily-action="refresh">
            ↻ Show me different ideas
        </button>
    `;
}

/* -----------------------------------------
   DAILY INTENTIONS
----------------------------------------- */

function renderDailyIntentions() {
    const section = document.getElementById(
        "daily-intentions-section"
    );

    const root = document.getElementById(
        "daily-intentions-root"
    );

    if (!section || !root) return;

    section.hidden = false;

    const saved = dailyLoad(DAILY_STORAGE_KEY, {});
    const isToday = saved.date === dailyToday();

    const main = isToday ? saved.main || "" : "";
    const extra = isToday ? saved.extra || "" : "";
    const personal = isToday ? saved.personal || "" : "";
    const completed = isToday ? saved.completed || false : false;

    root.innerHTML = `
        <div class="daily-intentions-card">
            <span class="section-eyebrow">YOUR DAY, YOUR WAY</span>
            <h3>Today's intentions ✿</h3>
            <p class="daily-intentions-intro">
                Choose what matters today. Everything else can wait.
            </p>

            <form id="daily-intentions-form">

                <label for="daily-main">
                    Your main thing
                </label>
                <input
                    id="daily-main"
                    name="main"
                    type="text"
                    placeholder="What's one thing you'd like to do?"
                    value="${dailyEscape(main)}"
                >

                <label for="daily-extra">
                    Something extra <span>(optional)</span>
                </label>
                <input
                    id="daily-extra"
                    name="extra"
                    type="text"
                    placeholder="Anything else you'd enjoy doing?"
                    value="${dailyEscape(extra)}"
                >

                <label for="daily-personal">
                    Something for yourself
                </label>
                <input
                    id="daily-personal"
                    name="personal"
                    type="text"
                    placeholder="How would you like to care for yourself?"
                    value="${dailyEscape(personal)}"
                >

                <div class="daily-intention-footer">
                    <button type="submit" class="daily-save-button">
                        Save today's intentions
                    </button>

                    <span class="daily-save-message" id="daily-save-message">
                        ${isToday && saved.savedAt ? "Saved for today ♡" : ""}
                    </span>
                </div>

                <label class="daily-complete-label">
                    <input
                        type="checkbox"
                        name="completed"
                        ${completed ? "checked" : ""}
                    >
                    I've done what I wanted to do today.
                </label>

            </form>
        </div>
    `;
}

/* -----------------------------------------
   CLICK HANDLING
----------------------------------------- */

function handleDailyClick(event) {
    const button = event.target.closest("[data-energy], [data-daily-action]");
    if (!button) return;

    if (button.dataset.energy) {
        selectDailyEnergy(button.dataset.energy);
        return;
    }

    const action = button.dataset.dailyAction;

    if (action === "refresh") {
        if (dailySuggestionOffset + 3 >= dailySuggestionSet.length) {
            dailySuggestionOffset = 0;
        } else {
            dailySuggestionOffset += 3;
        }

        showDailySuggestions();
        return;
    }

    if (action === "use-main" || action === "use-extra") {
        const index = Number(button.dataset.index);
        const suggestion = dailySuggestionSet[index];

        if (!suggestion) return;

        const fieldId = action === "use-main"
            ? "daily-main"
            : "daily-extra";

        const field = document.getElementById(fieldId);

        if (field) {
            field.value = suggestion.title;
            field.focus();

            document.getElementById(
                "daily-intentions-section"
            ).scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }
}

/* -----------------------------------------
   SAVE INTENTIONS
----------------------------------------- */

function handleDailySubmit(event) {
    if (event.target.id !== "daily-intentions-form") return;

    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const saved = {
        date: dailyToday(),
        energy: selectedDailyEnergy,
        main: formData.get("main").trim(),
        extra: formData.get("extra").trim(),
        personal: formData.get("personal").trim(),
        completed: formData.get("completed") === "on",
        savedAt: new Date().toISOString()
    };

    dailySave(saved);

    const message = document.getElementById(
        "daily-save-message"
    );

    if (message) {
        message.textContent = "Saved for today ♡";
    }
}

/* -----------------------------------------
   PAGE NAVIGATION
----------------------------------------- */

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "daily") {
        initializeDailyFocus();
    }
});
