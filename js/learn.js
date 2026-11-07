
/* =========================================
   VERDE — LEARN / RESEARCH LIBRARY
========================================= */

const LEARN_STORAGE_KEY = "verde_research_library_v1";

let currentResourceId = null;
let currentLibraryFilter = "All";
let currentLibrarySearch = "";

const RESOURCE_TYPES = [
    "Research Paper",
    "Article",
    "Book",
    "Video",
    "Website",
    "Other"
];

const RESOURCE_SUBJECTS = [
    "Neuroscience",
    "Environmental Science",
    "Toxicology",
    "Artificial Intelligence",
    "Psychology",
    "Economics",
    "Philosophy",
    "History",
    "Other"
];

function loadResources() {
    try {
        return JSON.parse(
            localStorage.getItem(LEARN_STORAGE_KEY)
        ) || [];
    } catch (error) {
        console.error("Could not load research library:", error);
        return [];
    }
}

function saveResources(resources) {
    localStorage.setItem(
        LEARN_STORAGE_KEY,
        JSON.stringify(resources)
    );
}

function escapeLearnHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function initializeLearnStudio() {
    const root = document.getElementById("learn-studio-root");

    if (!root || root.dataset.initialized === "true") return;

    root.dataset.initialized = "true";

    root.addEventListener("click", handleLearnClick);
    root.addEventListener("submit", handleLearnSubmit);
    root.addEventListener("input", handleLearnInput);

    showLearnHome();
}

function showLearnHome() {
    const root = document.getElementById("learn-studio-root");
    if (!root) return;

    root.querySelector(".learn-welcome").hidden = false;
    root.querySelectorAll(
        ".learn-section-heading, .learn-feature-grid, .learn-topic-grid, .learn-bottom-note"
    ).forEach(element => {
        element.hidden = false;
    });

    root.querySelector("#learn-library-view").hidden = true;
    root.querySelector("#learn-journal-view").hidden = true;
}

function showResearchLibrary() {
    const root = document.getElementById("learn-studio-root");
    if (!root) return;

    root.querySelector(".learn-welcome").hidden = true;

    root.querySelectorAll(
        ".learn-section-heading, .learn-feature-grid, .learn-topic-grid, .learn-bottom-note"
    ).forEach(element => {
        element.hidden = true;
    });

    root.querySelector("#learn-journal-view").hidden = true;

    const view = root.querySelector("#learn-library-view");
    view.hidden = false;

    currentResourceId = null;
    renderResearchLibrary();
}

function renderResearchLibrary() {
    const view = document.getElementById("learn-library-view");
    if (!view) return;

    const resources = loadResources();

    const filteredResources = resources.filter(resource => {
        const matchesFilter =
            currentLibraryFilter === "All" ||
            resource.status === currentLibraryFilter;

        const searchText = [
            resource.title,
            resource.author,
            resource.subject,
            resource.type,
            resource.notes
        ].join(" ").toLowerCase();

        const matchesSearch = searchText.includes(
            currentLibrarySearch.toLowerCase()
        );

        return matchesFilter && matchesSearch;
    });

    const statuses = ["All", "To Read", "Reading", "Finished"];

    view.innerHTML = `
        <div class="learn-library-page">

            <button class="learn-back-button"
                data-learn-action="home">
                ← Back to Knowledge Garden
            </button>

            <div class="learn-library-header">
                <div>
                    <span class="section-eyebrow">YOUR PERSONAL COLLECTION</span>
                    <h2>Research Library</h2>
                    <p>Every interesting thing you've found, all in one place.</p>
                </div>

                <button class="learn-add-button"
                    data-learn-action="new-resource">
                    + Add resource
                </button>
            </div>

            <div class="learn-library-stats">
                <div>
                    <strong>${resources.length}</strong>
                    <span>Total saved</span>
                </div>
                <div>
                    <strong>${resources.filter(item => item.status === "Reading").length}</strong>
                    <span>Currently reading</span>
                </div>
                <div>
                    <strong>${resources.filter(item => item.status === "Finished").length}</strong>
                    <span>Finished</span>
                </div>
            </div>

            <div class="learn-library-search">
                <span>⌕</span>
                <input
                    type="search"
                    id="learn-resource-search"
                    placeholder="Search your collection..."
                    value="${escapeLearnHTML(currentLibrarySearch)}"
                >
            </div>

            <div class="learn-filter-tabs">
                ${statuses.map(status => `
                    <button
                        class="${currentLibraryFilter === status ? "active" : ""}"
                        data-learn-action="filter"
                        data-filter="${status}">
                        ${status}
                    </button>
                `).join("")}
            </div>

            <div class="learn-resource-grid">
                ${filteredResources.length ? filteredResources.map(resource => `
                    <article class="learn-resource-card">

                        <div class="learn-resource-card-top">
                            <span class="learn-resource-type">
                                ${escapeLearnHTML(resource.type)}
                            </span>
                            <span class="learn-resource-status ${resource.status.toLowerCase().replace(" ", "-")}">
                                ${escapeLearnHTML(resource.status)}
                            </span>
                        </div>

                        <h3>${escapeLearnHTML(resource.title)}</h3>

                        <p class="learn-resource-author">
                            ${escapeLearnHTML(resource.author || "Author not specified")}
                        </p>

                        <span class="learn-resource-subject">
                            ${escapeLearnHTML(resource.subject)}
                        </span>

                        <p class="learn-resource-notes">
                            ${escapeLearnHTML(resource.notes || "No notes added yet.")}
                        </p>

                        <button class="learn-resource-open"
                            data-learn-action="open-resource"
                            data-id="${resource.id}">
                            Open resource →
                        </button>

                    </article>
                `).join("") : `
                    <div class="learn-empty-state">
                        <span>🌱</span>
                        <h3>Nothing here just yet.</h3>
                        <p>
                            ${resources.length
                                ? "Try another search or filter."
                                : "Your research collection starts with one interesting discovery."}
                        </p>
                        ${resources.length ? "" : `
                            <button class="learn-add-button"
                                data-learn-action="new-resource">
                                Add your first resource
                            </button>
                        `}
                    </div>
                `}
            </div>

        </div>
    `;
}

function showResourceForm(resource = null) {
    const view = document.getElementById("learn-library-view");
    if (!view) return;

    currentResourceId = resource ? resource.id : null;

    view.innerHTML = `
        <div class="learn-resource-editor">

            <button class="learn-back-button"
                data-learn-action="back-library">
                ← Back to library
            </button>

            <div class="learn-editor-heading">
                <span class="section-eyebrow">ADD TO YOUR COLLECTION</span>
                <h2>${resource ? "Edit resource" : "A new discovery ✧"}</h2>
                <p>Save something interesting to come back to later.</p>
            </div>

            <form id="learn-resource-form">

                <label>
                    Resource title *
                    <input name="title" required
                        placeholder="e.g. The effects of PFAS exposure..."
                        value="${escapeLearnHTML(resource?.title || "")}">
                </label>

                <div class="learn-form-row">
                    <label>
                        Resource type
                        <select name="type">
                            ${RESOURCE_TYPES.map(type => `
                                <option value="${type}"
                                    ${resource?.type === type ? "selected" : ""}>
                                    ${type}
                                </option>
                            `).join("")}
                        </select>
                    </label>

                    <label>
                        Subject
                        <select name="subject">
                            ${RESOURCE_SUBJECTS.map(subject => `
                                <option value="${subject}"
                                    ${resource?.subject === subject ? "selected" : ""}>
                                    ${subject}
                                </option>
                            `).join("")}
                        </select>
                    </label>
                </div>

                <label>
                    Author / Creator
                    <input name="author"
                        placeholder="Who created this?"
                        value="${escapeLearnHTML(resource?.author || "")}">
                </label>

                <label>
                    Link or DOI
                    <input name="url" type="text"
                        placeholder="Paste a URL or DOI"
                        value="${escapeLearnHTML(resource?.url || "")}">
                </label>

                <label>
                    Reading status
                    <select name="status">
                        ${["To Read", "Reading", "Finished"].map(status => `
                            <option value="${status}"
                                ${resource?.status === status ? "selected" : ""}>
                                ${status}
                            </option>
                        `).join("")}
                    </select>
                </label>

                <label>
                    Personal notes
                    <textarea name="notes" rows="7"
                        placeholder="What caught your attention? What do you want to remember?">${escapeLearnHTML(resource?.notes || "")}</textarea>
                </label>

                <div class="learn-form-actions">
                    <button type="button" class="learn-cancel-button"
                        data-learn-action="back-library">
                        Cancel
                    </button>
                    <button type="submit" class="learn-add-button">
                        Save resource ✧
                    </button>
                </div>

            </form>
        </div>
    `;
}

function openResource(id) {
    const resource = loadResources().find(item => item.id === id);
    if (!resource) return;

    currentResourceId = id;

    const view = document.getElementById("learn-library-view");

    view.innerHTML = `
        <div class="learn-resource-editor">

            <button class="learn-back-button"
                data-learn-action="back-library">
                ← Back to library
            </button>

            <div class="learn-editor-heading">
                <span class="section-eyebrow">${escapeLearnHTML(resource.type)}</span>
                <h2>${escapeLearnHTML(resource.title)}</h2>
                <p>${escapeLearnHTML(resource.author || "Author not specified")}</p>
            </div>

            <div class="learn-resource-detail">

                <div class="learn-detail-meta">
                    <span>${escapeLearnHTML(resource.subject)}</span>
                    <span>${escapeLearnHTML(resource.status)}</span>
                </div>

                ${resource.url ? `
                    <a class="learn-resource-link"
                        href="${/^https?:\/\//i.test(resource.url)
                            ? escapeLearnHTML(resource.url)
                            : "https://doi.org/" + encodeURIComponent(resource.url.replace(/^doi:\s*/i, ""))}"
                        target="_blank"
                        rel="noopener noreferrer">
                        Open original resource ↗
                    </a>
                ` : ""}

                <h3>My notes & reflections</h3>

                <p class="learn-detail-notes">
                    ${escapeLearnHTML(resource.notes || "No notes added yet.")}
                </p>

                <p class="learn-detail-date">
                    Added ${new Date(resource.createdAt).toLocaleDateString()}
                </p>

            </div>

            <div class="learn-form-actions">
                <button class="learn-cancel-button"
                    data-learn-action="delete-resource"
                    data-id="${resource.id}">
                    Delete
                </button>

                <button class="learn-add-button"
                    data-learn-action="edit-resource"
                    data-id="${resource.id}">
                    Edit resource
                </button>
            </div>

        </div>
    `;
}

function handleLearnClick(event) {
    const button = event.target.closest("[data-learn-action]");
    if (!button) return;

    const action = button.dataset.learnAction;
    const id = button.dataset.id;

    if (action === "library") {
        showResearchLibrary();
        return;
    }

    if (action === "journal") {
        alert("The Learning Journal is coming next! 🌱");
        return;
    }

    if (action === "home") {
        showLearnHome();
        return;
    }

    if (action === "new-resource") {
        showResourceForm();
        return;
    }

    if (action === "back-library") {
        renderResearchLibrary();
        return;
    }

    if (action === "filter") {
        currentLibraryFilter = button.dataset.filter;
        renderResearchLibrary();
        return;
    }

    if (action === "open-resource") {
        openResource(id);
        return;
    }

    if (action === "edit-resource") {
        const resource = loadResources().find(item => item.id === id);
        if (resource) showResourceForm(resource);
        return;
    }

    if (action === "delete-resource") {
        if (!confirm("Delete this resource from your library?")) return;

        const resources = loadResources().filter(item => item.id !== id);
        saveResources(resources);
        renderResearchLibrary();
    }
}

function handleLearnSubmit(event) {
    if (event.target.id !== "learn-resource-form") return;

    event.preventDefault();

    const formData = new FormData(event.target);
    const resources = loadResources();

    const existing = resources.find(
        item => item.id === currentResourceId
    );

    const resource = {
        id: currentResourceId || (
            "resource-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7)
        ),
        title: formData.get("title").trim(),
        type: formData.get("type"),
        subject: formData.get("subject"),
        author: formData.get("author").trim(),
        url: formData.get("url").trim(),
        status: formData.get("status"),
        notes: formData.get("notes").trim(),
        createdAt: existing?.createdAt || Date.now(),
        updatedAt: Date.now()
    };

    if (!resource.title) return;

    if (existing) {
        const index = resources.findIndex(
            item => item.id === currentResourceId
        );
        resources[index] = resource;
    } else {
        resources.unshift(resource);
    }

    saveResources(resources);
    currentLibraryFilter = "All";
    currentLibrarySearch = "";

    renderResearchLibrary();
}

function handleLearnInput(event) {
    if (event.target.id === "learn-resource-search") {
        currentLibrarySearch = event.target.value;

        const position = event.target.selectionStart;
        renderResearchLibrary();

        const search = document.getElementById("learn-resource-search");
        search.focus();
        search.setSelectionRange(position, position);
    }
}

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "learn") {
        initializeLearnStudio();
        showLearnHome();
    }
});
