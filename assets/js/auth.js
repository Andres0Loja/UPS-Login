(function () {
    function authenticate(username, password) {
        const user = window.AppStorage.findUser(username);

        if (!user || user.password !== String(password || "").trim()) {
            return { ok: false, message: "Usuario o contrasena incorrectos." };
        }

        window.AppStorage.setSession(user);
        return { ok: true, user };
    }

    function requireSession(options) {
        const session = window.AppStorage.getSession();

        if (!session) {
            window.location.href = "index.html";
            return null;
        }

        if (options && options.role && session.role !== options.role) {
            window.location.href = session.role === "admin" ? "admin.html" : "dashboard.html";
            return null;
        }

        return session;
    }

    function redirectIfLoggedIn() {
        const session = window.AppStorage.getSession();

        if (!session) {
            return;
        }

        window.location.href = session.role === "admin" ? "admin.html" : "dashboard.html";
    }

    function logout() {
        window.AppStorage.clearSession();
        window.location.href = "index.html";
    }

    function bindLogoutButton() {
        const logoutButton = document.getElementById("logoutButton");

        if (logoutButton) {
            logoutButton.addEventListener("click", logout);
        }
    }

    window.AppAuth = {
        authenticate,
        bindLogoutButton,
        logout,
        redirectIfLoggedIn,
        requireSession
    };
})();
