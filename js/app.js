
/* =================================
   VERDE — APPLICATION LOGIC
================================= */

// Display today's date
const dateElement = document.getElementById("current-date");

function updateDate() {
    const today = new Date();

    dateElement.textContent = today.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

updateDate();


// Sidebar navigation
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", (event) => {
        event.preventDefault();

        // Remove active styling from all items
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        // Highlight selected item
        item.classList.add("active");

        const page = item.dataset.page;

        console.log("Selected page:", page);
    });

});


// Pillar card navigation
const pillarCards = document.querySelectorAll(".pillar-card");

pillarCards.forEach(card => {

    card.addEventListener("click", () => {

        const pillar = card.dataset.pillar;

        console.log("Opening pillar:", pillar);

        const matchingNav = document.querySelector(
            `.nav-item[data-page="${pillar}"]`
        );

        if (matchingNav) {
            matchingNav.click();
        }

    });

});


// Today's focus button
const focusButton = document.getElementById("focus-button");

focusButton.addEventListener("click", () => {

    alert("Your next adventure is waiting! 🌿");

});

console.log("VERDE application initialized successfully.");
