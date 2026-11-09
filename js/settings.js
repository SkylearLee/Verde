
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

    // Apply the selected color palette.
    const root = document.documentElement;

    root.style.setProperty("--purple", theme.accent);
    root.style.setProperty("--accent", theme.accent);

    root.style.setProperty("--lavender", theme.light);
    root.style.setProperty("--accent-light", theme.light);

    root.style.setProperty("--deep-purple", theme.deep);

    // Update the other existing color variables too.
    root.style.setProperty("--sage", theme.accent);
    root.style.setProperty("--sage-light", theme.light);
    root.style.setProperty("--forest", theme.deep);

    // Update the homepage greeting.
    const welcomeHeading = document.querySelector(
        ".welcome-section h2"
    );

    if (welcomeHeading) {
        welcomeHeading.textContent = settings.name
            ? `${settings.greeting}, ${settings.name}.`
            : `${settings.greeting}, explorer.`;
    }

    // Update the homepage description.
    const welcomeDescription = document.querySelector(
        ".welcome-section p"
    );

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


            <!-- SAVE MESSAGE -->

            <div
                class="settings-save-message"
                id="settings-save-message"
            >
                Your changes are saved automatically ♡
            </div>

        </div>
    `;

    // Restore the saved greeting.
    document.getElementById("settings-greeting").value =
        settings.greeting;

    // Highlight the currently selected theme.
    updateThemeSelection(settings.theme);

    // Save profile changes.
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

    // Connect the theme buttons.
    root.querySelectorAll(".theme-option").forEach(button => {

        button.addEventListener("click", () => {

            const updatedSettings = getVerdeSettings();

            updatedSettings.theme = button.dataset.theme;

            // Save the selected theme.
            saveVerdeSettings(updatedSettings);

            // Apply the new colors immediately.
            applyVerdeSettings();

            // Update the selected button.
            updateThemeSelection(updatedSettings.theme);

            // Show confirmation.
            showSettingsSaved();

        });

    });
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
        message.textContent = "Your changes are saved automatically ♡";
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
