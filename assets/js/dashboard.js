(function () {
    const session = window.AppAuth.requireSession({ role: "user" });

    if (!session) {
        return;
    }

    document.getElementById("userWelcome").textContent = "Sesion activa: " + session.username;
    window.AppAuth.bindLogoutButton();
})();
