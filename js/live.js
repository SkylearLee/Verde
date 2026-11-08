
const LIVE_STORAGE_KEY = "verde_live_favorites_v1";

const LIVE_ACTIVITIES = [
    // EXPLORE
    { id: "e1", title: "Visit a coffee shop you've never tried", category: "Explore", emoji: "☕", description: "Find a cozy spot, order something new, and enjoy a change of scenery." },
    { id: "e2", title: "Explore a nearby town", category: "Explore", emoji: "🌍", description: "Pick somewhere nearby and spend an afternoon wandering around." },
    { id: "e3", title: "Watch the sunset somewhere new", category: "Explore", emoji: "🌅", description: "Find a pretty viewpoint and take a little break from everything." },
    { id: "e4", title: "Visit a museum or gallery", category: "Explore", emoji: "🖼️", description: "Spend some time looking at something different." },
    { id: "e5", title: "Go on a little photo walk", category: "Explore", emoji: "📸", description: "Take your camera or phone and capture interesting little details." },
    { id: "e6", title: "Find a new bookstore", category: "Explore", emoji: "📚", description: "Browse the shelves and pick something that catches your eye." },
    { id: "e7", title: "Plan a spontaneous day trip", category: "Explore", emoji: "🚗", description: "Choose a destination and make a day of it." },

    // CREATIVE
    { id: "c1", title: "Try pottery or air-dry clay", category: "Creative", emoji: "🏺", description: "Make something with your hands, even if it turns out a little wonky." },
    { id: "c2", title: "Paint something just for fun", category: "Creative", emoji: "🎨", description: "No expectations. Pick a color palette and see what happens." },
    { id: "c3", title: "Make a scrapbook page", category: "Creative", emoji: "✂️", description: "Collect photos, tickets, notes, and little memories." },
    { id: "c4", title: "Try a new craft", category: "Creative", emoji: "🧶", description: "Experiment with embroidery, crochet, collage, or something unfamiliar." },
    { id: "c5", title: "Make a playlist for a mood", category: "Creative", emoji: "🎧", description: "Build a soundtrack for a season, memory, or imaginary movie." },
    { id: "c6", title: "Take yourself on a creative date", category: "Creative", emoji: "🌷", description: "Bring a sketchbook or journal to a pretty place." },
    { id: "c7", title: "Decorate something in your room", category: "Creative", emoji: "🪴", description: "Refresh a little corner of your space." },

    // MOVEMENT
    { id: "m1", title: "Go bouldering", category: "Movement", emoji: "🧗", description: "Try a new route or revisit one you've been working on." },
    { id: "m2", title: "Take a long walk with music", category: "Movement", emoji: "🎶", description: "Get outside, put on a playlist, and enjoy moving." },
    { id: "m3", title: "Try a new gym workout", category: "Movement", emoji: "🏋️", description: "Switch up your usual routine and try something different." },
    { id: "m4", title: "Go for a scenic bike ride", category: "Movement", emoji: "🚲", description: "Explore a path or neighborhood at your own pace." },
    { id: "m5", title: "Try a beginner dance class", category: "Movement", emoji: "💃", description: "Move around, learn something new, and don't worry about being perfect." },
    { id: "m6", title: "Have a stretching and mobility session", category: "Movement", emoji: "🧘", description: "Put on calming music and give yourself time to reset." },
    { id: "m7", title: "Try a new outdoor activity", category: "Movement", emoji: "🌳", description: "Find something active you've never tried before." },

    // FOOD
    { id: "f1", title: "Cook a recipe you've never made", category: "Food", emoji: "🍳", description: "Pick something you've been curious about and give it a go." },
    { id: "f2", title: "Bake something from scratch", category: "Food", emoji: "🍪", description: "Make cookies, bread, cake, or another little treat." },
    { id: "f3", title: "Try making homemade pasta", category: "Food", emoji: "🍝", description: "Turn dinner into a fun kitchen experiment." },
    { id: "f4", title: "Have a homemade picnic", category: "Food", emoji: "🧺", description: "Prepare a few snacks and find somewhere nice to sit." },
    { id: "f5", title: "Recreate a favorite restaurant meal", category: "Food", emoji: "🥘", description: "Try making your own version of something you love." },
    { id: "f6", title: "Try a new dessert recipe", category: "Food", emoji: "🍰", description: "Find something delicious and experiment in the kitchen." },
    { id: "f7", title: "Make a fancy breakfast", category: "Food", emoji: "🥞", description: "Take your time and make an ordinary morning feel special." },

    // RESET
    { id: "r1", title: "Have a cozy reading afternoon", category: "Reset", emoji: "📖", description: "Find a comfortable spot and get lost in a book." },
    { id: "r2", title: "Have a movie night", category: "Reset", emoji: "🍿", description: "Pick a movie, make some snacks, and get comfortable." },
    { id: "r3", title: "Have a phone-free hour", category: "Reset", emoji: "🌿", description: "Put your phone away and enjoy being present." },
    { id: "r4", title: "Make yourself a spa evening", category: "Reset", emoji: "🛁", description: "Take a warm shower, do some skincare, and slow down." },
    { id: "r5", title: "Spend an afternoon doing absolutely nothing", category: "Reset", emoji: "☁️", description: "No plans, no checklist, no guilt. Just relax." },
    { id: "r6", title: "Listen to an album from start to finish", category: "Reset", emoji: "🎵", description: "Give an album your full attention without multitasking." },
    { id: "r7", title: "Have a slow morning", category: "Reset", emoji: "🌤️", description: "Make a nice drink, take your time, and ease into the day." }
];

const LIVE_CATEGORIES = ["All", "Explore", "Creative", "Movement", "Food", "Reset"];

let currentLiveCategory = "All";
let currentLiveActivity = null;

function loadLiveFavorites() {
    try {
        return JSON.parse(localStorage.getItem(LIVE_STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Could not load LIVE favorites:", error);
        return [];
    }
}

function saveLiveFavorites(favorites) {
    localStorage.setItem(LIVE_STORAGE_KEY, JSON.stringify(favorites));
}

function initializeLiveStudio() {
    const root = document.getElementById("live-studio-root");

    if (!root || root.dataset.initialized === "true") return;

    root.dataset.initialized = "true";
    root.addEventListener("click", handleLiveClick);

    renderLiveGenerator();
}

function renderLiveGenerator() {
    const root = document.getElementById("live-generator-root");
    if (!root) return;

    const favorites = loadLiveFavorites();

    root.innerHTML = `
        <div class="live-generator">

            <div class="live-category-tabs">
                ${LIVE_CATEGORIES.map(category => `
                    <button
                        class="live-category-button ${
                            currentLiveCategory === category ? "active" : ""
                        }"
                        data-live-action="category"
                        data-category="${category}">
                        ${category}
                    </button>
                `).join("")}
            </div>

            <div class="live-activity-display" id="live-activity-display">
                ${
                    currentLiveActivity
                        ? renderLiveActivity(currentLiveActivity, favorites)
                        : `
                            <div class="live-generator-placeholder">
                                <span>✿</span>
                                <h3>A little inspiration awaits.</h3>
                                <p>Choose a category or let us surprise you.</p>
                            </div>
                        `
                }
            </div>

            <button class="live-generate-button"
                data-live-action="generate">
                ✨ Surprise me
            </button>

            <div class="live-favorites-section">

                <div class="live-favorites-heading">
                    <div>
                        <span class="section-eyebrow">YOUR LITTLE COLLECTION</span>
                        <h3>Saved activities ♡</h3>
                    </div>

                    <span class="live-favorites-count">
                        ${favorites.length} saved
                    </span>
                </div>

                <div class="live-favorites-list">
                    ${
                        favorites.length
                            ? favorites.map(renderLiveFavorite).join("")
                            : `
                                <div class="live-no-favorites">
                                    <span>♡</span>
                                    <p>Your favorite ideas will find a home here.</p>
                                </div>
                            `
                    }
                </div>

            </div>

        </div>
    `;
}

function renderLiveActivity(activity, favorites) {
    const isFavorite = favorites.includes(activity.id);

    return `
        <div class="live-activity-card">
            <span class="live-activity-emoji">${activity.emoji}</span>

            <span class="live-activity-category">
                ${activity.category.toUpperCase()}
            </span>

            <h3>${activity.title}</h3>
            <p>${activity.description}</p>

            <button
                class="live-save-button ${isFavorite ? "saved" : ""}"
                data-live-action="favorite"
                data-id="${activity.id}">
                ${isFavorite ? "♥ Saved to favorites" : "♡ Save this idea"}
            </button>
        </div>
    `;
}

function renderLiveFavorite(id) {
    const activity = LIVE_ACTIVITIES.find(item => item.id === id);
    if (!activity) return "";

    return `
        <div class="live-favorite-item">
            <span class="live-favorite-emoji">${activity.emoji}</span>

            <div class="live-favorite-info">
                <h4>${activity.title}</h4>
                <span>${activity.category}</span>
            </div>

            <button
                class="live-remove-favorite"
                data-live-action="remove-favorite"
                data-id="${activity.id}"
                aria-label="Remove favorite">
                ×
            </button>
        </div>
    `;
}

function generateLiveActivity() {
    let options = LIVE_ACTIVITIES.filter(activity =>
        currentLiveCategory === "All" ||
        activity.category === currentLiveCategory
    );

    if (!options.length) return;

    if (options.length > 1 && currentLiveActivity) {
        const alternatives = options.filter(item =>
            item.id !== currentLiveActivity.id
        );

        if (alternatives.length) options = alternatives;
    }

    const randomIndex = Math.floor(Math.random() * options.length);
    currentLiveActivity = options[randomIndex];

    renderLiveGenerator();
}

function handleLiveClick(event) {
    const button = event.target.closest("[data-live-action]");
    if (!button) return;

    const action = button.dataset.liveAction;
    const id = button.dataset.id;

    if (action === "category") {
        currentLiveCategory = button.dataset.category;
        currentLiveActivity = null;
        renderLiveGenerator();
        return;
    }

    if (action === "generate") {
        generateLiveActivity();
        return;
    }

    if (action === "favorite") {
        const favorites = loadLiveFavorites();

        if (!favorites.includes(id)) {
            favorites.unshift(id);
        } else {
            const index = favorites.indexOf(id);
            favorites.splice(index, 1);
        }

        saveLiveFavorites(favorites);
        renderLiveGenerator();
        return;
    }

    if (action === "remove-favorite") {
        const favorites = loadLiveFavorites().filter(
            favoriteId => favoriteId !== id
        );

        saveLiveFavorites(favorites);
        renderLiveGenerator();
    }
}

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "live") {
        initializeLiveStudio();
        renderLiveGenerator();
    }
});
