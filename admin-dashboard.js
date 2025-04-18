document.addEventListener("DOMContentLoaded", () => {
    // Ambil data login dari localStorage
    const loginData = JSON.parse(localStorage.getItem("loginAktif"));
  
    // Jika tidak login atau bukan admin, tolak akses
    if (!loginData || loginData.role !== "admin") {
      alert("Akses ditolak! Hanya admin yang dapat mengakses halaman ini.");
      window.location.href = "login.html";
      return;
    }
  
    // Jika lolos, lanjut load dashboard admin
    console.log("Admin dashboard loaded untuk:", loginData.username);
  
    // Tombol logout
    const logoutBtn = document.getElementById("logoutButton");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loginAktif");
        window.location.href = "login.html";
      });
    }
  });
  