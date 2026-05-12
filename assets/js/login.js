(function () {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");

    window.AppStorage.getUsers();
    window.AppAuth.redirectIfLoggedIn();

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + (type === "success" ? "is-success" : "is-error");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = form.username.value.trim();
        const password = form.password.value.trim();

        if (!username || !password) {
            showMessage("Completa usuario y contrasena.", "error");
            return;
        }

        const result = window.AppAuth.authenticate(username, password);

        if (!result.ok) {
            showMessage(result.message, "error");
            return;
        }

        window.location.href = result.user.role === "admin" ? "admin.html" : "dashboard.html";
    });
})();
