
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

            <section class="workspace-section">
                <h3>Choose your energy</h3>

                <div class="energy-grid">

                    <div class="energy-card">
                        <span>🌙</span>
                        <h4>Low energy</h4>
                        <p>Take it easy. Read, journal, organize, or rest.</p>
                    </div>

                    <div class="energy-card">
                        <span>☀️</span>
                        <h4>Normal energy</h4>
                        <p>Choose one project and spend some focused time on it.</p>
                    </div>

                    <div class="energy-card">
                        <span>⚡</span>
                        <h4>High energy</h4>
                        <p>Experiment, explore, and make progress on multiple things.</p>
                    </div>

                </div>
            </section>

            <section class="workspace-section">
                <h3>Today's intentions</h3>

                <div class="workspace-card">
                    <p>Your interactive daily task manager is coming soon!</p>
                </div>
            </section>

        `
    },


    // WEEKLY OVERVIEW

    weekly: {

        eyebrow: "YOUR WEEK AT A GLANCE",
        title: "Weekly Overview 🗓",
        description: "A flexible rhythm for everything you want to explore.",

        content: `

            <div class="workspace-banner green">
                <span class="section-eyebrow">YOUR WEEKLY RHYTHM</span>
                <h3>Make room for what matters.</h3>
                <p>Use these themes as a guide, not a strict schedule.</p>
            </div>

            <section class="workspace-section">
                <h3>Your pillar rotation</h3>

                <div class="workspace-list">

                    ${createWeeklySchedule([
                        {day: "Monday", icon: "💻", pillar: "BUILD"},
                        {day: "Tuesday", icon: "🚀", pillar: "ADVANCE"},
                        {day: "Wednesday", icon: "📚", pillar: "LEARN"},
                        {day: "Thursday", icon: "💻", pillar: "BUILD"},
                        {day: "Friday", icon: "🚀", pillar: "ADVANCE"},
                        {day: "Saturday", icon: "🌿", pillar: "LIVE"},
                        {day: "Sunday", icon: "🌿", pillar: "LIVE / REST"}
                    ])}

                </div>
            </section>

            <div class="workspace-note green-note">
                ✿ Remember: missed tasks are not debts.
                Adjust your week as needed.
            </div>

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
                        <span class="learn-card-label">COLLECT & READ</span>
                        <h4>Research Library</h4>
                        <p>
                            Save papers, articles, books, videos,
                            and anything worth exploring.
                        </p>
                        <span class="learn-card-link">Open library ↗</span>
                    </button>

                    <button class="learn-feature-card journal-card"
                        data-learn-action="journal">
                        <span class="learn-card-icon">✎</span>
                        <span class="learn-card-label">REFLECT & REMEMBER</span>
                        <h4>Learning Journal</h4>
                        <p>
                            Record discoveries, interesting thoughts,
                            questions, and things you've learned.
                        </p>
                        <span class="learn-card-link">Open journal ↗</span>
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
                <section id="learn-journal-view" hidden></section>

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
                    Develop your professional presence and explore
                    opportunities that align with your interests.
                </p>
            </div>

            <div class="workspace-grid">

                <div class="workspace-card">
                    <span class="workspace-icon">🌐</span>
                    <h4>Personal website</h4>
                    <p>
                        Build your online portfolio, showcase projects,
                        research interests, experience, and skills.
                    </p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">💼</span>
                    <h4>Internship applications</h4>
                    <p>Research and apply to Summer 2027 opportunities.</p>
                </div>

            </div>

            <section class="workspace-section">
                <h3>November objectives</h3>

                <div class="milestone-list">

                    ${createMilestones([
                        "Plan personal website structure",
                        "Build the website",
                        "Add resume and experience",
                        "Find relevant internships",
                        "Submit 3–5 thoughtful applications"
                    ])}

                </div>
            </section>

        `
    },


    // LIVE

    live: {

        eyebrow: "PILLAR 05 · EXPERIENCE & ENJOY",
        title: "Live 🌿",
        description: "Enjoy the life you're building.",

        content: `

            <div class="workspace-banner green">
                <span class="section-eyebrow">GUILT-FREE LIVING</span>
                <h3>You are allowed to just enjoy things.</h3>
                <p>
                    This isn't another productivity project.
                    It's a reminder that your life is happening right now.
                </p>
            </div>

            <div class="workspace-grid">

                <div class="workspace-card">
                    <span class="workspace-icon">🧗</span>
                    <h4>Climbing & fitness</h4>
                    <p>Bouldering, gym sessions, and physical activities.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🎨</span>
                    <h4>Arts & crafts</h4>
                    <p>Creative events and making things with your hands.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🍳</span>
                    <h4>Cooking</h4>
                    <p>New recipes, experimenting, and good food.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🫶</span>
                    <h4>People & experiences</h4>
                    <p>Friends, loved ones, exploring, and trying new things.</p>
                </div>

            </div>

            <div class="workspace-note green-note">
                🌿 No productivity scores. No required milestones.
                Enjoy your life.
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



    // RESOURCES

    resources: {

        eyebrow: "YOUR PERSONAL LIBRARY",
        title: "Resources ♡",
        description: "Keep the things you want to revisit close.",

        content: `

            <div class="workspace-banner green">
                <span class="section-eyebrow">SAVE FOR LATER</span>
                <h3>A collection of things worth exploring.</h3>
                <p>
                    Books, tutorials, articles, research papers,
                    videos, and inspiration.
                </p>
            </div>

            <div class="workspace-grid">

                <div class="workspace-card">
                    <span class="workspace-icon">📖</span>
                    <h4>Books & reading</h4>
                    <p>Fiction, nonfiction, and books to explore.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🔬</span>
                    <h4>Research & articles</h4>
                    <p>Scientific papers and interesting discoveries.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🎓</span>
                    <h4>Courses & tutorials</h4>
                    <p>Learning resources and educational material.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">✨</span>
                    <h4>Inspiration</h4>
                    <p>Websites, designs, projects, and ideas.</p>
                </div>

            </div>

        `
    }

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

