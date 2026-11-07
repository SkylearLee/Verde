
const IDEA_STORAGE_KEY = "verde_ideas_v1";

let currentIdeaId = null;

function loadIdeas() {
    try {
        return JSON.parse(localStorage.getItem(IDEA_STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Could not load ideas:", error);
        return [];
    }
}

function saveIdeas(ideas) {
    localStorage.setItem(IDEA_STORAGE_KEY, JSON.stringify(ideas));
}

function createIdeaId() {
    return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}

function escapeIdeaHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function formatIdeaDate(date) {
    return new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function initializeIdeaVault() {
    const root = document.getElementById("idea-vault-root");

    if (!root || root.dataset.initialized === "true") return;

    root.dataset.initialized = "true";
    root.innerHTML = `
        <div class="idea-vault">
            <div class="idea-toolbar">
                <div class="idea-search-wrap">
                    <span>⌕</span>
                    <input
                        type="search"
                        id="idea-search"
                        placeholder="Search your ideas..."
                    >
                </div>

                <button class="idea-new-button" data-action="new">
                    + New idea
                </button>
            </div>

            <div class="idea-filter-row">
                <span class="idea-count" id="idea-count">0 ideas saved</span>

                <select id="idea-category-filter">
                    <option value="All">All categories</option>
                    <option value="BUILD">Build</option>
                    <option value="CREATE">Create</option>
                    <option value="LEARN">Learn</option>
                    <option value="ADVANCE">Advance</option>
                    <option value="LIVE">Live</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div id="idea-list-view">
                <div class="idea-grid" id="idea-grid"></div>
            </div>

            <div id="idea-editor-view" hidden></div>
        </div>
    `;

    root.addEventListener("click", handleIdeaClick);
    root.addEventListener("input", handleIdeaInput);
    root.addEventListener("change", handleIdeaInput);

    renderIdeaVault();
}

function renderIdeaVault() {
    const root = document.getElementById("idea-vault-root");
    if (!root) return;

    const ideas = loadIdeas();
    const search = root.querySelector("#idea-search").value.toLowerCase();
    const category = root.querySelector("#idea-category-filter").value;

    const filteredIdeas = ideas.filter(idea => {
        const matchesSearch =
            idea.title.toLowerCase().includes(search) ||
            idea.notes.toLowerCase().includes(search) ||
            idea.tags.join(" ").toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || idea.category === category;

        return matchesSearch && matchesCategory;
    });

    root.querySelector("#idea-count").textContent =
        `${ideas.length} ${ideas.length === 1 ? "idea" : "ideas"} saved`;

    const grid = root.querySelector("#idea-grid");

    if (filteredIdeas.length === 0) {
        grid.innerHTML = `
            <div class="idea-empty">
                <div class="idea-empty-icon">✧</div>
                <h3>${ideas.length === 0 ? "Your vault is waiting." : "No ideas found."}</h3>
                <p>${ideas.length === 0
                    ? "That random thought? That project you've been imagining? Give it a home."
                    : "Try another search or category."}</p>
                ${ideas.length === 0
                    ? '<button class="idea-new-button" data-action="new">+ Capture your first idea</button>'
                    : ""}
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredIdeas
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map(idea => `
            <article class="idea-card" data-action="open" data-id="${escapeIdeaHTML(idea.id)}">
                <div class="idea-card-top">
                    <span class="idea-category">${escapeIdeaHTML(idea.category)}</span>
                    <span class="idea-card-date">${formatIdeaDate(idea.updatedAt)}</span>
                </div>

                <h3>${escapeIdeaHTML(idea.title || "Untitled idea")}</h3>

                <p class="idea-card-preview">
                    ${escapeIdeaHTML(idea.notes || "A blank page waiting for an idea...")}
                </p>

                <div class="idea-card-bottom">
                    <div class="idea-tags">
                        ${idea.tags.slice(0, 3).map(tag =>
                            `<span>#${escapeIdeaHTML(tag)}</span>`
                        ).join("")}
                    </div>
                    <span class="idea-open-arrow">↗</span>
                </div>
            </article>
        `).join("");
}

function openIdeaEditor(ideaId) {
    const root = document.getElementById("idea-vault-root");
    const ideas = loadIdeas();
    const idea = ideas.find(item => item.id === ideaId);

    if (!root || !idea) return;

    currentIdeaId = ideaId;

    root.querySelector("#idea-list-view").hidden = true;
    root.querySelector("#idea-editor-view").hidden = false;

    root.querySelector("#idea-editor-view").innerHTML = `
        <div class="idea-editor">
            <button class="idea-back-button" data-action="back">
                ← Back to your vault
            </button>

            <div class="idea-editor-heading">
                <div>
                    <span class="eyebrow">YOUR IDEA</span>
                    <p class="idea-save-status" id="idea-save-status">Saved</p>
                </div>
                <button class="idea-delete-button" data-action="delete" data-id="${escapeIdeaHTML(idea.id)}">
                    Delete idea
                </button>
            </div>

            <input
                class="idea-title-input"
                id="idea-title"
                type="text"
                maxlength="120"
                placeholder="Give your idea a name..."
                value="${escapeIdeaHTML(idea.title)}"
            >

            <div class="idea-editor-meta">
                <label>
                    CATEGORY
                    <select id="idea-category">
                        ${["BUILD", "CREATE", "LEARN", "ADVANCE", "LIVE", "Personal", "Other"]
                            .map(option => `
                                <option value="${option}" ${idea.category === option ? "selected" : ""}>
                                    ${option}
                                </option>
                            `).join("")}
                    </select>
                </label>

                <label>
                    TAGS
                    <input
                        id="idea-tags"
                        type="text"
                        placeholder="e.g. AI, research, someday"
                        value="${escapeIdeaHTML(idea.tags.join(", "))}"
                    >
                </label>
            </div>

            <label class="idea-notes-label" for="idea-notes">YOUR NOTES</label>
            <textarea
                id="idea-notes"
                class="idea-notes-input"
                placeholder="Let your thoughts wander...&#10;&#10;What is the idea? Why are you interested in it? What could it become?"
            >${escapeIdeaHTML(idea.notes)}</textarea>

            <p class="idea-editor-footer">
                Created ${formatIdeaDate(idea.createdAt)} · Your changes save automatically.
            </p>
        </div>
    `;

    root.querySelector("#idea-title").focus();
}

function handleIdeaClick(event) {
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;

    const action = actionElement.dataset.action;
    const ideaId = actionElement.dataset.id;

    if (action === "new") {
        const ideas = loadIdeas();
        const newIdea = {
            id: createIdeaId(),
            title: "",
            notes: "",
            category: "Other",
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        ideas.push(newIdea);
        saveIdeas(ideas);
        openIdeaEditor(newIdea.id);
    }

    if (action === "open") {
        openIdeaEditor(ideaId);
    }

    if (action === "back") {
        currentIdeaId = null;
        document.getElementById("idea-list-view").hidden = false;
        document.getElementById("idea-editor-view").hidden = true;
        renderIdeaVault();
    }

    if (action === "delete") {
        const confirmed = confirm("Delete this idea permanently?");
        if (!confirmed) return;

        const ideas = loadIdeas().filter(idea => idea.id !== ideaId);
        saveIdeas(ideas);

        currentIdeaId = null;
        document.getElementById("idea-list-view").hidden = false;
        document.getElementById("idea-editor-view").hidden = true;
        renderIdeaVault();
    }
}

function handleIdeaInput(event) {
    const root = document.getElementById("idea-vault-root");
    if (!root) return;

    if (event.target.id === "idea-search" ||
        event.target.id === "idea-category-filter") {
        renderIdeaVault();
        return;
    }

    const editableFields = [
        "idea-title",
        "idea-notes",
        "idea-category",
        "idea-tags"
    ];

    if (!editableFields.includes(event.target.id)) return;

    const ideas = loadIdeas();
    const idea = ideas.find(item => item.id === currentIdeaId);
    if (!idea) return;

    if (event.target.id === "idea-title") {
        idea.title = event.target.value;
    }

    if (event.target.id === "idea-notes") {
        idea.notes = event.target.value;
    }

    if (event.target.id === "idea-category") {
        idea.category = event.target.value;
    }

    if (event.target.id === "idea-tags") {
        idea.tags = event.target.value
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);
    }

    idea.updatedAt = Date.now();
    saveIdeas(ideas);

    const status = root.querySelector("#idea-save-status");
    if (status) status.textContent = "Saved ✓";
}

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "ideas") {
        initializeIdeaVault();
    }
});
