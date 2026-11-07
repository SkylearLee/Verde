
/* ==========================================
   VERDE — TASK MANAGEMENT SYSTEM
   Version 1.0
========================================== */


// ==========================================
// 1. TASK DATA
// ==========================================

const STORAGE_KEY = "verde_tasks_v1";

const starterTasks = [
    {
        id: "task-1",
        title: "Explore the basics of computer vision",
        pillar: "build",
        completed: false,
        createdAt: new Date().toISOString()
    },
    {
        id: "task-2",
        title: "Set up Python and OpenCV",
        pillar: "build",
        completed: false,
        createdAt: new Date().toISOString()
    },
    {
        id: "task-3",
        title: "Access my laptop webcam",
        pillar: "build",
        completed: false,
        createdAt: new Date().toISOString()
    },
    {
        id: "task-4",
        title: "Implement motion detection",
        pillar: "build",
        completed: false,
        createdAt: new Date().toISOString()
    },
    {
        id: "task-5",
        title: "Experiment with object detection",
        pillar: "build",
        completed: false,
        createdAt: new Date().toISOString()
    }
];


// Load saved tasks from browser storage.

function loadTasks() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            return starterTasks;
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : starterTasks;

    } catch (error) {

        console.error("Could not load VERDE tasks:", error);

        return starterTasks;

    }

}


let tasks = loadTasks();


// Save tasks to browser storage.

function saveTasks() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error("Could not save VERDE tasks:", error);

        alert("Your tasks could not be saved. Check browser storage.");

    }

}


// ==========================================
// 2. TASK HELPERS
// ==========================================

function createTaskId() {

    return "task-" + Date.now() + "-" +
        Math.random().toString(36).slice(2, 8);

}


function getPillarTasks(pillar) {

    return tasks.filter(task => task.pillar === pillar);

}


function getCompletedCount(pillar) {

    return getPillarTasks(pillar)
        .filter(task => task.completed).length;

}


function getProgress(pillar) {

    const pillarTasks = getPillarTasks(pillar);

    if (pillarTasks.length === 0) return 0;

    return Math.round(
        (getCompletedCount(pillar) / pillarTasks.length) * 100
    );

}


// ==========================================
// 3. TASK MANAGER HTML
// ==========================================

function createTaskManager() {

    return `

        <section class="workspace-section task-manager">

            <div class="section-heading">

                <div>
                    <span class="eyebrow">YOUR PROJECT WORKFLOW</span>
                    <h3>Project tasks</h3>
                </div>

                <span class="task-count" id="task-count">
                    0 tasks
                </span>

            </div>


            <div class="task-progress-card">

                <div class="task-progress-heading">
                    <strong>Project progress</strong>
                    <span id="task-progress-text">0% complete</span>
                </div>

                <div class="progress-track task-progress-track">
                    <div
                        class="progress-fill"
                        id="task-progress-fill"
                        style="width: 0%">
                    </div>
                </div>

                <p id="task-progress-description">
                    Every little step counts.
                </p>

            </div>


            <form id="task-form" class="task-form">

                <input
                    type="text"
                    id="task-input"
                    placeholder="What would you like to work on?"
                    maxlength="120"
                    required
                >

                <button type="submit" class="primary-button">
                    + Add task
                </button>

            </form>


            <div class="task-filters">

                <button class="task-filter active"
                    data-filter="all">
                    All
                </button>

                <button class="task-filter"
                    data-filter="active">
                    To do
                </button>

                <button class="task-filter"
                    data-filter="completed">
                    Completed
                </button>

            </div>


            <div id="task-list" class="task-list"></div>


            <div class="task-footer">
                <span>🌱 Progress at your own pace.</span>
                <button id="clear-completed" class="text-button">
                    Clear completed
                </button>
            </div>

        </section>

    `;

}


// ==========================================
// 4. RENDER TASKS
// ==========================================

let currentFilter = "all";


function renderTasks() {

    const taskList = document.getElementById("task-list");

    if (!taskList) return;

    const visibleTasks = getPillarTasks("build").filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });


    const completed = getCompletedCount("build");
    const total = getPillarTasks("build").length;
    const progress = getProgress("build");


    // Update progress information.

    document.getElementById("task-count").textContent =
        `${total} ${total === 1 ? "task" : "tasks"}`;

    document.getElementById("task-progress-text").textContent =
        `${progress}% complete`;

    document.getElementById("task-progress-fill").style.width =
        `${progress}%`;

    document.getElementById("task-progress-description").textContent =
        total === 0
            ? "Add your first task to get started."
            : `${completed} of ${total} tasks completed. Keep going!`;


    // Display tasks.

    if (visibleTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-tasks">
                <span>🌷</span>
                <h4>Nothing here just yet.</h4>
                <p>Add a task or try another filter.</p>
            </div>
        `;

        return;

    }


    taskList.innerHTML = visibleTasks.map(task => `

        <div class="task-row ${task.completed ? "completed" : ""}"
             data-task-id="${task.id}">

            <label class="task-checkbox-label">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-action="toggle"
                    ${task.completed ? "checked" : ""}
                >

                <span class="custom-checkbox"></span>

            </label>

            <span class="task-title">${escapeHTML(task.title)}</span>

            <button
                class="delete-task"
                data-action="delete"
                aria-label="Delete task"
                title="Delete task">
                ×
            </button>

        </div>

    `).join("");

}


// Prevent user-entered task titles from becoming HTML.

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}


// ==========================================
// 5. ADD TASKS
// ==========================================

function handleAddTask(event) {

    event.preventDefault();

    const input = document.getElementById("task-input");

    const title = input.value.trim();

    if (!title) return;


    tasks.push({

        id: createTaskId(),

        title: title,

        pillar: "build",

        completed: false,

        createdAt: new Date().toISOString()

    });


    saveTasks();

    input.value = "";

    renderTasks();

    input.focus();

}


// ==========================================
// 6. COMPLETE OR DELETE TASKS
// ==========================================

function handleTaskAction(event) {

    const actionElement = event.target.closest("[data-action]");

    if (!actionElement) return;

    const taskRow = actionElement.closest("[data-task-id]");

    if (!taskRow) return;

    const taskId = taskRow.dataset.taskId;

    const action = actionElement.dataset.action;


    if (action === "toggle") {

        const task = tasks.find(item => item.id === taskId);

        if (!task) return;

        task.completed = actionElement.checked;

        saveTasks();

        renderTasks();

    }


    if (action === "delete") {

        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();

        renderTasks();

    }

}


// ==========================================
// 7. FILTER TASKS
// ==========================================

function handleFilter(event) {

    const button = event.target.closest("[data-filter]");

    if (!button) return;

    currentFilter = button.dataset.filter;


    document.querySelectorAll(".task-filter").forEach(filter => {

        filter.classList.toggle(
            "active",
            filter.dataset.filter === currentFilter
        );

    });


    renderTasks();

}


// ==========================================
// 8. CLEAR COMPLETED TASKS
// ==========================================

function clearCompletedTasks() {

    const completedTasks = getPillarTasks("build")
        .filter(task => task.completed).length;

    if (completedTasks === 0) return;

    const confirmed = confirm(
        `Delete ${completedTasks} completed tasks?`
    );

    if (!confirmed) return;

    tasks = tasks.filter(task => {

        return !(task.pillar === "build" && task.completed);

    });

    saveTasks();

    renderTasks();

}


// ==========================================
// 9. INITIALIZE THE TASK MANAGER
// ==========================================

function initializeTaskManager() {

    const buildPage = document.getElementById("page-container");

    if (!buildPage) return;

    // Only display the manager in BUILD.

    const currentPage = buildPage.querySelector(".page-header h2");

    if (!currentPage || !currentPage.textContent.includes("Build")) {
        return;
    }

    // Avoid adding the manager twice.

    if (buildPage.querySelector(".task-manager")) return;


    // Insert the task manager.

    // Insert the task manager before the footer.

const footer = buildPage.querySelector("footer");

if (footer) {
    footer.insertAdjacentHTML(
        "beforebegin",
        createTaskManager()
    );
} else {
    buildPage.insertAdjacentHTML(
        "beforeend",
        createTaskManager()
    );
}

    


    // Attach event listeners.

    document.getElementById("task-form")
        .addEventListener("submit", handleAddTask);

    document.getElementById("task-list")
        .addEventListener("click", handleTaskAction);

    document.getElementById("task-list")
        .addEventListener("change", handleTaskAction);

    document.querySelector(".task-filters")
        .addEventListener("click", handleFilter);

    document.getElementById("clear-completed")
        .addEventListener("click", clearCompletedTasks);


    renderTasks();

}


// ==========================================
// 10. LISTEN FOR PAGE CHANGES
// ==========================================

document.addEventListener("verde:pagechange", event => {

    if (event.detail.pageName === "build") {

        initializeTaskManager();

    }

});


console.log("🌱 VERDE task management system initialized!");
