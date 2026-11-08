
/* ==========================================
   VERDE SETTINGS
========================================== */

const SETTINGS_KEY = "verde_settings_v1";


const defaultSettings = {
    name: "",
    greeting: "Good morning",
    description: "A little progress, a little curiosity, a lot of living.",
    theme: "lavender",

    workspace: {
        daily: { visible: true, label: "Daily Focus" },
        ideas: { visible: true, label: "Idea Vault" },
        build: { visible: true, label: "Build" },
        create: { visible: true, label: "Create" },
        learn: { visible: true, label: "Learn" },
        advance: { visible: true, label: "Advance" },
        live: { visible: true, label: "Live" }
    }
};


const themePresets = {
    lavender: {
        accent: "#9279B4",
        light: "#EAE2F2",
        deep: "#65517E"
    },
    sage: {
        accent: "#71876F",
        light: "#E8EEE5",
        deep: "#435C48"
    },
    rose: {
        accent: "#C58E9C",
        light: "#F5E5E9",
        deep: "#946474"
    },
    ocean: {
        accent: "#7298A8",
        light: "#E3EFF2",
        deep: "#456B7A"
    }
};

function getVerdeSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        const parsed = saved ? JSON.parse(saved) : {};

        return {
            ...defaultSettings,
            ...parsed,
            workspace: {
                ...defaultSettings.workspace,
                ...(parsed.workspace || {})
            }
        };
    } catch (error) {
        console.warn("Could not load VERDE settings:", error);
        return { ...defaultSettings };
    }
}


function saveVerdeSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applyVerdeSettings() {
    const settings = getVerdeSettings();
    const theme = themePresets[settings.theme] || themePresets.lavender;

    document.documentElement.style.setProperty("--purple", theme.accent);
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--lavender", theme.light);
    document.documentElement.style.setProperty("--accent-light", theme.light);
    document.documentElement.style.setProperty("--deep-purple", theme.deep);

    // Update the homepage greeting.
    const welcomeHeading = document.querySelector(".welcome-section h2");
    if (welcomeHeading) {
        welcomeHeading.textContent = settings.name
            ? `${settings.greeting}, ${settings.name}.`
            : `${settings.greeting}, explorer.`;
    }

    // Update the homepage description.
    const welcomeDescription = document.querySelector(".welcome-section p");
    if (welcomeDescription) {
        welcomeDescription.textContent = settings.description;
    }

    // Update the profile icon.
    const profileIcon = document.querySelector(".profile-icon");
    if (profileIcon) {
        profileIcon.textContent = settings.name
            ? settings.name.charAt(0).toUpperCase()
            : "S";
    }

    applyWorkspaceSettings();
}

/* ==========================================
   SETTINGS PAGE
========================================== */

function initializeSettings() {
    const root = document.getElementById("settings-root");
    if (!root) return;

    const settings = getVerdeSettings();

    root.innerHTML = `
        <div class="settings-layout">

            <section class="panel settings-panel">
                <div class="panel-heading">
                    <div>
                        <span class="eyebrow">A LITTLE ABOUT YOU</span>
                        <h3>Your Profile ✿</h3>
                    </div>
                    <span class="panel-icon">♡</span>
                </div>

                <div class="settings-field">
                    <label for="settings-name">Display name</label>
                    <input
                        type="text"
                        id="settings-name"
                        placeholder="What should VERDE call you?"
                        value="${escapeSettingsValue(settings.name)}"
                    >
                    <small>This name will appear in your homepage greeting.</small>
                </div>

                <div class="settings-field">
                    <label for="settings-greeting">Your greeting</label>
                    <select id="settings-greeting">
                        <option value="Good morning">Good morning</option>
                        <option value="Hello">Hello</option>
                        <option value="Welcome back">Welcome back</option>
                        <option value="Hey there">Hey there</option>
                    </select>
                </div>

                <div class="settings-field">
                    <label for="settings-description">Homepage message</label>
                    <textarea
                        id="settings-description"
                        rows="3"
                        placeholder="Write a little reminder for yourself..."
                    >${escapeSettingsValue(settings.description)}</textarea>
                </div>
            </section>

            <section class="panel settings-panel">
                <div class="panel-heading">
                    <div>
                        <span class="eyebrow">MAKE YOURSELF AT HOME</span>
                        <h3>Appearance 🎨</h3>
                    </div>
                    <span class="panel-icon">✧</span>
                </div>

                <p class="settings-intro">
                    Choose a color palette that feels like your space.
                </p>

                <div class="theme-options">

                    <button type="button" class="theme-option" data-theme="lavender">
                        <span class="theme-swatches">
                            <i style="background:#9279B4"></i>
                            <i style="background:#EAE2F2"></i>
                        </span>
                        <span>Lavender</span>
                    </button>

                    <button type="button" class="theme-option" data-theme="sage">
                        <span class="theme-swatches">
                            <i style="background:#71876F"></i>
                            <i style="background:#E8EEE5"></i>
                        </span>
                        <span>Sage</span>
                    </button>

                    <button type="button" class="theme-option" data-theme="rose">
                        <span class="theme-swatches">
                            <i style="background:#C58E9C"></i>
                            <i style="background:#F5E5E9"></i>
                        </span>
                        <span>Rose</span>
                    </button>

                    <button type="button" class="theme-option" data-theme="ocean">
                        <span class="theme-swatches">
                            <i style="background:#7298A8"></i>
                            <i style="background:#E3EFF2"></i>
                        </span>
                        <span>Ocean</span>
                    </button>

                </div>

                <p class="settings-note">
                    Your theme is saved automatically.
                </p>
            </section>


            <section class="panel settings-panel settings-workspace-panel">
                <div class="panel-heading">
                    <div>
                        <span class="eyebrow">SHAPE YOUR SPACE</span>
                        <h3>Your Workspace 🌱</h3>
                    </div>
                    <span class="panel-icon">⌘</span>
                </div>

                <p class="settings-intro">
                    Choose which spaces appear in your sidebar and give them names
                    that feel right to you.
                </p>

                <div class="workspace-customization-list">

                    <div class="workspace-customization-row">
                        <div class="workspace-feature-info">
                            <strong>Daily Focus</strong>
                            <small>Your daily intentions and energy</small>
                        </div>
                        <label class="workspace-toggle">
                            <input type="checkbox" data-workspace-toggle="daily" checked>
                            <span></span>
                        </label>
                        <input class="workspace-label-input" data-workspace-label="daily"
                            value="Daily Focus" aria-label="Daily Focus navigation label">
                    </div>

                    <div class="workspace-customization-row">
                        <div class="workspace-feature-info">
                            <strong>Idea Vault</strong>
                            <small>Your saved ideas and thoughts</small>
                        </div>
                        <label class="workspace-toggle">
                            <input type="checkbox" data-workspace-toggle="ideas" checked>
                            <span></span>
                        </label>
                        <input class="workspace-label-input" data-workspace-label="ideas"
                            value="Idea Vault" aria-label="Idea Vault navigation label">
                    </div>

                    <div class="workspace-customization-row">
                        <div class="workspace-feature-info">
                            <strong>Build</strong>
                            <small>Projects and experiments</small>
                        </div>
                        <label class="workspace-toggle">
                            <input type="checkbox" data-workspace-toggle="build" checked>
                            <span></span>
                        </label>
                        <input class="workspace-label-input" data-workspace-label="build"
                            value="Build" aria-label="Build navigation label">
                    </div>

                    <div class="workspace-customization-row">
                        <div class="workspace-feature-info">
                            <strong>Create</strong>
                            <small>Journaling and creative projects</small>
                        </div>
                        <label class="workspace-toggle">
                            <input type="checkbox" data-workspace-toggle="create" checked>
                            <span></span>
                        </label>
                        <input class="workspace-label-input" data-workspace-label="create"
                            value="Create" aria-label="Create navigation label">
                    </div>

                    <div class="workspace-customization-row">
                        <div class="workspace-feature-info">
                            <strong>Learn</strong>
                            <small>Your research library</small>
                        </div>
                        <label class="workspace-toggle">
                            <input type="checkbox" data-workspace-toggle="learn" checked>
                            <span></span>
                        </label>
                        <input class="workspace-label-input" data-workspace-label="learn"
                            value="Learn" aria-label="Learn navigation label">
                    </div>

                    <div class="workspace-customization-row">
                        <div class="workspace-feature-info">
                            <strong>Advance</strong>
                            <small>Applications and opportunities</small>
                        </div>
                        <label class="workspace-toggle">
                            <input type="checkbox" data-workspace-toggle="advance" checked>
                            <span></span>
                        </label>
                        <input class="workspace-label-input" data-workspace-label="advance"
                            value="Advance" aria-label="Advance navigation label">
                    </div>

                    <div class="workspace-customization-row">
                        <div class="workspace-feature-info">
                            <strong>Live</strong>
                            <small>Activities and everyday experiences</small>
                        </div>
                        <label class="workspace-toggle">
                            <input type="checkbox" data-workspace-toggle="live" checked>
                            <span></span>
                        </label>
                        <input class="workspace-label-input" data-workspace-label="live"
                            value="Live" aria-label="Live navigation label">
                    </div>

                </div>

                <p class="settings-note">
                    Home and Settings will always remain available.
                </p>
            </section>


            <div class="settings-save-message" id="settings-save-message">
                Your changes are saved automatically ♡
            </div>

        </div>
    `;

    // Restore saved greeting.
    document.getElementById("settings-greeting").value = settings.greeting;

    // Highlight the selected theme.
    updateThemeSelection(settings.theme);

    // Save profile changes as the user types.
    const profileInputs = [
        "settings-name",
        "settings-greeting",
        "settings-description"
    ];

    profileInputs.forEach(id => {
        const input = document.getElementById(id);

        input.addEventListener("input", saveProfileFromForm);
        input.addEventListener("change", saveProfileFromForm);
    });

    // Change theme when a palette is selected.
    root.querySelectorAll(".theme-option").forEach(button => {
        button.addEventListener("click", () => {
            const updatedSettings = getVerdeSettings();
            updatedSettings.theme = button.dataset.theme;

            saveVerdeSettings(updatedSettings);
            applyVerdeSettings();
            updateThemeSelection(updatedSettings.theme);
        });
    });


    // Restore saved Workspace preferences.
    const workspaceSettings = getVerdeSettings().workspace;

    root.querySelectorAll("[data-workspace-toggle]").forEach(input => {
        const page = input.dataset.workspaceToggle;
        input.checked = workspaceSettings[page]?.visible !== false;

        input.addEventListener("change", () => {
            const updatedSettings = getVerdeSettings();
            updatedSettings.workspace[page].visible = input.checked;

            saveVerdeSettings(updatedSettings);
            applyWorkspaceSettings();
        });
    });

    root.querySelectorAll("[data-workspace-label]").forEach(input => {
        const page = input.dataset.workspaceLabel;
        input.value = workspaceSettings[page]?.label || input.value;

        input.addEventListener("input", () => {
            const updatedSettings = getVerdeSettings();
            updatedSettings.workspace[page].label = input.value.trim() || page;

            saveVerdeSettings(updatedSettings);
            applyWorkspaceSettings();
        });
    });

    applyWorkspaceSettings();


}

function saveProfileFromForm() {
    const settings = getVerdeSettings();

    settings.name = document.getElementById("settings-name").value.trim();
    settings.greeting = document.getElementById("settings-greeting").value;
    settings.description = document.getElementById("settings-description").value;

    saveVerdeSettings(settings);
    applyVerdeSettings();

    const message = document.getElementById("settings-save-message");
    if (message) {
        message.textContent = "Your changes are saved automatically ♡";
    }
}

function updateThemeSelection(selectedTheme) {
    document.querySelectorAll(".theme-option").forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.theme === selectedTheme
        );
    });
}

function escapeSettingsValue(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================
   CONNECT TO VERDE NAVIGATION
========================================== */

document.addEventListener("verde:pagechange", event => {
    if (event.detail.pageName === "settings") {
        initializeSettings();
    }

    if (event.detail.pageName === "home") {
        applyVerdeSettings();
    }
});

// Apply saved preferences when VERDE first loads.
document.addEventListener("DOMContentLoaded", () => {
    applyVerdeSettings();
});


/* ==========================================
   WORKSPACE CUSTOMIZATION
========================================== */

function applyWorkspaceSettings() {
    const settings = getVerdeSettings().workspace;

    Object.entries(settings).forEach(([page, options]) => {
        const navItem = document.querySelector(
            `.nav-item[data-page="${page}"]`
        );

        if (!navItem) return;

        // Show or hide the navigation item.
        navItem.style.display = options.visible === false ? "none" : "";

        // Update its visible label without replacing its icon.
        const labelNode = Array.from(navItem.childNodes).find(
            node => node.nodeType === Node.TEXT_NODE
        );

        if (labelNode) {
            labelNode.textContent = ` ${options.label || page}`;
        }
    });
}

