// tabel-data.js

document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "koordinatData";
    const tbody = document.getElementById("dataTabelBody");
    const mapContainer = document.getElementById("map");

    // Inisialisasi peta
    const map = L.map(mapContainer).setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Fungsi zoom global
    window.zoomToLocation = (lat, lng) => {
        const la = parseFloat(lat), lo = parseFloat(lng);
        if (!isNaN(la) && !isNaN(lo)) {
            map.setView([la, lo], 16);
        }
    };

    // Ambil data dari localStorage
    function getData() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    // Simpan data ke localStorage
    function saveData(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    // Bersihkan semua marker sebelumnya
    function clearMarkers() {
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    // Render tabel dan peta
    function renderAll() {
        const data = getData();
        // 1. Render tabel
        tbody.innerHTML = "";
        clearMarkers();

        data.forEach((item, idx) => {
            // Buat baris tabel
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.no}</td>
                <td>${item.labId}</td>
                <td>${item.blok}</td>
                <td>${item.nomorPlot}</td>
                <td>${item.nomorPokok}</td>
                <td>${item.nomorDaun}</td>
                <td>${item.latitude}</td>
                <td>${item.longitude}</td>
                <td>${item.n}</td>
                <td>${item.p}</td>
                <td>${item.k}</td>
                <td>${item.ca}</td>
                <td>${item.mg}</td>
                <td>${item.b}</td>
                <td>${item.periodePupuk || "-"}</td>
                <td>
                    <!-- Update tombol Lihat Peta menggunakan link -->
                    <a href="peta.html?lat=${item.latitude}&lon=${item.longitude}" class="btn-lihat-peta">Lihat di Peta</a>
                </td>
            `;
            tbody.appendChild(tr);

            // Tambah marker di peta
            const la = parseFloat(item.latitude),
                  lo = parseFloat(item.longitude);
            if (!isNaN(la) && !isNaN(lo)) {
                L.marker([la, lo])
                    .addTo(map)
                    .bindPopup(`<b>${item.labId}</b><br>${item.blok}`);
            }
        });
    }

    // Hapus baris dari tabel & storage
    tbody.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-hapus")) {
            const idx = parseInt(e.target.dataset.idx, 10);
            const arr = getData();
            arr.splice(idx, 1);
            saveData(arr);
            renderAll();
        }
    });

    // Inisialisasi tampilan pertama
    renderAll();
});
