let map = L.map('map').setView([12.9716, 77.5946], 12); // Bengaluru default
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  let marker;

  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
  });