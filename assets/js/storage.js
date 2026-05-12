(function () {
    const USERS_KEY = "upsCorreoElectronico.users";
    const SESSION_KEY = "upsCorreoElectronico.session";
    const DEFAULT_ADMIN = {
        username: "admin",
        password: "admin",
        role: "admin"
    };

    function readJson(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function normalizeUsername(username) {
        return String(username || "").trim().toLowerCase();
    }

    function ensureDefaultAdmin() {
        const storedUsers = localStorage.getItem(USERS_KEY);

        if (!storedUsers) {
            writeJson(USERS_KEY, [DEFAULT_ADMIN]);
            return [DEFAULT_ADMIN];
        }

        const users = readJson(USERS_KEY, []);
        return Array.isArray(users) && users.length ? users : [DEFAULT_ADMIN];
    }

    function getUsers() {
        return ensureDefaultAdmin();
    }

    function saveUsers(users) {
        writeJson(USERS_KEY, users);
    }

    function findUser(username) {
        const normalized = normalizeUsername(username);
        return getUsers().find((user) => normalizeUsername(user.username) === normalized) || null;
    }

    function addUser(user) {
        const username = String(user.username || "").trim();
        const password = String(user.password || "").trim();
        const role = user.role === "admin" ? "admin" : "user";

        if (!username || !password) {
            return { ok: false, message: "Usuario y contrasena son obligatorios." };
        }

        if (findUser(username)) {
            return { ok: false, message: "Ya existe un usuario con ese nombre." };
        }

        const users = getUsers();
        users.push({ username, password, role });
        saveUsers(users);

        return { ok: true, message: "Usuario creado correctamente." };
    }

    function countAdmins(users) {
        return users.filter((user) => user.role === "admin").length;
    }

    function updateUser(originalUsername, changes) {
        const users = getUsers();
        const session = getSession();
        const originalNormalized = normalizeUsername(originalUsername);
        const userIndex = users.findIndex((user) => normalizeUsername(user.username) === originalNormalized);

        if (userIndex === -1) {
            return { ok: false, message: "No se encontro el usuario seleccionado." };
        }

        const username = String(changes.username || "").trim();
        const password = String(changes.password || "").trim();
        const role = changes.role === "admin" ? "admin" : "user";
        const duplicate = users.some(function (user, index) {
            return index !== userIndex && normalizeUsername(user.username) === normalizeUsername(username);
        });

        if (!username || !password) {
            return { ok: false, message: "Usuario y contrasena son obligatorios." };
        }

        if (duplicate) {
            return { ok: false, message: "Ya existe un usuario con ese nombre." };
        }

        if (users[userIndex].role === "admin" && role !== "admin" && countAdmins(users) <= 1) {
            return { ok: false, message: "Debe existir al menos un administrador." };
        }

        const isActiveUser = session && normalizeUsername(session.username) === originalNormalized;

        if (isActiveUser && users[userIndex].role === "admin" && role !== "admin") {
            return { ok: false, message: "No puedes quitar el rol de administrador a tu propia sesion." };
        }

        users[userIndex] = { username, password, role };
        saveUsers(users);

        if (isActiveUser) {
            setSession(users[userIndex]);
        }

        return { ok: true, message: "Usuario actualizado correctamente.", user: users[userIndex] };
    }

    function deleteUser(username) {
        const users = getUsers();
        const session = getSession();
        const normalized = normalizeUsername(username);
        const userIndex = users.findIndex((user) => normalizeUsername(user.username) === normalized);

        if (userIndex === -1) {
            return { ok: false, message: "No se encontro el usuario seleccionado." };
        }

        if (session && normalizeUsername(session.username) === normalized) {
            return { ok: false, message: "No puedes eliminar el usuario con la sesion activa." };
        }

        if (users[userIndex].role === "admin" && countAdmins(users) <= 1) {
            return { ok: false, message: "Debe existir al menos un administrador." };
        }

        users.splice(userIndex, 1);
        saveUsers(users);

        return { ok: true, message: "Usuario eliminado correctamente." };
    }

    function getSession() {
        return readJson(SESSION_KEY, null);
    }

    function setSession(user) {
        writeJson(SESSION_KEY, {
            username: user.username,
            role: user.role
        });
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    window.AppStorage = {
        addUser,
        clearSession,
        deleteUser,
        findUser,
        getSession,
        getUsers,
        normalizeUsername,
        setSession,
        updateUser
    };
})();
