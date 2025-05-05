document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('koordinatForm');
  const tbody = document.querySelector('#dataTable tbody') || document.getElementById('tabelBody');
  const basemapSelect = document.getElementById('basemapSelect');
  const STORAGE_KEY = 'koordinatData';

  // Inisialisasi peta
  const map = L.map('map').setView([-2.5, 118], 5);
  const basemaps = {
    googleSatellite: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    googleStreet: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
  };

  if (basemapSelect) {
    basemaps[basemapSelect.value].addTo(map);
    basemapSelect.addEventListener('change', () => {
      map.eachLayer(l => map.removeLayer(l));
      basemaps[basemapSelect.value].addTo(map);
    });
  } else {
    basemaps.osm.addTo(map);
  }

  function zoomToLocation(lat, lng) {
    const la = parseFloat(lat), lo = parseFloat(lng);
    if (!isNaN(la) && !isNaN(lo)) {
      map.setView([la, lo], 16);
    }
  }
  window.zoomToLocation = zoomToLocation;

  function addMarker(lat, lng, label) {
    const la = parseFloat(lat), lo = parseFloat(lng);
    if (!isNaN(la) && !isNaN(lo)) {
      const marker = L.marker([la, lo]).addTo(map);
      marker.bindPopup(`<b>${label}</b><br>Lat: ${lat}<br>Lng: ${lng}`);
    }
  }

  function renderTable() {
    tbody.innerHTML = '';
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    data.forEach((item, idx) => {
      const tr = document.createElement('tr');
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
          <button class="btn-hapus" data-idx="${idx}">Hapus</button>
          <button onclick="zoomToLocation(${item.latitude}, ${item.longitude})">Lihat Peta</button>
        </td>
      `;
      tbody.appendChild(tr);
      addMarker(item.latitude, item.longitude, item.labId);
    });
  }

  // Submit form handler (hanya satu kali)
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fileInput = form.foto;
    const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        simpanData(event.target.result); // base64 dari gambar
      };
      reader.readAsDataURL(file);
    } else {
      simpanData(null); // tidak ada foto
    }
  });

  function simpanData(fotoBase64) {
    const data = {
      no: form.no.value,
      labId: form.labId.value,
      blok: form.blok.value,
      nomorPlot: form.nomorPlot.value,
      nomorPokok: form.nomorPokok.value,
      nomorDaun: form.nomorDaun.value,
      latitude: form.latitude.value,
      longitude: form.longitude.value,
      n: form.n.value,
      p: form.p.value,
      k: form.k.value,
      ca: form.ca.value,
      mg: form.mg.value,
      b: form.b.value,
      periodePupuk: form.periodePupuk?.value || '-',
      foto: fotoBase64
    };

    const dataArr = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    dataArr.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArr));
    form.reset();
    renderTable();
    alert('Data berhasil disimpan!');
  }

  tbody.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-hapus')) {
      const idx = parseInt(e.target.dataset.idx, 10);
      const dataArr = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      dataArr.splice(idx, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArr));
      renderTable();
    }
  });

  renderTable();
});
