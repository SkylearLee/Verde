
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

    create: {

        eyebrow: "PILLAR 02 · EXPRESS & IMAGINE",
        title: "Create 🎨",
        description: "Make room for your creative side.",

        content: `

            <div class="workspace-banner purple">
                <span class="section-eyebrow">YOUR CREATIVE SPACE</span>
                <h3>Make things simply because you can.</h3>
                <p>
                    No deadlines, no quotas, no pressure.
                    Just a place for your imagination.
                </p>
            </div>

            <div class="workspace-grid">

                <div class="workspace-card">
                    <span class="workspace-icon">✍️</span>
                    <h4>Book writing</h4>
                    <p>Continue your manuscript whenever inspiration strikes.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">📓</span>
                    <h4>Journaling</h4>
                    <p>Thoughts, reflections, and random observations.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🖌️</span>
                    <h4>Art & drawing</h4>
                    <p>Sketching, painting, and experimenting with crafts.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">💡</span>
                    <h4>Creative experiments</h4>
                    <p>Try something new without worrying about the outcome.</p>
                </div>

            </div>

            <div class="workspace-note">
                ♡ You don't have to create something every week.
                This space is here whenever you need it.
            </div>

        `
    },


    // LEARN

    learn: {

        eyebrow: "PILLAR 03 · DISCOVER & EXPLORE",
        title: "Learn 📚",
        description: "Follow your curiosity beyond the classroom.",

        content: `

            <div class="workspace-banner green">
                <span class="section-eyebrow">CURIOSITY LAB</span>
                <h3>Your personal university.</h3>
                <p>
                    Explore topics because they interest you,
                    not because they're on an exam.
                </p>
            </div>

            <div class="workspace-grid">

                <div class="workspace-card">
                    <span class="workspace-icon">🧠</span>
                    <h4>Neuroscience</h4>
                    <p>Brain function, behavior, neurotoxicology, and cognition.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🌱</span>
                    <h4>Environmental science</h4>
                    <p>Environmental toxicants, plant toxins, and ecosystems.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🤖</span>
                    <h4>Artificial intelligence</h4>
                    <p>Machine learning, computer vision, and emerging technology.</p>
                </div>

                <div class="workspace-card">
                    <span class="workspace-icon">🌍</span>
                    <h4>General knowledge</h4>
                    <p>Psychology, philosophy, economics, and history.</p>
                </div>

            </div>

            <div class="workspace-note green-note">
                ✧ Save interesting discoveries, questions, and resources.
                Curiosity doesn't need a syllabus.
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

            <div class="workspace-banner purple">
                <span class="section-eyebrow">CATCH THE THOUGHT</span>
                <h3>Never lose a good idea again.</h3>
                <p>
                    A home for random ideas, unfinished concepts,
                    inventions, projects, and things you want to explore.
                </p>
            </div>

            <div class="workspace-card">
                <span class="workspace-icon">💭</span>
                <h4>Your idea collection is coming soon.</h4>
                <p>
                    We're going to build individual idea pages with titles,
                    notes, categories, tags, and the ability to turn an
                    idea into a project.
                </p>
            </div>

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

