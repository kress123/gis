document.addEventListener("DOMContentLoaded", function () {
  let map;
  let baseLayers;

  function showSection(sectionId) {
      document.querySelectorAll("section").forEach(section => {
          section.classList.add("hidden");
      });
      document.getElementById(sectionId).classList.remove("hidden");
  }

  document.getElementById("dashboard-link").addEventListener("click", function () {
      showSection("dashboard-overview");
  });

  document.getElementById("map-link").addEventListener("click", function () {
      showSection("map-section");
      setTimeout(loadMap, 100);
  });

  function loadMap() {
      if (map) return;

      map = L.map("map").setView([-2.5489, 118.0149], 5);

      let osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '© OpenStreetMap' });
      let satelliteLayer = L.tileLayer("https://{s}.google.com/earth/vt/lyrs=s&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"], attribution: '© Google Maps' });
      let terrainLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { attribution: '© OpenTopoMap' });

      baseLayers = {
          "osm": osmLayer,
          "satellite": satelliteLayer,
          "terrain": terrainLayer
      };

      osmLayer.addTo(map);

      document.getElementById("basemapSelect").addEventListener("change", function () {
          let selectedLayer = this.value;
          map.eachLayer(layer => map.removeLayer(layer));
          baseLayers[selectedLayer].addTo(map);
      });

      let koordinatData = JSON.parse(localStorage.getItem("koordinat")) || [];
      koordinatData.forEach(koordinat => {
          L.marker([koordinat.lat, koordinat.lng]).addTo(map)
              .bindPopup(`<b>${koordinat.desc}</b><br>Lat: ${koordinat.lat}, Lng: ${koordinat.lng}`);
      });
  }

  document.getElementById("logout-link").addEventListener("click", function () {
      window.location.href = "login.html";
  });
});
// Inisialisasi Peta
var map = L.map('map').setView([-2.5489, 118.0149], 5); // Koordinat Indonesia

// Layer Peta
var baseMaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }),
    "Satelit": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors'
    }),
    "Terrain": L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=YOUR_API_KEY', {
        attribution: '&copy; Thunderforest'
    })
};

// Default Peta
baseMaps["OpenStreetMap"].addTo(map);

// Event Pilihan Basemap
document.getElementById("basemapSelect").addEventListener("change", function() {
    var selectedLayer = this.value;
    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });
    baseMaps[selectedLayer].addTo(map);
});

// Inisialisasi Peta
var map = L.map("map").setView([-2.5489, 118.0149], 5);

// Definisikan tile layer
var baseLayers = {
    "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map),
    "OpenStreetMap HOT": L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"),
    "Google Satelit": L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"] }),
    "Google Street": L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"] }),
    "Carto Light": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { subdomains: "abcd" }),
    "Carto Dark": L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { subdomains: "abcd" })
};

// Tambahkan kontrol layer
L.control.layers(baseLayers).addTo(map);

// Fungsi untuk mengganti basemap
document.getElementById("basemapSelect").addEventListener("change", function (e) {
    var selectedLayer = e.target.value;

    // Nonaktifkan semua layer
    Object.values(baseLayers).forEach(layer => map.removeLayer(layer));

    // Aktifkan layer yang dipilih
    baseLayers[selectedLayer].addTo(map);
});

// Fungsi Pencarian Lokasi
document.getElementById("search-btn").addEventListener("click", function () {
    var query = document.getElementById("search-input").value;
    if (query) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = parseFloat(data[0].lat);
                    var lon = parseFloat(data[0].lon);
                    map.setView([lat, lon], 15);
                    L.marker([lat, lon]).addTo(map).bindPopup(`Lokasi: ${query}`).openPopup();
                } else {
                    alert("Lokasi tidak ditemukan!");
                }
            })
            .catch(error => console.error(error));
    }
});
