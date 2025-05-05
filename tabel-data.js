document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "koordinatData";
    const tbody = document.getElementById("dataTabelBody");
    const map = L.map("map").setView([-2.5489, 118.0149], 5); // Pusat Indonesia

    // Tambahkan tile layer OSM
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Simpan referensi marker
    let markers = [];

    // Fungsi zoom ke lokasi
    window.zoomToLocation = function(lat, lng) {
        const la = parseFloat(lat), lo = parseFloat(lng);
        if (!isNaN(la) && !isNaN(lo)) {
            map.setView([la, lo], 16);
        }
    };

    // Tambahkan marker ke peta dan simpan referensinya
    function addMarker(lat, lng, label) {
        const la = parseFloat(lat), lo = parseFloat(lng);
        if (!isNaN(la) && !isNaN(lo)) {
            const marker = L.marker([la, lo])
                .addTo(map)
                .bindPopup(`<b>${label}</b><br>Lat: ${lat}<br>Lng: ${lng}`);
            markers.push(marker);
        }
    }

    // Hapus semua marker dari peta
    function clearMarkers() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    }

    // Ambil data dari localStorage
    function getData() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    // Simpan data ke localStorage
    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Tampilkan ulang data di tabel dan peta
    function renderTable() {
        const data = getData();
        tbody.innerHTML = "";
        clearMarkers();

        // Menyiapkan data untuk grafik
        let pupukData = {
            n: 0,
            p: 0,
            k: 0,
            ca: 0,
            mg: 0,
            b: 0
        };

        data.forEach((item, idx) => {
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
                <td>${item.periodePupuk || '-'}</td>
                <td>
                    ${item.foto ? `<img src="${item.foto}" alt="Foto" width="60" height="60">` : '-' }
                </td>
                <td>
                    <button onclick="zoomToLocation(${item.latitude}, ${item.longitude})">Lihat Peta</button>
                </td>
            `;
            tbody.appendChild(tr);

            // Menambahkan data pupuk untuk grafik
            pupukData.n += parseFloat(item.n) || 0;
            pupukData.p += parseFloat(item.p) || 0;
            pupukData.k += parseFloat(item.k) || 0;
            pupukData.ca += parseFloat(item.ca) || 0;
            pupukData.mg += parseFloat(item.mg) || 0;
            pupukData.b += parseFloat(item.b) || 0;

            addMarker(item.latitude, item.longitude, item.labId);
        });

        // Membuat chart
        createChart(pupukData);
    }

    // Fungsi untuk membuat chart
    function createChart(pupukData) {
        const ctx = document.getElementById("pupukChart").getContext("2d");

        // Pastikan elemen canvas ada
        if (!ctx) {
            console.error("Elemen canvas untuk grafik tidak ditemukan.");
            return;
        }

        // Cek apakah data untuk grafik valid
        if (Object.values(pupukData).some(value => isNaN(value))) {
            console.error("Data pupuk tidak valid.");
            return;
        }

        // Buat chart
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["N%", "P%", "K%", "Ca%", "Mg%", "B (ppm)"],
                datasets: [{
                    label: "Rata-Rata Unsur Hara",
                    data: [
                        pupukData.n,
                        pupukData.p,
                        pupukData.k,
                        pupukData.ca,
                        pupukData.mg,
                        pupukData.b
                    ],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Event hapus (jika Anda menambahkan tombol hapus)
    tbody.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-hapus")) {
            const idx = parseInt(e.target.dataset.idx, 10);
            const data = getData();
            data.splice(idx, 1);
            saveData(data);
            renderTable();
        }
    });

    // Inisialisasi awal
    renderTable();
});
