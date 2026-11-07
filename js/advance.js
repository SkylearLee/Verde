
const ADVANCE_STORAGE_KEY = "verde_internships_v1";

let currentInternshipId = null;
let currentInternshipFilter = "All";
let currentInternshipSearch = "";

const INTERNSHIP_STATUSES = [
    "Interested",
    "Applied",
    "Interviewing",
    "Offer",
    "Rejected",
    "Withdrawn"
];

const APPLICATION_PROGRESS = [
    "Not started",
    "Started",
    "Completed"
];

// LOAD AND SAVE

function loadInternships() {
    try {
        return JSON.parse(localStorage.getItem(ADVANCE_STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Could not load internships:", error);
        return [];
    }
}

function saveInternships(internships) {
    localStorage.setItem(
        ADVANCE_STORAGE_KEY,
        JSON.stringify(internships)
    );
}

// SAFELY DISPLAY USER-ENTERED TEXT

function escapeAdvanceHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// INITIALIZE THE ADVANCE PAGE

function initializeAdvanceStudio() {
    const root = document.getElementById("advance-studio-root");

    if (!root || root.dataset.initialized === "true") return;

    root.dataset.initialized = "true";

    root.addEventListener("click", handleAdvanceClick);
    root.addEventListener("submit", handleAdvanceSubmit);
    root.addEventListener("input", handleAdvanceInput);

    renderInternshipTracker();
}

// MAIN TRACKER

function renderInternshipTracker() {
    const root = document.getElementById("advance-applications-view");
    if (!root) return;

    const internships = loadInternships();

    const interested = internships.filter(item =>
        item.status === "Interested"
    ).length;

    const inProgress = internships.filter(item =>
        item.progress === "Started"
    ).length;

    const submitted = internships.filter(item =>
        ["Applied", "Interviewing", "Offer"].includes(item.status)
    ).length;

    const upcoming = internships.filter(item => {
        if (!item.deadline || item.status === "Rejected" ||
            item.status === "Withdrawn") return false;

        const deadline = new Date(item.deadline + "T23:59:59");
        const now = new Date();
        const daysUntil = (deadline - now) / (1000 * 60 * 60 * 24);

        return daysUntil >= 0 && daysUntil <= 30;
    }).length;

    const filters = [
        "All",
        "Interested",
        "Applied",
        "Interviewing",
        "Offer",
        "Rejected",
        "Withdrawn"
    ];

    const filteredInternships = internships
        .filter(item => {
            const matchesFilter =
                currentInternshipFilter === "All" ||
                item.status === currentInternshipFilter;

            const searchText = [
                item.company,
                item.position,
                item.notes
            ].join(" ").toLowerCase();

            const matchesSearch =
                searchText.includes(currentInternshipSearch.toLowerCase());

            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });

    root.innerHTML = `
        <div class="advance-tracker">

            <div class="advance-tracker-heading">
                <div>
                    <span class="section-eyebrow">YOUR OPPORTUNITIES</span>
                    <h2>Internship Applications</h2>
                    <p>
                        Every opportunity starts somewhere.
                        Keep track of yours here.
                    </p>
                </div>

                <button class="advance-add-button"
                    data-advance-action="new">
                    + Add internship
                </button>
            </div>

            <div class="advance-stats">

                <div class="advance-stat-card">
                    <span>${internships.length}</span>
                    <p>Saved opportunities</p>
                </div>

                <div class="advance-stat-card">
                    <span>${inProgress}</span>
                    <p>In progress</p>
                </div>

                <div class="advance-stat-card">
                    <span>${submitted}</span>
                    <p>Submitted</p>
                </div>

                <div class="advance-stat-card">
                    <span>${upcoming}</span>
                    <p>Deadlines in 30 days</p>
                </div>

            </div>

            <div class="advance-toolbar">

                <input
                    type="search"
                    id="advance-search"
                    placeholder="Search companies, positions, or notes..."
                    value="${escapeAdvanceHTML(currentInternshipSearch)}"
                >

                <div class="advance-filter-tabs">
                    ${filters.map(filter => `
                        <button
                            class="advance-filter-button ${
                                currentInternshipFilter === filter ? "active" : ""
                            }"
                            data-advance-action="filter"
                            data-filter="${filter}">
                            ${filter}
                        </button>
                    `).join("")}
                </div>

            </div>

            <div class="advance-internship-list">

                ${
                    filteredInternships.length
                    ? filteredInternships.map(renderInternshipCard).join("")
                    : `
                        <div class="advance-empty-state">
                            <span>🌱</span>
                            <h3>${
                                internships.length
                                    ? "No matching opportunities."
                                    : "Your next opportunity starts here."
                            }</h3>
                            <p>${
                                internships.length
                                    ? "Try another filter or search term."
                                    : "Save internships you're interested in and keep all your applications organized."
                            }</p>
                            ${
                                internships.length
                                    ? ""
                                    : `<button class="advance-add-button"
                                        data-advance-action="new">
                                        Add your first internship
                                    </button>`
                            }
                        </div>
                    `
                }

            </div>

        </div>
    `;
}

// INDIVIDUAL INTERNSHIP CARD

function renderInternshipCard(item) {
    const statusClass = item.status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const deadlineText = item.deadline
        ? new Date(item.deadline + "T12:00:00").toLocaleDateString(
            undefined,
            { month: "short", day: "numeric", year: "numeric" }
        )
        : "No deadline added";

    return `
        <article class="advance-internship-card">

            <div class="advance-card-main">

                <div class="advance-card-title">
                    <div>
                        <h3>${escapeAdvanceHTML(item.position)}</h3>
                        <p>${escapeAdvanceHTML(item.company)}</p>
                    </div>

                    <span class="advance-status ${statusClass}">
                        ${escapeAdvanceHTML(item.status)}
                    </span>
                </div>

                <div class="advance-card-details">

                    <span>📅 ${deadlineText}</span>

                    <span class="advance-progress">
                        ${escapeAdvanceHTML(item.progress)}
                    </span>

                </div>

                ${
                    item.notes
                        ? `<p class="advance-card-notes">
                            ${escapeAdvanceHTML(item.notes)}
                           </p>`
                        : ""
                }

                <div class="advance-card-actions">

                    ${
                        item.url
                            ? `<a href="${escapeAdvanceHTML(item.url)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="advance-application-link">
                                View application ↗
                               </a>`
                            : `<span></span>`
                    }

                    <button data-advance-action="edit"
                        data-id="${item.id}">
                        Edit
                    </button>

                    <button data-advance-action="delete"
                        data-id="${item.id}">
                        Delete
                    </button>

                </div>

            </div>

        </article>
    `;
}

// ADD OR EDIT FORM

function showInternshipForm(item = null) {
    const root = document.getElementById("advance-applications-view");
    if (!root) return;

    currentInternshipId = item ? item.id : null;

    root.innerHTML = `
        <div class="advance-form-page">

            <button class="advance-back-button"
                data-advance-action="back">
                ← Back to applications
            </button>

            <div class="advance-form-heading">
                <span class="section-eyebrow">YOUR CAREER JOURNEY</span>
                <h2>${item ? "Edit opportunity" : "Add an internship"}</h2>
                <p>Keep the details somewhere you'll find them.</p>
            </div>

            <form id="advance-internship-form">

                <div class="advance-form-row">

                    <label>
                        Company name *
                        <input
                            name="company"
                            type="text"
                            placeholder="e.g. Cresilon"
                            value="${escapeAdvanceHTML(item?.company || "")}"
                            required
                        >
                    </label>

                    <label>
                        Position title *
                        <input
                            name="position"
                            type="text"
                            placeholder="e.g. Research Intern"
                            value="${escapeAdvanceHTML(item?.position || "")}"
                            required
                        >
                    </label>

                </div>

                <label>
                    Application URL
                    <input
                        name="url"
                        type="url"
                        placeholder="https://..."
                        value="${escapeAdvanceHTML(item?.url || "")}"
                    >
                </label>

                <div class="advance-form-row">

                    <label>
                        Application deadline
                        <input
                            name="deadline"
                            type="date"
                            value="${escapeAdvanceHTML(item?.deadline || "")}"
                        >
                    </label>

                    <label>
                        Application status
                        <select name="status">
                            ${INTERNSHIP_STATUSES.map(status => `
                                <option value="${status}"
                                    ${item?.status === status ? "selected" : ""}>
                                    ${status}
                                </option>
                            `).join("")}
                        </select>
                    </label>

                </div>

                <label>
                    Application progress
                    <select name="progress">
                        ${APPLICATION_PROGRESS.map(progress => `
                            <option value="${progress}"
                                ${item?.progress === progress ? "selected" : ""}>
                                ${progress}
                            </option>
                        `).join("")}
                    </select>
                </label>

                <label>
                    Notes
                    <textarea
                        name="notes"
                        rows="4"
                        placeholder="Requirements, things to prepare, contacts, or next steps..."
                    >${escapeAdvanceHTML(item?.notes || "")}</textarea>
                </label>

                <div class="advance-form-actions">

                    <button type="button"
                        class="advance-cancel-button"
                        data-advance-action="back">
                        Cancel
                    </button>

                    <button type="submit"
                        class="advance-add-button">
                        ${item ? "Save changes" : "Save internship"}
                    </button>

                </div>

            </form>

        </div>
    `;
}

// CLICK ACTIONS

function handleAdvanceClick(event) {
    const button = event.target.closest("[data-advance-action]");
    if (!button) return;

    const action = button.dataset.advanceAction;
    const id = button.dataset.id;

    if (action === "new") {
        showInternshipForm();
        return;
    }

    if (action === "back") {
        currentInternshipId = null;
        renderInternshipTracker();
        return;
    }

    if (action === "filter") {
        currentInternshipFilter = button.dataset.filter;
        renderInternshipTracker();
        return;
    }

    if (action === "edit") {
        const item = loadInternships().find(entry => entry.id === id);
        if (item) showInternshipForm(item);
        return;
    }

    if (action === "delete") {
        if (!confirm("Delete this internship opportunity?")) return;

        const internships = loadInternships().filter(
            entry => entry.id !== id
        );

        saveInternships(internships);
        renderInternshipTracker();
    }
}

// SAVE FORM

function handleAdvanceSubmit(event) {
    if (event.target.id !== "advance-internship-form") return;

    event.preventDefault();

    const formData = new FormData(event.target);
    const internships = loadInternships();

    const existing = internships.find(
        item => item.id === currentInternshipId
    );

    const url = formData.get("url").trim();

    const internship = {
        id: currentInternshipId ||
            "internship-" + Date.now() + "-" +
            Math.random().toString(36).slice(2, 7),

        company: formData.get("company").trim(),
        position: formData.get("position").trim(),
        url,
        deadline: formData.get("deadline"),
        status: formData.get("status"),
        progress: formData.get("progress"),
        notes: formData.get("notes").trim(),

        createdAt: existing?.createdAt || Date.now(),
        updatedAt: Date.now()
    };

    if (existing) {
        const index = internships.findIndex(
            item => item.id === currentInternshipId
        );

        internships[index] = internship;
    } else {
        internships.unshift(internship);
    }

    saveInternships(internships);

    currentInternshipId = null;
    currentInternshipFilter = "All";
    currentInternshipSearch = "";

    renderInternshipTracker();
}

// SEARCH

function handleAdvanceInput(event) {
    if (event.target.id !== "advance-search") return;

    currentInternshipSearch = event.target.value;

    const cursorPosition = event.target.selectionStart;

    renderInternshipTracker();

    const searchInput = document.getElementById("advance-search");

    searchInput.focus();
    searchInput.setSelectionRange(cursorPosition, cursorPosition);
}

// PAGE NAVIGATION

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "advance") {
        initializeAdvanceStudio();
        renderInternshipTracker();
    }
});
