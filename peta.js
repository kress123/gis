// Inisialisasi Peta
let map = L.map("map").setView([-2.5489, 118.0149], 5); // Koordinat tengah Indonesia

// Basemap
let baseLayers = {
    osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
    }),
    googleSatellite: L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }),
    googleStreet: L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    })
};

// Tampilkan default
baseLayers.osm.addTo(map);

// Fungsi ganti basemap
document.getElementById("basemapSelect").addEventListener("change", function () {
    let selected = this.value;
    map.eachLayer(layer => map.removeLayer(layer)); // Hapus semua layer
    baseLayers[selected].addTo(map); // Tambahkan layer yang dipilih
    tampilkanDataKoordinat(); // Tambahkan marker kembali
});

// Fungsi menampilkan marker dan info popup
function tampilkanDataKoordinat() {
    const koordinatData = JSON.parse(localStorage.getItem("koordinatData")) || [];

    koordinatData.forEach(data => {
        if (!data.latitude || !data.longitude) return;

        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);

        const marker = L.marker([lat, lon]).addTo(map);

        // Siapkan konten popup
        let popupContent = `
            <strong>Lab ID:</strong> ${data.labId}<br>
            <strong>Blok:</strong> ${data.blok}<br>
            <strong>Plot:</strong> ${data.nomorPlot}<br>
            <strong>Pokok:</strong> ${data.nomorPokok}<br>
            <strong>Daun:</strong> ${data.nomorDaun}<br><br>
            <strong>N%:</strong> ${data.n} | <strong>P%:</strong> ${data.p} | <strong>K%:</strong> ${data.k}<br>
            <strong>Ca%:</strong> ${data.ca} | <strong>Mg%:</strong> ${data.mg} | <strong>B:</strong> ${data.b} ppm<br><br>`;

        // Tambahkan foto jika ada
        if (data.foto) {
            popupContent += `
                <img src="${data.foto}" alt="Foto Tanaman" width="100" style="margin-top:8px; border-radius:6px;"><br><br>
            `;
        }

        // Tambahkan tombol rute
        popupContent += `
            <button onclick="bukaRute(${lat}, ${lon})" style="margin-top:5px;padding:4px 8px;">🧭 Rute ke Lokasi</button>
        `;

        marker.bindPopup(popupContent);
    });
}

// Fungsi membuka Google Maps untuk rute dari lokasi pengguna ke titik
function bukaRute(destLat, destLon) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const userLat = pos.coords.latitude;
                const userLon = pos.coords.longitude;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${destLat},${destLon}&travelmode=driving`;
                window.open(url, "_blank");
            },
            () => {
                alert("Gagal mendapatkan lokasi Anda.");
            }
        );
    } else {
        alert("Browser tidak mendukung geolokasi.");
    }
}

// Jalankan saat halaman dimuat
tampilkanDataKoordinat();
