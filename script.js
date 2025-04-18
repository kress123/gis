document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah reload halaman

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Cek kredensial sederhana (bisa diganti dengan autentikasi server)
    if (username === "kres" && password === "123") {
        alert("Login berhasil!");
        window.location.href = "dashboard.html"; // Redirect ke Dashboard
    } else {
        errorMessage.textContent = "Username atau password salah!";
    }
});
