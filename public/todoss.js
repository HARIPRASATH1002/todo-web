const token = localStorage.getItem("token");

const taskInput = document.getElementById("taskInput");
const taskError = document.getElementById("taskError");
const taskMessage = document.getElementById("taskMessage");
const descriptionInput = document.getElementById("descriptionInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const categoryInput = document.getElementById("categoryInput");

let currentTasks = [];
let editingTaskId = null;

if (!token) {
    window.location.href = "login.html";
}

function toggleProfile() {
    const dropdown = document.querySelector(".profile-dropdown");
    dropdown.classList.toggle("show");
}

function showTaskMessage(message, color) {
    taskMessage.textContent = message;
    taskMessage.style.color = color;

    setTimeout(() => {
        taskMessage.textContent = "";
    }, 3000);
}

async function loadTasks() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/todos",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        currentTasks = data.todos;

        displayTasks(data.todos);
    } catch (error) {
        console.log(error);
    }
}

loadTasks();

function displayTasks(todos) {
    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    if (todos.length === 0) {
        taskList.innerHTML =
            "<p class='no-tasks'>No tasks found</p>";
        return;
    }

    todos.forEach((todo) => {
        const div = document.createElement("div");

        div.dataset.taskId = todo._id;

        const priority = todo.priority || "";
        const priorityClass = priority.toLowerCase();

        div.innerHTML = `
            <div class="task-title">
                <input
                    type="checkbox"
                    ${todo.completed ? "checked" : ""}
                    onchange="toggleTask('${todo._id}', this.checked)"
                >

                <span class="${
                    todo.completed ? "completed-task" : ""
                }">
                    ${todo.title}
                </span>
            </div>

            <div class="task-details">
                <p>
                    <strong>Description:</strong>
                    ${todo.description || "No description"}
                </p>

                <p>
                    <strong>Due Date:</strong>
                    ${
                        todo.dueDate
                            ? new Date(todo.dueDate).toLocaleDateString()
                            : "No due date"
                    }
                </p>

                <p>
                    <strong>Priority:</strong>

                    <span class="priority-badge priority-${priorityClass}">
                        ${todo.priority || "Not selected"}
                    </span>
                </p>

                <p>
                    <strong>Category:</strong>

                    <span class="category-badge">
                        ${todo.category || "Not selected"}
                    </span>
                </p>
            </div>

            <div class="task-actions">
                <button
                    onclick="editTask('${todo._id}')"
                    class="edit-btn"
                >
                    Edit
                </button>

                <button
                    onclick="showDeleteConfirmation('${todo._id}')"
                    class="delete-btn"
                >
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(div);
    });
}

taskInput.addEventListener("input", () => {
    const title = taskInput.value.trim();

    if (title === "") {
        taskError.textContent = "";
        return;
    }

    if (title.length < 3) {
        taskError.textContent =
            "Task must contain at least 3 characters";
        taskError.style.color = "red";
        return;
    }

    if (title.length > 100) {
        taskError.textContent =
            "Task must not exceed 100 characters";
        taskError.style.color = "red";
        return;
    }

    const onlySpecialCharacters =
        /^[^A-Za-z0-9\s]+$/;

    if (onlySpecialCharacters.test(title)) {
        taskError.textContent =
            "Task cannot contain only special characters";
        taskError.style.color = "red";
        return;
    }

    taskError.textContent = "";
});

async function addTask() {
    const title = taskInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const category = categoryInput.value;

    if (!title) {
        taskError.textContent =
            "Task title is required";
        taskError.style.color = "red";
        return;
    }

    if (title.length < 3) {
        taskError.textContent =
            "Task must contain at least 3 characters";
        taskError.style.color = "red";
        return;
    }

    if (title.length > 100) {
        taskError.textContent =
            "Task must not exceed 100 characters";
        taskError.style.color = "red";
        return;
    }

    const onlySpecialCharacters =
        /^[^A-Za-z0-9\s]+$/;

    if (onlySpecialCharacters.test(title)) {
        taskError.textContent =
            "Task cannot contain only special characters";
        taskError.style.color = "red";
        return;
    }

    if (!description) {
        taskError.textContent =
            "Please enter task description";
        taskError.style.color = "red";
        return;
    }

    if (!dueDate) {
        taskError.textContent =
            "Please select a due date";
        taskError.style.color = "red";
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dueDate);

    if (selectedDate < today) {
        taskError.textContent =
            "Due date cannot be in the past";
        taskError.style.color = "red";
        return;
    }

    if (!priority) {
        taskError.textContent =
            "Please select a priority";
        taskError.style.color = "red";
        return;
    }

    if (!category) {
        taskError.textContent =
            "Please select a category";
        taskError.style.color = "red";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/todos",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    dueDate: dueDate,
                    priority: priority,
                    category: category
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            showTaskMessage(
                data.message,
                "green"
            );

            taskInput.value = "";
            descriptionInput.value = "";
            dueDateInput.value = "";
            priorityInput.value = "";
            categoryInput.value = "";
            taskError.textContent = "";

            loadTasks();
        } else {
            showTaskMessage(
                data.message,
                "red"
            );
        }
    } catch (error) {
        console.log(error);
    }
}

function editTask(id) {
    const task = currentTasks.find(
        todo => todo._id === id
    );

    if (!task) {
        return;
    }

    editingTaskId = id;

    document.getElementById(
        "editTitleInput"
    ).value = task.title;

    document.getElementById(
        "editDescriptionInput"
    ).value = task.description || "";

    document.getElementById(
        "editDueDateInput"
    ).value = task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : "";

    document.getElementById(
        "editPriorityInput"
    ).value = task.priority || "";

    document.getElementById(
        "editCategoryInput"
    ).value = task.category || "";

    document.getElementById(
        "editTaskBox"
    ).style.display = "block";

   document.getElementById("editTaskBox").scrollIntoView({
        behavior: "smooth",
        block:"start"
    });
}

async function updateTask() {
    if (!editingTaskId) {
        return;
    }

    const title = document.getElementById(
        "editTitleInput"
    ).value.trim();

    const description = document.getElementById(
        "editDescriptionInput"
    ).value.trim();

    const dueDate = document.getElementById(
        "editDueDateInput"
    ).value;

    const priority = document.getElementById(
        "editPriorityInput"
    ).value;

    const category = document.getElementById(
        "editCategoryInput"
    ).value;

    if (!title) {
        showTaskMessage(
            "Task title is required",
            "red"
        );
        return;
    }

    if (title.length < 3) {
        showTaskMessage(
            "Task must contain at least 3 characters",
            "red"
        );
        return;
    }

    if (title.length > 100) {
        showTaskMessage(
            "Task must not exceed 100 characters",
            "red"
        );
        return;
    }

    const onlySpecialCharacters =
        /^[^A-Za-z0-9\s]+$/;

    if (onlySpecialCharacters.test(title)) {
        showTaskMessage(
            "Task cannot contain only special characters",
            "red"
        );
        return;
    }

    if (!description) {
        showTaskMessage(
            "Please enter task description",
            "red"
        );
        return;
    }

    if (!dueDate) {
        showTaskMessage(
            "Please select a due date",
            "red"
        );
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dueDate);

    if (selectedDate < today) {
        showTaskMessage(
            "Due date cannot be in the past",
            "red"
        );
        return;
    }

    if (!priority) {
        showTaskMessage(
            "Please select a priority",
            "red"
        );
        return;
    }

    if (!category) {
        showTaskMessage(
            "Please select a category",
            "red"
        );
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/todos/${editingTaskId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    dueDate: dueDate,
                    priority: priority,
                    category: category
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            document.getElementById(
                "editTaskBox"
            ).style.display = "none";

            editingTaskId = null;

            showTaskMessage(
                data.message,
                "green"
            );

            loadTasks();
        } else {
            showTaskMessage(
                data.message,
                "red"
            );
        }
    } catch (error) {
        console.log(error);
    }
}

function cancelEdit() {
    document.getElementById(
        "editTaskBox"
    ).style.display = "none";

    editingTaskId = null;
}

function showDeleteConfirmation(id) {
    const task = document.querySelector(
        `[data-task-id="${id}"]`
    );

    if (!task) {
        return;
    }

    const oldConfirmation =
        task.querySelector(
            ".delete-confirmation"
        );

    if (oldConfirmation) {
        return;
    }

    const confirmation =
        document.createElement("div");

    confirmation.className =
        "delete-confirmation";

    confirmation.innerHTML = `
        <p>
            Are you sure you want to delete this task?
        </p>

        <button
            onclick="confirmDelete('${id}')"
            class="confirm-delete-btn"
        >
            Yes, Delete
        </button>

        <button
            onclick="cancelDelete(this)"
            class="cancel-delete-btn"
        >
            Cancel
        </button>
    `;

    task.appendChild(confirmation);
}

async function confirmDelete(id) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/todos/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            showTaskMessage(
                data.message,
                "green"
            );

            loadTasks();
        } else {
            showTaskMessage(
                data.message,
                "red"
            );
        }
    } catch (error) {
        console.log(error);
    }
}

function cancelDelete(button) {
    button.parentElement.remove();
}

async function toggleTask(id, completed) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/todos/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization:
                        `Bearer ${token}`
                },
                body: JSON.stringify({
                    completed: completed
                })
            }
        );

        if (response.ok) {
            loadTasks();
        }
    } catch (error) {
        console.log(error);
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}