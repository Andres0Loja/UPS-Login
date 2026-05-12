(function () {
    const session = window.AppAuth.requireSession({ role: "admin" });

    if (!session) {
        return;
    }

    const form = document.getElementById("createUserForm");
    const message = document.getElementById("createUserMessage");
    const tableBody = document.getElementById("usersTableBody");
    const adminWelcome = document.getElementById("adminWelcome");
    const formTitle = document.getElementById("userFormTitle");
    const saveUserButton = document.getElementById("saveUserButton");
    const cancelEditButton = document.getElementById("cancelEditButton");
    let editingUsername = null;

    window.AppAuth.bindLogoutButton();
    adminWelcome.textContent = "Sesion activa: " + session.username;

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + (type === "success" ? "is-success" : "is-error");
    }

    function roleLabel(role) {
        return role === "admin" ? "Administrador" : "Usuario normal";
    }

    function resetForm() {
        editingUsername = null;
        form.reset();
        formTitle.textContent = "Crear usuario";
        saveUserButton.textContent = "Crear usuario";
        cancelEditButton.classList.add("is-hidden");
    }

    function startEdit(user) {
        editingUsername = user.username;
        form.username.value = user.username;
        form.password.value = user.password;
        form.role.value = user.role;
        formTitle.textContent = "Modificar usuario";
        saveUserButton.textContent = "Guardar cambios";
        cancelEditButton.classList.remove("is-hidden");
        message.className = "message";
        message.textContent = "";
        form.username.focus();
    }

    function buildActionButton(text, className, onClick) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.className = className;
        button.addEventListener("click", onClick);
        return button;
    }

    function renderUsers() {
        const users = window.AppStorage.getUsers();
        tableBody.innerHTML = "";

        users.forEach(function (user) {
            const row = document.createElement("tr");
            const usernameCell = document.createElement("td");
            const roleCell = document.createElement("td");
            const actionsCell = document.createElement("td");
            const actions = document.createElement("div");

            usernameCell.textContent = user.username;
            roleCell.textContent = roleLabel(user.role);
            actions.className = "row-actions";

            actions.append(
                buildActionButton("Editar", "button button-secondary button-small", function () {
                    startEdit(user);
                }),
                buildActionButton("Eliminar", "button button-danger button-small", function () {
                    if (!window.confirm("Seguro que deseas eliminar este usuario?")) {
                        return;
                    }

                    const result = window.AppStorage.deleteUser(user.username);
                    showMessage(result.message, result.ok ? "success" : "error");

                    if (result.ok) {
                        resetForm();
                        renderUsers();
                    }
                })
            );
            actionsCell.appendChild(actions);

            row.append(usernameCell, roleCell, actionsCell);
            tableBody.appendChild(row);
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const payload = {
            username: form.username.value,
            password: form.password.value,
            role: form.role.value
        };
        const result = editingUsername
            ? window.AppStorage.updateUser(editingUsername, payload)
            : window.AppStorage.addUser(payload);

        showMessage(result.message, result.ok ? "success" : "error");

        if (result.ok) {
            resetForm();
            renderUsers();
        }
    });

    cancelEditButton.addEventListener("click", function () {
        resetForm();
        message.className = "message";
        message.textContent = "";
    });

    renderUsers();
})();
