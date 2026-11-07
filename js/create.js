
/* =========================================
   VERDE — CREATIVE STUDIO
   Story Garden + Daily Journal
========================================= */

/* =========================================
   SHARED SETTINGS AND HELPERS
========================================= */

const STORY_STORAGE_KEY = "verde_story_garden_v1";
const JOURNAL_STORAGE_KEY = "verde_journal_v1";

let currentStoryId = null;

const JOURNAL_MOODS = [
    { emoji: "😄", label: "Great" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Low" },
    { emoji: "😣", label: "Rough" }
];

function escapeStoryHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function createStoryId() {
    return Date.now().toString() +
        Math.random().toString(36).slice(2, 7);
}

function formatStoryDate(date) {
    return new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function formatJournalDate(date) {
    if (!date) return "No date";

    return new Date(date + "T12:00:00").toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

/* =========================================
   STORY GARDEN STORAGE
========================================= */

function loadStories() {
    try {
        return JSON.parse(
            localStorage.getItem(STORY_STORAGE_KEY)
        ) || [];
    } catch (error) {
        console.error("Could not load stories:", error);
        return [];
    }
}

function saveStories(stories) {
    localStorage.setItem(
        STORY_STORAGE_KEY,
        JSON.stringify(stories)
    );
}

/* =========================================
   JOURNAL STORAGE
========================================= */

function loadJournalEntries() {
    try {
        return JSON.parse(
            localStorage.getItem(JOURNAL_STORAGE_KEY)
        ) || [];
    } catch (error) {
        console.error("Could not load journal:", error);
        return [];
    }
}

function saveJournalEntries(entries) {
    localStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify(entries)
    );
}

/* =========================================
   INITIALIZE CREATIVE STUDIO
========================================= */

function initializeCreateStudio() {
    const root = document.getElementById("create-studio-root");

    if (!root || root.dataset.initialized === "true") return;

    root.dataset.initialized = "true";

    root.innerHTML = `
        <div class="create-studio">

            <section class="create-feature-grid">

                <button class="create-feature story-feature"
                    data-create-action="story-home">

                    <span class="create-feature-icon">✎</span>
                    <span class="create-feature-label">01 / WRITE</span>

                    <h3>Story Garden</h3>

                    <p>
                        Characters, plot twists, little scenes,
                        and stories waiting to be told.
                    </p>

                    <span class="create-feature-link">
                        Explore your stories ↗
                    </span>
                </button>

                <button class="create-feature journal-feature"
                    data-create-action="journal">

                    <span class="create-feature-icon">☾</span>
                    <span class="create-feature-label">02 / REFLECT</span>

                    <h3>Daily Journal</h3>

                    <p>
                        A place to document your days,
                        thoughts, and moods.
                    </p>

                    <span class="create-feature-link">
                        Open your journal ↗
                    </span>
                </button>

                <button class="create-feature art-feature"
                    data-create-action="art">

                    <span class="create-feature-icon">✿</span>
                    <span class="create-feature-label">03 / MAKE</span>

                    <h3>Art & Craft Wheel</h3>

                    <p>
                        Spin for a creative activity and see
                        where your imagination takes you.
                    </p>

                    <span class="create-feature-link">
                        Coming soon ✧
                    </span>
                </button>

            </section>

            <section class="create-lower-note">

                <span class="create-lower-icon">✧</span>

                <div>
                    <h3>Make room for creativity.</h3>
                    <p>
                        Not everything needs a goal, a deadline,
                        or a finished product.
                    </p>
                </div>

            </section>

            <section id="story-garden-view" hidden></section>
            <section id="story-editor-view" hidden></section>
            <section id="journal-view" hidden></section>
            <section id="journal-editor-view" hidden></section>
            <section id="art-wheel-view" hidden></section>

        </div>
    `;

    // One shared click listener handles all Creative Studio buttons.
    root.addEventListener("click", handleCreateClick);

    // These listeners handle searching and autosaving.
    root.addEventListener("input", handleCreateInput);
    root.addEventListener("change", handleCreateInput);

}

/* =========================================
   VIEW NAVIGATION
========================================= */

function showCreateHome() {
    const root = document.getElementById("create-studio-root");
    if (!root) return;

    root.querySelector(".create-feature-grid").hidden = false;
    root.querySelector(".create-lower-note").hidden = false;

    root.querySelector("#story-garden-view").hidden = true;
    root.querySelector("#story-editor-view").hidden = true;
    root.querySelector("#journal-view").hidden = true;
    root.querySelector("#journal-editor-view").hidden = true;

    currentStoryId = null;
}

function showStoryGarden() {
    const root = document.getElementById("create-studio-root");
    if (!root) return;

    root.querySelector(".create-feature-grid").hidden = true;
    root.querySelector(".create-lower-note").hidden = true;

    root.querySelector("#story-garden-view").hidden = false;
    root.querySelector("#story-editor-view").hidden = true;
    root.querySelector("#journal-view").hidden = true;
    root.querySelector("#journal-editor-view").hidden = true;

    currentStoryId = null;

    renderStoryGarden();
}

function showJournal() {
    const root = document.getElementById("create-studio-root");
    if (!root) return;

    root.querySelector(".create-feature-grid").hidden = true;
    root.querySelector(".create-lower-note").hidden = true;

    root.querySelector("#story-garden-view").hidden = true;
    root.querySelector("#story-editor-view").hidden = true;
    root.querySelector("#journal-view").hidden = false;
    root.querySelector("#journal-editor-view").hidden = true;

    currentStoryId = null;

    renderJournal();
}

/* =========================================
   STORY GARDEN
========================================= */

function renderStoryGarden() {
    const root = document.getElementById("create-studio-root");
    const garden = root.querySelector("#story-garden-view");

    garden.innerHTML = `
        <div class="story-garden">

            <button class="story-back-button"
                data-create-action="home">
                ← Back to Creative Studio
            </button>

            <div class="story-heading">

                <div>
                    <span class="eyebrow">
                        YOUR IMAGINATION, PRESERVED
                    </span>

                    <h2>Story Garden</h2>

                    <p>
                        A home for every story you might want
                        to tell someday.
                    </p>
                </div>

                <button class="story-new-button"
                    data-create-action="new-story">
                    + New story idea
                </button>

            </div>

            <div class="story-toolbar">

                <div class="story-search">
                    <span>⌕</span>

                    <input id="story-search"
                        type="search"
                        placeholder="Find a story, character, or scene...">
                </div>

                <span id="story-count" class="story-count"></span>

            </div>

            <div id="story-grid" class="story-grid"></div>

        </div>
    `;

    renderStoryCards();
}

function renderStoryCards() {
    const root = document.getElementById("create-studio-root");
    const grid = root.querySelector("#story-grid");
    const searchInput = root.querySelector("#story-search");

    if (!grid || !searchInput) return;

    const search = searchInput.value.toLowerCase().trim();
    const stories = loadStories();

    const filtered = stories.filter(story =>
        (story.title || "").toLowerCase().includes(search) ||
        (story.notes || "").toLowerCase().includes(search) ||
        (story.type || "").toLowerCase().includes(search)
    ).sort((a, b) => b.updatedAt - a.updatedAt);

    root.querySelector("#story-count").textContent =
        `${stories.length} ${stories.length === 1 ? "story" : "stories"}`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="story-empty">

                <span>✧</span>

                <h3>
                    ${stories.length === 0
                        ? "Nothing has bloomed yet."
                        : "No stories found."}
                </h3>

                <p>
                    ${stories.length === 0
                        ? "Every great story starts somewhere. Save your first spark of inspiration."
                        : "Try searching for something else."}
                </p>

                ${stories.length === 0
                    ? `<button class="story-new-button"
                        data-create-action="new-story">
                        + Plant your first idea
                       </button>`
                    : ""}

            </div>
        `;

        return;
    }

    grid.innerHTML = filtered.map(story => `
        <article class="story-card">

            <button class="story-card-open"
                data-create-action="open-story"
                data-id="${escapeStoryHTML(story.id)}">

                <div class="story-card-top">

                    <span class="story-type">
                        ${escapeStoryHTML(story.type || "Story concept")}
                    </span>

                    <span class="story-date">
                        ${formatStoryDate(story.updatedAt)}
                    </span>

                </div>

                <h3>
                    ${escapeStoryHTML(story.title || "Untitled story")}
                </h3>

                <p>
                    ${escapeStoryHTML(story.notes || "A new story waiting to unfold...")}
                </p>

                <span class="story-card-arrow">
                    Open idea ↗
                </span>

            </button>

        </article>
    `).join("");
}

function createNewStory() {
    const stories = loadStories();

    const story = {
        id: createStoryId(),
        title: "",
        type: "Story concept",
        notes: "",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    stories.push(story);
    saveStories(stories);

    openStoryEditor(story.id);
}

function openStoryEditor(storyId) {
    const root = document.getElementById("create-studio-root");
    const stories = loadStories();

    const story = stories.find(item => item.id === storyId);

    if (!root || !story) return;

    currentStoryId = storyId;

    root.querySelector(".create-feature-grid").hidden = true;
    root.querySelector(".create-lower-note").hidden = true;

    root.querySelector("#story-garden-view").hidden = true;
    root.querySelector("#story-editor-view").hidden = false;

    root.querySelector("#journal-view").hidden = true;
    root.querySelector("#journal-editor-view").hidden = true;

    const editor = root.querySelector("#story-editor-view");

    editor.innerHTML = `
        <div class="story-editor">

            <button class="story-back-button"
                data-create-action="back-garden">
                ← Back to Story Garden
            </button>

            <div class="story-editor-top">

                <div>
                    <span class="eyebrow">
                        A STORY IN THE MAKING
                    </span>

                    <p id="story-save-status">Saved ✓</p>
                </div>

                <button class="story-delete-button"
                    data-create-action="delete-story"
                    data-id="${escapeStoryHTML(story.id)}">
                    Delete idea
                </button>

            </div>

            <input id="story-title"
                class="story-title-input"
                type="text"
                maxlength="150"
                placeholder="Give your story a name..."
                value="${escapeStoryHTML(story.title)}">

            <div class="story-type-field">

                <label for="story-type">
                    WHAT ARE YOU DEVELOPING?
                </label>

                <select id="story-type">

                    ${[
                        "Story concept",
                        "Character",
                        "Plot / Twist",
                        "Scene",
                        "Dialogue",
                        "Worldbuilding",
                        "Other"
                    ].map(type => `
                        <option value="${type}"
                            ${story.type === type ? "selected" : ""}>
                            ${type}
                        </option>
                    `).join("")}

                </select>

            </div>

            <label class="story-notes-label" for="story-notes">
                LET YOUR IMAGINATION RUN
            </label>

            <textarea id="story-notes"
                class="story-notes-input"
                placeholder="What's the idea? Who are the characters? What happens? Write down anything, even if it doesn't make sense yet...">${escapeStoryHTML(story.notes)}</textarea>

            <p class="story-editor-footer">
                First planted ${formatStoryDate(story.createdAt)}.
                Your changes save automatically.
            </p>

        </div>
    `;

    editor.querySelector("#story-title").focus();
}

function saveStoryField(event) {
    const fieldIds = [
        "story-title",
        "story-type",
        "story-notes"
    ];

    if (!fieldIds.includes(event.target.id)) return;

    const stories = loadStories();

    const story = stories.find(
        item => item.id === currentStoryId
    );

    if (!story) return;

    if (event.target.id === "story-title") {
        story.title = event.target.value;
    }

    if (event.target.id === "story-type") {
        story.type = event.target.value;
    }

    if (event.target.id === "story-notes") {
        story.notes = event.target.value;
    }

    story.updatedAt = Date.now();

    saveStories(stories);

    const status = document.getElementById("story-save-status");

    if (status) status.textContent = "Saved ✓";
}

/* =========================================
   DAILY JOURNAL
========================================= */

function renderJournal() {
    const root = document.getElementById("create-studio-root");
    const view = root.querySelector("#journal-view");

    view.innerHTML = `
        <div class="journal-home">

            <button class="story-back-button"
                data-create-action="home">
                ← Back to Creative Studio
            </button>

            <div class="journal-heading">

                <div>
                    <span class="eyebrow">
                        A LITTLE SPACE FOR YOURSELF
                    </span>

                    <h2>Daily Journal</h2>

                    <p>
                        Write about your day, your thoughts,
                        or absolutely nothing in particular.
                    </p>
                </div>

                <button class="story-new-button"
                    data-create-action="new-journal">
                    + New entry
                </button>

            </div>

            <div class="journal-search">
                <span>⌕</span>

                <input id="journal-search"
                    type="search"
                    placeholder="Search your journal...">
            </div>

            <div class="journal-history-heading">
                <h3>Your entries</h3>
                <span id="journal-count"></span>
            </div>

            <div id="journal-entry-list"
                class="journal-entry-list">
            </div>

        </div>
    `;

    renderJournalEntries();
}

function renderJournalEntries() {
    const root = document.getElementById("create-studio-root");

    const list = root.querySelector("#journal-entry-list");
    const searchInput = root.querySelector("#journal-search");

    if (!list || !searchInput) return;

    const search = searchInput.value.toLowerCase().trim();
    const entries = loadJournalEntries();

    const filtered = entries.filter(entry =>
        (entry.title || "").toLowerCase().includes(search) ||
        (entry.notes || "").toLowerCase().includes(search)
    ).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    root.querySelector("#journal-count").textContent =
        `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`;

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="journal-empty">

                <span>☾</span>

                <h3>
                    ${entries.length === 0
                        ? "Your pages are waiting."
                        : "No entries found."}
                </h3>

                <p>
                    ${entries.length === 0
                        ? "Whenever you feel like writing, this space is here."
                        : "Try another search."}
                </p>

                ${entries.length === 0
                    ? `<button class="story-new-button"
                        data-create-action="new-journal">
                        + Write your first entry
                       </button>`
                    : ""}

            </div>
        `;

        return;
    }

    list.innerHTML = filtered.map(entry => {
        const mood = JOURNAL_MOODS.find(
            item => item.label === entry.mood
        ) || JOURNAL_MOODS[2];

        return `
            <article class="journal-entry-card">

                <button class="journal-entry-open"
                    data-create-action="open-journal"
                    data-id="${escapeStoryHTML(entry.id)}">

                    <div class="journal-entry-top">

                        <span>
                            ${formatJournalDate(entry.date)}
                        </span>

                        <span class="journal-entry-mood">
                            ${mood.emoji} ${mood.label}
                        </span>

                    </div>

                    <h3>
                        ${escapeStoryHTML(entry.title || "Untitled entry")}
                    </h3>

                    <p>
                        ${escapeStoryHTML(entry.notes || "An empty page...")}
                    </p>

                    <span class="journal-entry-link">
                        Read entry ↗
                    </span>

                </button>

            </article>
        `;
    }).join("");
}

function createNewJournalEntry() {
    const entries = loadJournalEntries();

    const today = new Date();

    const localDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const entry = {
        id: createStoryId(),
        title: "",
        date: localDate,
        mood: "Okay",
        notes: "",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    entries.push(entry);
    saveJournalEntries(entries);

    openJournalEditor(entry.id);
}

function openJournalEditor(entryId) {
    const root = document.getElementById("create-studio-root");

    const entries = loadJournalEntries();

    const entry = entries.find(item => item.id === entryId);

    if (!root || !entry) return;

    currentStoryId = entryId;

    root.querySelector(".create-feature-grid").hidden = true;
    root.querySelector(".create-lower-note").hidden = true;

    root.querySelector("#story-garden-view").hidden = true;
    root.querySelector("#story-editor-view").hidden = true;

    root.querySelector("#journal-view").hidden = true;
    root.querySelector("#journal-editor-view").hidden = false;

    const editor = root.querySelector("#journal-editor-view");

    editor.innerHTML = `
        <div class="journal-editor">

            <button class="story-back-button"
                data-create-action="back-journal">
                ← Back to your journal
            </button>

            <div class="journal-editor-top">

                <div>
                    <span class="eyebrow">
                        A MOMENT, PRESERVED
                    </span>

                    <p id="journal-save-status">Saved ✓</p>
                </div>

                <button class="story-delete-button"
                    data-create-action="delete-journal"
                    data-id="${escapeStoryHTML(entry.id)}">
                    Delete entry
                </button>

            </div>

            <label class="journal-field-label" for="journal-date">
                ENTRY DATE
            </label>

            <input id="journal-date"
                class="journal-date-input"
                type="date"
                value="${escapeStoryHTML(entry.date)}">

            <input id="journal-title"
                class="journal-title-input"
                type="text"
                maxlength="150"
                placeholder="A title for today..."
                value="${escapeStoryHTML(entry.title)}">

            <div class="journal-mood-section">

                <span class="journal-field-label">
                    HOW ARE YOU FEELING?
                </span>

                <div class="journal-mood-options">

                    ${JOURNAL_MOODS.map(mood => `
                        <button type="button"
                            class="journal-mood-button ${entry.mood === mood.label ? "selected" : ""}"
                            data-create-action="select-mood"
                            data-mood="${mood.label}">

                            <span>${mood.emoji}</span>
                            <small>${mood.label}</small>

                        </button>
                    `).join("")}

                </div>

            </div>

            <label class="journal-field-label" for="journal-notes">
                YOUR THOUGHTS
            </label>

            <textarea id="journal-notes"
                class="journal-notes-input"
                placeholder="What happened today? What's on your mind? How are you feeling? Start anywhere...">${escapeStoryHTML(entry.notes)}</textarea>

            <p class="journal-editor-footer">
                This page is yours. Write as much or as little as you want.
            </p>

        </div>
    `;
}

function saveJournalField(event) {
    const fieldIds = [
        "journal-title",
        "journal-date",
        "journal-notes"
    ];

    if (!fieldIds.includes(event.target.id)) return;

    const entries = loadJournalEntries();

    const entry = entries.find(
        item => item.id === currentStoryId
    );

    if (!entry) return;

    if (event.target.id === "journal-title") {
        entry.title = event.target.value;
    }

    if (event.target.id === "journal-date") {
        entry.date = event.target.value;
    }

    if (event.target.id === "journal-notes") {
        entry.notes = event.target.value;
    }

    entry.updatedAt = Date.now();

    saveJournalEntries(entries);

    const status = document.getElementById("journal-save-status");

    if (status) status.textContent = "Saved ✓";
}

/* =========================================
   SHARED INPUT HANDLER
========================================= */

function handleCreateInput(event) {
    if (event.target.id === "story-search") {
        renderStoryCards();
        return;
    }

    if (event.target.id === "journal-search") {
        renderJournalEntries();
        return;
    }

    if (
        event.target.id.startsWith("story-") &&
        event.target.id !== "story-search"
    ) {
        saveStoryField(event);
        return;
    }

    if (
        event.target.id.startsWith("journal-") &&
        event.target.id !== "journal-search"
    ) {
        saveJournalField(event);
    }
}

/* =========================================
   SHARED CLICK HANDLER
========================================= */

function handleCreateClick(event) {
    const button = event.target.closest("[data-create-action]");

    if (!button) return;

    const action = button.dataset.createAction;
    const storyId = button.dataset.id;

    // CREATIVE STUDIO HOME

    if (action === "home") {
        showCreateHome();
        return;
    }

    // STORY GARDEN

    if (action === "story-home") {
        showStoryGarden();
        return;
    }

    if (action === "new-story") {
        createNewStory();
        return;
    }

    if (action === "open-story") {
        openStoryEditor(storyId);
        return;
    }

    if (action === "back-garden") {
        showStoryGarden();
        return;
    }

    if (action === "delete-story") {
        if (!confirm("Are you sure you want to delete this story idea?")) {
            return;
        }

        const stories = loadStories().filter(
            story => story.id !== storyId
        );

        saveStories(stories);

        showStoryGarden();
        return;
    }

    // DAILY JOURNAL

    if (action === "journal") {
        showJournal();
        return;
    }

    if (action === "new-journal") {
        createNewJournalEntry();
        return;
    }

    if (action === "open-journal") {
        openJournalEditor(storyId);
        return;
    }

    if (action === "back-journal") {
        showJournal();
        return;
    }

    if (action === "select-mood") {
        const entries = loadJournalEntries();

        const entry = entries.find(
            item => item.id === currentStoryId
        );

        if (!entry) return;

        entry.mood = button.dataset.mood;
        entry.updatedAt = Date.now();

        saveJournalEntries(entries);

        const editor = document.getElementById("journal-editor-view");

        editor.querySelectorAll(".journal-mood-button").forEach(item => {
            item.classList.toggle(
                "selected",
                item.dataset.mood === entry.mood
            );
        });

        const status = document.getElementById("journal-save-status");

        if (status) status.textContent = "Saved ✓";

        return;
    }

    if (action === "delete-journal") {
        if (!confirm("Are you sure you want to delete this journal entry?")) {
            return;
        }

        const entries = loadJournalEntries().filter(
            entry => entry.id !== storyId
        );

        saveJournalEntries(entries);

        showJournal();
        return;
    }

    /// ART & CRAFT WHEEL
    if (action === "art") {
        renderArtWheel();
        return;
    }

    if ([
        "spin-art",
        "art-all",
        "art-favorites",
        "art-favorite",
        "art-delete"
    ].includes(action)) {
        handleArtAction(action, button);
        return;
    }
}

/* =========================================
   CONNECT TO VERDE NAVIGATION
========================================= */

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "create") {
        initializeCreateStudio();
        showCreateHome();
    }
});

console.log("🌷 VERDE Creative Studio initialized!");


/* =========================================
   VERDE — ART & CRAFT WHEEL
========================================= */

const ART_STORAGE_KEY = "verde_art_activities_v1";

const DEFAULT_ART_ACTIVITIES = [
    "Watercolor painting",
    "Acrylic painting",
    "Sketching",
    "Digital drawing",
    "Pottery",
    "Air-dry clay",
    "Make a lanyard",
    "Bead jewelry",
    "Embroidery",
    "Crochet",
    "Collage making",
    "Scrapbooking",
    "Origami",
    "Candle making",
    "Paint a tote bag",
    "DIY room decor",
    "Pressed flowers",
    "Decorate a journal"
];

let artRotation = 0;
let artSpinning = false;
let lastArtActivity = null;
let showArtFavorites = false;

function loadArtActivities() {
    try {
        const saved = localStorage.getItem(ART_STORAGE_KEY);

        if (saved === null) {
            return DEFAULT_ART_ACTIVITIES.map((name, index) => ({
                id: "default-" + index,
                name,
                favorite: false,
                custom: false
            }));
        }

        return JSON.parse(saved) || [];
    } catch (error) {
        console.error("Could not load art activities:", error);
        return [];
    }
}

function saveArtActivities(activities) {
    localStorage.setItem(
        ART_STORAGE_KEY,
        JSON.stringify(activities)
    );
}

function renderArtWheel() {
    const root = document.getElementById("create-studio-root");
    if (!root) return;

    root.querySelector(".create-feature-grid").hidden = true;
    root.querySelector(".create-lower-note").hidden = true;

    root.querySelector("#story-garden-view").hidden = true;
    root.querySelector("#story-editor-view").hidden = true;
    root.querySelector("#journal-view").hidden = true;
    root.querySelector("#journal-editor-view").hidden = true;

    const view = root.querySelector("#art-wheel-view");
    view.hidden = false;

    const activities = loadArtActivities();
    const favorites = activities.filter(item => item.favorite);

    view.innerHTML = `
        <div class="art-wheel-page">

            <button class="story-back-button"
                data-create-action="home">
                ← Back to Creative Studio
            </button>

            <div class="art-heading">
                <span class="eyebrow">FOLLOW YOUR CREATIVE IMPULSE</span>
                <h2>Art & Craft Wheel</h2>
                <p>Not sure what to make? Let fate decide.</p>
            </div>

            <div class="art-wheel-layout">

                <div class="art-wheel-main">

                    <div class="art-wheel-pointer">▼</div>

                    <div class="art-wheel" id="art-wheel">
                        <div class="art-wheel-center">
                            <span>✿</span>
                            <small>CREATE</small>
                        </div>
                    </div>

                    <button class="art-spin-button"
                        id="art-spin-button"
                        data-create-action="spin-art"
                        ${activities.length < 2 ? "disabled" : ""}>
                        ✧ SPIN THE WHEEL ✧
                    </button>

                    <div id="art-result" class="art-result">
                        <span>YOUR NEXT CREATIVE ADVENTURE</span>
                        <p>Give the wheel a spin!</p>
                    </div>

                </div>

                <div class="art-collection">

                    <div class="art-collection-heading">
                        <div>
                            <span class="eyebrow">YOUR POSSIBILITIES</span>
                            <h3>Activity collection</h3>
                        </div>
                        <span class="art-activity-count">
                            ${activities.length} activities
                        </span>
                    </div>

                    <form id="art-add-form" class="art-add-form">
                        <input
                            id="art-new-activity"
                            type="text"
                            maxlength="55"
                            placeholder="Add a creative activity..."
                            required
                        >
                        <button type="submit">+</button>
                    </form>

                    <div class="art-filter-tabs">
                        <button
                            class="${!showArtFavorites ? "active" : ""}"
                            data-create-action="art-all">
                            All activities
                        </button>

                        <button
                            class="${showArtFavorites ? "active" : ""}"
                            data-create-action="art-favorites">
                            ♡ Favorites (${favorites.length})
                        </button>
                    </div>

                    <div class="art-activity-list">
                        ${renderArtActivityList(activities)}
                    </div>

                </div>

            </div>

            <div class="art-inspiration-note">
                <span>✧</span>
                <p>
                    You don't need to be good at something to enjoy making it.
                    Just try something new.
                </p>
            </div>

        </div>
    `;

    const wheel = view.querySelector("#art-wheel");

    wheel.style.transform = `rotate(${artRotation}deg)`;

    const form = view.querySelector("#art-add-form");

    form.addEventListener("submit", event => {
        event.preventDefault();

        const input = view.querySelector("#art-new-activity");
        const name = input.value.trim();

        if (!name) return;

        const currentActivities = loadArtActivities();

        const alreadyExists = currentActivities.some(
            item => item.name.toLowerCase() === name.toLowerCase()
        );

        if (alreadyExists) {
            alert("That activity is already in your collection!");
            return;
        }

        currentActivities.push({
            id: createStoryId(),
            name,
            favorite: false,
            custom: true
        });

        saveArtActivities(currentActivities);
        showArtFavorites = false;
        renderArtWheel();
    });
}

function renderArtActivityList(activities) {
    const visible = showArtFavorites
        ? activities.filter(item => item.favorite)
        : activities;

    if (visible.length === 0) {
        return `
            <div class="art-list-empty">
                <span>♡</span>
                <p>No favorites yet. Tap the heart on an activity to save it!</p>
            </div>
        `;
    }

    return visible.map(activity => `
        <div class="art-activity-item">

            <span class="art-activity-name">
                ${escapeStoryHTML(activity.name)}
            </span>

            <div class="art-activity-actions">

                <button
                    data-create-action="art-favorite"
                    data-id="${escapeStoryHTML(activity.id)}"
                    title="Toggle favorite"
                    aria-label="Toggle favorite">
                    ${activity.favorite ? "♥" : "♡"}
                </button>

                ${activity.custom ? `
                    <button
                        data-create-action="art-delete"
                        data-id="${escapeStoryHTML(activity.id)}"
                        title="Delete activity"
                        aria-label="Delete activity">
                        ×
                    </button>
                ` : ""}

            </div>

        </div>
    `).join("");
}

function spinArtWheel() {
    if (artSpinning) return;

    const activities = loadArtActivities();

    if (activities.length < 2) return;

    artSpinning = true;

    const button = document.getElementById("art-spin-button");
    const wheel = document.getElementById("art-wheel");
    const result = document.getElementById("art-result");

    button.disabled = true;
    button.textContent = "SPINNING...";

    result.innerHTML = `
        <span>YOUR NEXT CREATIVE ADVENTURE</span>
        <p>Let's see what you get...</p>
    `;

    let possible = activities;

    if (activities.length > 1 && lastArtActivity) {
        const alternatives = activities.filter(
            item => item.id !== lastArtActivity
        );

        if (alternatives.length > 0) {
            possible = alternatives;
        }
    }

    const selected =
        possible[Math.floor(Math.random() * possible.length)];

    lastArtActivity = selected.id;

    const extraRotation = 1800 + Math.random() * 1440;
    artRotation += extraRotation;

    wheel.style.transform = `rotate(${artRotation}deg)`;

    wheel.classList.add("spinning");

    setTimeout(() => {
        wheel.classList.remove("spinning");

        result.innerHTML = `
            <span>YOUR NEXT CREATIVE ADVENTURE</span>
            <h3>${escapeStoryHTML(selected.name)}</h3>
            <p>Looks like this is what you're making next! ✨</p>
        `;

        button.disabled = false;
        button.textContent = "✧ SPIN AGAIN ✧";

        artSpinning = false;
    }, 4200);
}

function handleArtAction(action, button) {
    const id = button.dataset.id;
    const activities = loadArtActivities();

    if (action === "spin-art") {
        spinArtWheel();
        return;
    }

    if (action === "art-all") {
        showArtFavorites = false;
        renderArtWheel();
        return;
    }

    if (action === "art-favorites") {
        showArtFavorites = true;
        renderArtWheel();
        return;
    }

    if (action === "art-favorite") {
        const activity = activities.find(item => item.id === id);

        if (!activity) return;

        activity.favorite = !activity.favorite;

        saveArtActivities(activities);
        renderArtWheel();
        return;
    }

    if (action === "art-delete") {
        const confirmed = confirm("Remove this activity from your wheel?");

        if (!confirmed) return;

        saveArtActivities(
            activities.filter(item => item.id !== id)
        );

        if (lastArtActivity === id) {
            lastArtActivity = null;
        }

        renderArtWheel();
    }
}

