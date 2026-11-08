
/* ==========================================
   VERDE — APPLICATION ENGINE
   Version 1.1
========================================== */


/* ==========================================
   1. INITIALIZE THE APPLICATION
========================================== */

const mainContent = document.querySelector(".main-content");
const topbar = document.querySelector(".topbar");
const breadcrumb = document.querySelector(".breadcrumb");
const navItems = document.querySelectorAll(".nav-item");

// Make sure the page container exists.
// This automatically fixes the missing-container error.

let pageContainer = document.getElementById("page-container");

if (!pageContainer) {

    if (!mainContent || !topbar) {
        throw new Error(
            "VERDE could not find the main content or topbar."
        );
    }

    pageContainer = document.createElement("div");
    pageContainer.id = "page-container";

    let nextElement = topbar.nextSibling;

    while (nextElement) {
        const currentElement = nextElement;
        nextElement = nextElement.nextSibling;
        pageContainer.appendChild(currentElement);
    }

    mainContent.appendChild(pageContainer);

    console.log("VERDE: Page container created automatically.");
}

// Save the original homepage.
const homeContent = pageContainer.innerHTML;


/* ==========================================
   2. REUSABLE HTML HELPERS
========================================== */

// Creates numbered milestone lists.

function createMilestones(items) {

    return items.map((item, index) => `
        <div class="milestone">
            <span class="milestone-number">
                ${index + 1}
            </span>
            <span>${item}</span>
        </div>
    `).join("");

}


// Creates weekly schedule entries.

function createWeeklySchedule(items) {

    return items.map(item => `
        <div class="workspace-list-item">
            <span class="item-icon">${item.icon}</span>
            <div>
                <strong>${item.day}</strong>
                <p>${item.pillar}</p>
            </div>
        </div>
    `).join("");

}


/* ==========================================
   3. PAGE CONTENT
========================================== */

const pages = {

    // DAILY FOCUS

    
daily: {
    eyebrow: "YOUR DAILY SPACE",
    title: "Daily Focus ☀",
    description: "A little intention goes a long way.",

    content: `
        <div class="workspace-banner purple">
            <span class="section-eyebrow">TODAY IS YOURS</span>
            <h3>What kind of day are we having?</h3>
            <p>Choose your energy level. There's no wrong answer.</p>
        </div>

        <section class="workspace-section daily-energy-section">
            <h3>Choose your energy</h3>

            <div class="energy-grid">

                <button class="energy-card" data-energy="low">
                    <span>🌙</span>
                    <h4>Low energy</h4>
                    <p>Take it easy. Read, journal, organize, or rest.</p>
                </button>

                <button class="energy-card" data-energy="normal">
                    <span>☀️</span>
                    <h4>Normal energy</h4>
                    <p>Choose one project and spend some focused time on it.</p>
                </button>

                <button class="energy-card" data-energy="high">
                    <span>⚡</span>
                    <h4>High energy</h4>
                    <p>Experiment, explore, and make progress on multiple things.</p>
                </button>

            </div>
        </section>

        <section id="daily-suggestions-section" class="workspace-section" hidden>
            <div id="daily-suggestions-root"></div>
        </section>

        <section id="daily-intentions-section" class="workspace-section" hidden>
            <div id="daily-intentions-root"></div>
        </section>
    `
},

    // BUILD

    
build: {

    eyebrow: "PILLAR 01 · CREATE & EXPERIMENT",
    title: "Build 💻",
    description: "Turn ideas into something real.",

    content: `

        <div class="workspace-banner green">
            <span class="section-eyebrow">CURRENT NOVEMBER PROJECT</span>
            <h3>Computer Vision Camera 📷</h3>
            <p>
                Learn to use your laptop camera, Python, and computer
                vision to detect objects, movements, and interesting events.
            </p>
        </div>

        <section class="workspace-section">

            <details class="roadmap-dropdown">

                <summary class="roadmap-summary">
                    <div>
                        <span class="eyebrow">YOUR LEARNING PATH</span>
                        <h3>Learning roadmap</h3>
                        <p>Explore the steps of your project.</p>
                    </div>

                    <span class="roadmap-arrow">⌄</span>
                </summary>

                <div class="milestone-list roadmap-content">

                    ${createMilestones([
                        "Explore the basics of computer vision",
                        "Set up Python and OpenCV",
                        "Access the laptop webcam",
                        "Implement basic motion detection",
                        "Experiment with object detection",
                        "Explore gesture recognition",
                        "Decide on the final application",
                        "Build a working prototype"
                    ])}

                </div>

            </details>

        </section>

    `
},

build: {

    eyebrow: "PILLAR 01 · CREATE & EXPERIMENT",
    title: "Build 💻",
    description: "Turn ideas into something real.",

    content: `

        <div class="workspace-banner green">
            <span class="section-eyebrow">CURRENT NOVEMBER PROJECT</span>
            <h3>Computer Vision Camera 📷</h3>
            <p>
                Learn to use your laptop camera, Python, and computer
                vision to detect objects, movements, and interesting events.
            </p>
        </div>

        <section class="workspace-section">

            <details class="roadmap-dropdown">

                <summary class="roadmap-summary">
                    <div>
                        <span class="eyebrow">YOUR LEARNING PATH</span>
                        <h3>Learning roadmap</h3>
                        <p>Explore the steps of your project.</p>
                    </div>

                    <span class="roadmap-arrow">⌄</span>
                </summary>

                <div class="milestone-list roadmap-content">

                    ${createMilestones([
                        "Explore the basics of computer vision",
                        "Set up Python and OpenCV",
                        "Access the laptop webcam",
                        "Implement basic motion detection",
                        "Experiment with object detection",
                        "Explore gesture recognition",
                        "Decide on the final application",
                        "Build a working prototype"
                    ])}

                </div>

            </details>

        </section>

    `
},



    // CREATE

    
ideas: {
    eyebrow: "YOUR PERSONAL IDEA COLLECTION",
    title: "Idea Vault ✧",
    description: "A home for every random thought worth keeping.",
    content: `
        <div id="idea-vault-root"></div>
    `
},

create: {
    eyebrow: "MAKE SOMETHING JUST BECAUSE",
    title: "Creative Studio",
    description: "A little space to write, reflect, experiment, and make things.",
    content: `
        <div id="create-studio-root"></div>
    `
},



    // LEARN

    
    learn: {

        eyebrow: "PILLAR 03 · DISCOVER & EXPLORE",
        title: "The Knowledge Garden 🌿",
        description: "Follow your curiosity, collect discoveries, and let ideas grow.",

        content: `

            <div id="learn-studio-root" class="learn-studio">

                <div class="learn-welcome">
                    <div class="learn-welcome-text">
                        <span class="section-eyebrow">A LITTLE SPACE FOR CURIOSITY</span>
                        <h2>Grow your mind.<br><em>One discovery at a time.</em></h2>
                        <p>
                            Read something interesting. Follow a question.
                            Explore something completely unfamiliar.
                            There's no syllabus here.
                        </p>
                    </div>
                    <div class="learn-welcome-decoration">
                        <span>✿</span>
                        <span>❧</span>
                        <span>🌱</span>
                    </div>
                </div>

                <div class="learn-section-heading">
                    <div>
                        <span class="section-eyebrow">YOUR LEARNING SPACE</span>
                        <h3>Where would you like to wander?</h3>
                    </div>
                </div>

                        
        <div class="learn-feature-grid">

            <button class="learn-feature-card library-card"
                data-learn-action="library">

                <span class="learn-card-icon">📚</span>
                <span class="learn-card-label">YOUR PERSONAL COLLECTION</span>

                <h4>Research Library</h4>

                <p>
                    Save research papers, articles, books, videos,
                    and interesting discoveries. Organize your resources,
                    track what you're reading, and keep your own notes.
                </p>

                <span class="learn-card-link">Explore your library ↗</span>

            </button>

        </div>


                <div class="learn-section-heading explore-heading">
                    <div>
                        <span class="section-eyebrow">FOLLOW YOUR CURIOSITY</span>
                        <h3>Explore your interests</h3>
                        <p>Little paths you can wander down whenever you like.</p>
                    </div>
                </div>

                <div class="learn-topic-grid">

                    <div class="learn-topic-card">
                        <span>🧠</span>
                        <div>
                            <h4>Neuroscience</h4>
                            <p>Brain function, behavior, cognition, and neurotoxicology.</p>
                        </div>
                    </div>

                    <div class="learn-topic-card">
                        <span>🌱</span>
                        <div>
                            <h4>Environmental Science</h4>
                            <p>Environmental toxicants, plant toxins, and ecosystems.</p>
                        </div>
                    </div>

                    <div class="learn-topic-card">
                        <span>🤖</span>
                        <div>
                            <h4>Artificial Intelligence</h4>
                            <p>Machine learning, computer vision, and emerging technology.</p>
                        </div>
                    </div>

                    <div class="learn-topic-card">
                        <span>🌍</span>
                        <div>
                            <h4>Psychology & Society</h4>
                            <p>Human behavior, economics, philosophy, and history.</p>
                        </div>
                    </div>

                </div>

                <div class="learn-bottom-note">
                    <span>✧</span>
                    <p>
                        You don't have to learn something every day.
                        Sometimes following one interesting question is enough.
                    </p>
                </div>

                <section id="learn-library-view" hidden></section>

            </div>

        `
    },



    // ADVANCE

    advance: {
    eyebrow: "PILLAR 04 · GROW & DEVELOP",
    title: "Advance 🚀",
    description: "Build toward the future you're excited about.",

    content: `
        <div class="workspace-banner purple">
            <span class="section-eyebrow">PROFESSIONAL DEVELOPMENT</span>
            <h3>Your future is something you build.</h3>
            <p>
                Keep track of opportunities, organize your applications,
                and take meaningful steps toward your career.
            </p>
        </div>

        <div id="advance-studio-root" class="advance-studio">

            <section id="advance-applications-view"></section>

        </div> 
    `
},


    // LIVE

    
    live: {
    eyebrow: "PILLAR 05 · EXPERIENCE & ENJOY",
    title: "Live 🌿",
    description: "Enjoy the life you're building.",

    content: `
        <div id="live-studio-root" class="live-studio">

            <div class="live-welcome">
                <span class="section-eyebrow">A LITTLE REMINDER</span>

                <h2>Life isn't just about<br>
                    <em>what you accomplish.</em>
                </h2>

                <p>
                    Make room for spontaneous adventures,
                    little joys, new experiences, and doing
                    absolutely nothing.
                </p>

                <div class="live-decoration">☘︎ ✿ ❀</div>
            </div>

            <section class="live-inspiration-section">

                <div class="live-section-heading">
                    <span class="section-eyebrow">WHEN YOU NEED A LITTLE INSPIRATION</span>
                    <h3>What should we do today?</h3>
                    <p>
                        Let a little spontaneity decide.
                    </p>
                </div>

                <div id="live-generator-root"></div>

            </section>

            <div class="live-bottom-note">
                <span>🌿</span>
                <p>
                    You don't have to make every day meaningful.
                    Sometimes enjoying an ordinary day is enough.
                </p>
            </div>

        </div>
    `
},


    // IDEA VAULT

    
        ideas: {
        eyebrow: "YOUR PERSONAL IDEA COLLECTION",
        title: "Idea Vault ✧",
        description: "A home for every random thought worth keeping.",
        content: `
            <div id="idea-vault-root"></div>
        `
    },

    // SETTINGS
    settings: {
        eyebrow: "MAKE VERDE YOUR OWN",
        title: "Settings ⚙",
        description: "A little space to personalize your universe.",
        content: `
            <div id="settings-root"></div>
        `
    },

};


/* ==========================================
   4. NAVIGATION ENGINE
========================================== */

function navigateTo(pageName) {

    // Display the homepage.

    if (pageName === "home") {

        pageContainer.innerHTML = homeContent;

    }

    // Display another workspace.

    else if (pages[pageName]) {

        const page = pages[pageName];

        pageContainer.innerHTML = `

            <section class="page-header">

                <span class="eyebrow">
                    ${page.eyebrow}
                </span>

                <h2>${page.title}</h2>

                <p>${page.description}</p>

            </section>

            ${page.content}

            <footer>
                <span>MADE WITH ♡ AND A LITTLE CURIOSITY</span>
                <span>VERDE · 2026</span>
            </footer>

        `;

    }

    else {
        console.warn("VERDE: Page not found:", pageName);
        return;
    }


    // Update sidebar selection.

    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageName
        );

    });


    // Update breadcrumb.

    const selectedItem = document.querySelector(
        `.nav-item[data-page="${pageName}"]`
    );

    const pageLabel = selectedItem
        ? selectedItem.textContent.trim()
        : "Home";

    breadcrumb.innerHTML =
        `My Universe <span>/</span> ${pageLabel}`;


    // Reconnect homepage interactions.

    if (pageName === "home") {
        attachHomeEvents();
    }


    // Return to top when switching pages.

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Notify other application modules that the page changed.

    document.dispatchEvent(
    new CustomEvent("verde:pagechange", {
        detail: { pageName: pageName }
    })
);

// Initialize the BUILD task manager when opening BUILD.

if (
    pageName === "build" &&
    typeof initializeTaskManager === "function"
) {
    initializeTaskManager();
}

}


/* ==========================================
   5. SIDEBAR INTERACTIONS
========================================== */

navItems.forEach(item => {

    item.addEventListener("click", event => {

        event.preventDefault();

        navigateTo(item.dataset.page);

    });

});


/* ==========================================
   6. HOMEPAGE INTERACTIONS
========================================== */

function attachHomeEvents() {

    // Make pillar cards clickable.

    const pillarCards = document.querySelectorAll(
        ".pillar-card"
    );

    pillarCards.forEach(card => {

        card.addEventListener("click", () => {

            navigateTo(card.dataset.pillar);

        });

    });


    // Connect the daily focus button.

    const focusButton = document.getElementById(
        "focus-button"
    );

    if (focusButton) {

        focusButton.addEventListener("click", () => {

            navigateTo("daily");

        });

    }

}


/* ==========================================
   7. DISPLAY CURRENT DATE
========================================== */

function updateDate() {

    const dateElement = document.getElementById(
        "current-date"
    );

    if (!dateElement) return;

    const today = new Date();

    dateElement.textContent = today.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* ==========================================
   8. START VERDE
========================================== */

updateDate();

attachHomeEvents();

console.log("🌿 VERDE initialized successfully!");

