document.addEventListener("DOMContentLoaded", () => {
    const userBtn     = document.getElementById("loginUser");
    const adminBtn    = document.getElementById("loginAdmin");
    const registerBtn = document.getElementById("register");
    const errorMsg    = document.getElementById("error-message");
  
    // 1️⃣ Tambahkan akun admin default jika belum ada
    function initAdminAccount() {
      const akunLokal    = JSON.parse(localStorage.getItem("akunWebGIS")) || [];
      const adminSudahAda = akunLokal.some(u => u.role === "admin");
      if (!adminSudahAda) {
        akunLokal.push({
          username: "admin",
          email:    "admin@sampoerna.com",
          password: "admin123",
          role:     "admin"
        });
        localStorage.setItem("akunWebGIS", JSON.stringify(akunLokal));
      }
    }
  
    // 2️⃣ Ambil semua akun dari localStorage
    function getUsers() {
      return JSON.parse(localStorage.getItem("akunWebGIS")) || [];
    }
  
    // 3️⃣ Fungsi login (cek username/email + password + role)
    function login(role) {
      const inp  = document.getElementById("username").value.trim();
      const pass = document.getElementById("password").value.trim();
  
      const users = getUsers();
      const found = users.find(u =>
        (u.username === inp || u.email === inp) &&
         u.password === pass &&
         u.role === role
      );
  
      if (found) {
        // simpan data login
        localStorage.setItem("loginAktif", JSON.stringify(found));
  
        // redirect sesuai role
        if (role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "dashboard.html";
        }
      } else {
        errorMsg.style.display = "block";
      }
    }
  
    // Jalankan inisialisasi admin
    initAdminAccount();
  
    // Event listener
    userBtn.addEventListener("click",  () => login("user"));
    adminBtn.addEventListener("click", () => login("admin"));
    registerBtn.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  });
  