const map = L.map('map').setView([12.9184, 79.1325], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let binsData = [];
let userLocation = null;

fetch('/get_bins')
    .then(response => response.json())
    .then(data => {
        binsData = data.bins;
        binsData.forEach(bin => {
            L.marker([bin[3], bin[4]])
                .addTo(map)
                .bindPopup(`<b>Bin ID:</b> ${bin[0]}<br><b>Status:</b> ${bin[2]}`);
        });
    });

navigator.geolocation.getCurrentPosition(position => {
    userLocation = [position.coords.latitude, position.coords.longitude];
    L.marker(userLocation).addTo(map).bindPopup('Your Location').openPopup();
    map.setView(userLocation, 13);
});

function findNearestBin() {
    let nearestBin = null;
    let minDistance = Infinity;

    binsData.forEach(bin => {
        const distance = map.distance(userLocation, [bin[3], bin[4]]);
        if (distance < minDistance) {
            minDistance = distance;
            nearestBin = bin;
        }
    });

    if (nearestBin) {
        alert(`Nearest Bin: ID ${nearestBin[0]}, Status: ${nearestBin[2]}, Distance: ${minDistance.toFixed(2)}m`);
    }
}

function scanCode() {
    const binId = prompt("Enter Bin ID:");
    const bin = binsData.find(b => b[0] == binId);
    if (bin) {
        alert(`Bin ID: ${bin[0]}, Status: ${bin[2]}`);
    } else {
        alert("Bin not found");
    }
}

function updateBinStatus() {
    const binId = prompt("Enter Bin ID:");
    const status = prompt("Enter new status (Full/Empty/Partially Full):");

    fetch('/update_status', {
        method: 'POST',
        body: new URLSearchParams({ id: binId, status })
    }).then(response => {
        if (response.ok) alert("Status updated!");
    });
}
