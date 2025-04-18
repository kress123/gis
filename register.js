document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("register-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value || "user";

    let akun = JSON.parse(localStorage.getItem("akunWebGIS")) || [];

    // Cek apakah username atau email sudah digunakan
    const duplikat = akun.find(user => user.username === username || user.email === email);

    if (duplikat) {
      msg.textContent = "Username atau email sudah terdaftar.";
      msg.style.display = "block";
      return;
    }

    // Simpan ke localStorage
    akun.push({ username, email, password, role });
    localStorage.setItem("akunWebGIS", JSON.stringify(akun));

    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "login.html";
  });
});
