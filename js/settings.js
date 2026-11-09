
/* ==========================================
   VERDE SETTINGS
========================================== */

const SETTINGS_KEY = "verde_settings_v1";

/* ==========================================
   DEFAULT SETTINGS
========================================== */

const defaultSettings = {
    name: "",
    greeting: "Good morning",
    description: "A little progress, a little curiosity, a lot of living.",
    theme: "lavender"
};

/* ==========================================
   THEME PRESETS
========================================== */

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

/* ==========================================
   LOAD AND SAVE SETTINGS
========================================== */

function getVerdeSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        const parsed = saved ? JSON.parse(saved) : {};

        return {
            ...defaultSettings,
            ...parsed,
            theme: themePresets[parsed.theme]
                ? parsed.theme
                : defaultSettings.theme
        };

    } catch (error) {
        console.warn("Could not load VERDE settings:", error);
        return { ...defaultSettings };
    }
}

function saveVerdeSettings(settings) {
    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );
}

/* ==========================================
   APPLY SETTINGS THROUGHOUT VERDE
========================================== */

function applyVerdeSettings() {
    const settings = getVerdeSettings();
    const theme = themePresets[settings.theme];

    const root = document.documentElement;

    // Apply the selected color palette.
    root.style.setProperty("--purple", theme.accent);
    root.style.setProperty("--accent", theme.accent);

    root.style.setProperty("--lavender", theme.light);
    root.style.setProperty("--accent-light", theme.light);

    root.style.setProperty("--deep-purple", theme.deep);

    root.style.setProperty("--sage", theme.accent);
    root.style.setProperty("--sage-light", theme.light);
    root.style.setProperty("--forest", theme.deep);

    // Update homepage greeting.
    const welcomeHeading = document.querySelector(
        ".welcome-section h2"
    );

    if (welcomeHeading) {
        welcomeHeading.textContent = settings.name
            ? `${settings.greeting}, ${settings.name}.`
            : `${settings.greeting}, explorer.`;
    }

    // Update homepage description.
    const welcomeDescription = document.querySelector(
        ".welcome-section p"
    );

    if (welcomeDescription) {
        welcomeDescription.textContent = settings.description;
    }

    // Update profile icon.
    const profileIcon = document.querySelector(".profile-icon");

    if (profileIcon) {
        profileIcon.textContent = settings.name
            ? settings.name.charAt(0).toUpperCase()
            : "S";
    }
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

            <!-- PROFILE -->

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

                    <small>
                        This name will appear in your homepage greeting.
                    </small>
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
                    <label for="settings-description">
                        Homepage message
                    </label>

                    <textarea
                        id="settings-description"
                        rows="3"
                        placeholder="Write a little reminder for yourself..."
                    >${escapeSettingsValue(settings.description)}</textarea>
                </div>

            </section>


            <!-- APPEARANCE -->

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

                    <button
                        type="button"
                        class="theme-option"
                        data-theme="lavender"
                    >
                        <span class="theme-swatches">
                            <i style="background:#9279B4"></i>
                            <i style="background:#EAE2F2"></i>
                        </span>
                        <span>Lavender</span>
                    </button>

                    <button
                        type="button"
                        class="theme-option"
                        data-theme="sage"
                    >
                        <span class="theme-swatches">
                            <i style="background:#71876F"></i>
                            <i style="background:#E8EEE5"></i>
                        </span>
                        <span>Sage</span>
                    </button>

                    <button
                        type="button"
                        class="theme-option"
                        data-theme="rose"
                    >
                        <span class="theme-swatches">
                            <i style="background:#C58E9C"></i>
                            <i style="background:#F5E5E9"></i>
                        </span>
                        <span>Rose</span>
                    </button>

                    <button
                        type="button"
                        class="theme-option"
                        data-theme="ocean"
                    >
                        <span class="theme-swatches">
                            <i style="background:#7298A8"></i>
                            <i style="background:#E3EFF2"></i>
                        </span>
                        <span>Ocean</span>
                    </button>

                </div>

                <p class="settings-note">
                    Your theme is saved automatically ♡
                </p>

            </section>


            <!-- DATA & PRIVACY -->

            <section class="panel settings-panel settings-data-panel">

                <div class="panel-heading">
                    <div>
                        <span class="eyebrow">YOUR INFORMATION, YOURS TO KEEP</span>
                        <h3>Data & Privacy ♡</h3>
                    </div>

                    <span class="panel-icon">✧</span>
                </div>

                <p class="settings-intro">
                    Your VERDE universe holds your ideas, projects,
                    journal entries, and little milestones. Keep a backup
                    so they're always yours.
                </p>

                <div class="data-action-card">

                    <div class="data-action-icon">↓</div>

                    <div class="data-action-info">
                        <strong>Export your VERDE data</strong>
                        <small>
                            Download a backup of your saved information.
                        </small>
                    </div>

                    <button
                        type="button"
                        class="data-action-button"
                        id="export-verde-data"
                    >
                        Export
                    </button>

                </div>

                <div class="data-action-card">

                    <div class="data-action-icon">↑</div>

                    <div class="data-action-info">
                        <strong>Restore a backup</strong>
                        <small>
                            Bring your saved information back from a backup file.
                        </small>
                    </div>

                    <label
                        for="import-verde-data"
                        class="data-action-button"
                    >
                        Import
                    </label>

                    <input
                        type="file"
                        id="import-verde-data"
                        accept=".json,application/json"
                        hidden
                    >

                </div>

                <p class="settings-note">
                    Your backups are stored on your device.
                </p>

                <p
                    class="data-status-message"
                    id="data-status-message"
                    aria-live="polite"
                ></p>

            </section>


            <!-- SAVE MESSAGE -->

            <div
                class="settings-save-message"
                id="settings-save-message"
            >
                Your changes are saved automatically ♡
            </div>

        </div>
    `;

    // Restore saved greeting.
    document.getElementById("settings-greeting").value =
        settings.greeting;

    // Highlight selected theme.
    updateThemeSelection(settings.theme);

    // Connect profile inputs.
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

    // Connect theme buttons.
    root.querySelectorAll(".theme-option").forEach(button => {

        button.addEventListener("click", () => {

            const updatedSettings = getVerdeSettings();

            updatedSettings.theme = button.dataset.theme;

            saveVerdeSettings(updatedSettings);

            applyVerdeSettings();

            updateThemeSelection(updatedSettings.theme);

            showSettingsSaved();

        });

    });

    // Connect export button.
    const exportButton = document.getElementById("export-verde-data");

    if (exportButton) {
        exportButton.addEventListener("click", exportVerdeData);
    }

    // Connect import button.
    const importInput = document.getElementById("import-verde-data");

    if (importInput) {
        importInput.addEventListener("change", importVerdeData);
    }
}

/* ==========================================
   SAVE PROFILE INFORMATION
========================================== */

function saveProfileFromForm() {
    const settings = getVerdeSettings();

    settings.name = document
        .getElementById("settings-name")
        .value
        .trim();

    settings.greeting = document
        .getElementById("settings-greeting")
        .value;

    settings.description = document
        .getElementById("settings-description")
        .value;

    saveVerdeSettings(settings);

    applyVerdeSettings();

    showSettingsSaved();
}

/* ==========================================
   THEME BUTTON SELECTION
========================================== */

function updateThemeSelection(selectedTheme) {

    document.querySelectorAll(".theme-option").forEach(button => {

        button.classList.toggle(
            "selected",
            button.dataset.theme === selectedTheme
        );

        button.setAttribute(
            "aria-pressed",
            button.dataset.theme === selectedTheme
        );

    });

}

/* ==========================================
   SAVE CONFIRMATION
========================================== */

function showSettingsSaved() {
    const message = document.getElementById(
        "settings-save-message"
    );

    if (message) {
        message.textContent =
            "Your changes are saved automatically ♡";
    }
}

/* ==========================================
   SAFE HTML VALUES
========================================== */

function escapeSettingsValue(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================
   DATA & PRIVACY
========================================== */

// Collect saved VERDE information.
function getVerdeData() {
    const data = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith("verde_")) {
            data[key] = localStorage.getItem(key);
        }
    }

    return data;
}

// Display backup status.
function showDataStatus(message, isError = false) {
    const status = document.getElementById(
        "data-status-message"
    );

    if (!status) return;

    status.textContent = message;
    status.classList.toggle("error", isError);
}

// Export VERDE data.
function exportVerdeData() {

    try {
        const backup = {
            app: "VERDE",
            backupVersion: 1,
            exportedAt: new Date().toISOString(),
            data: getVerdeData()
        };

        const file = new Blob(
            [JSON.stringify(backup, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(file);
        const link = document.createElement("a");

        const date = new Date().toISOString().slice(0, 10);

        link.href = url;
        link.download = `verde-backup-${date}.json`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        showDataStatus("Your VERDE backup is ready! ♡");

    } catch (error) {
        console.error("VERDE export failed:", error);

        showDataStatus(
            "Something went wrong while exporting.",
            true
        );
    }
}

// Import and restore VERDE data.
async function importVerdeData(event) {

    const file = event.target.files[0];

    if (!file) return;

    try {
        const contents = await file.text();
        const backup = JSON.parse(contents);

        // Validate backup format.
        if (
            backup.app !== "VERDE" ||
            backup.backupVersion !== 1 ||
            !backup.data ||
            typeof backup.data !== "object" ||
            Array.isArray(backup.data)
        ) {
            throw new Error("Invalid VERDE backup.");
        }

        const entries = Object.entries(backup.data);

        if (
            entries.length === 0 ||
            entries.some(([key, value]) =>
                !key.startsWith("verde_") ||
                typeof value !== "string"
            )
        ) {
            throw new Error("Invalid backup contents.");
        }

        // Confirm before replacing existing information.
        const confirmed = window.confirm(
            "Restoring this backup will replace your current VERDE " +
            "saved data. We recommend exporting your current data " +
            "first. Continue?"
        );

        if (!confirmed) {
            showDataStatus(
                "Restore cancelled. Your data is unchanged."
            );
            return;
        }

        // Preserve existing data in case restoration fails.
        const previousData = getVerdeData();

        try {
            // Remove existing VERDE data.
            Object.keys(previousData).forEach(key => {
                localStorage.removeItem(key);
            });

            // Restore backup information.
            entries.forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });

        } catch (error) {

            // Attempt to recover previous data.
            Object.keys(getVerdeData()).forEach(key => {
                localStorage.removeItem(key);
            });

            Object.entries(previousData).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });

            throw error;
        }

        showDataStatus(
            "Your VERDE backup was restored! Refreshing... ♡"
        );

        window.setTimeout(() => {
            window.location.reload();
        }, 1200);

    } catch (error) {

        console.error("VERDE import failed:", error);

        showDataStatus(
            "We couldn't restore this file. Please check that it's a valid VERDE backup.",
            true
        );

    } finally {
        event.target.value = "";
    }
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
