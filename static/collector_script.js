// Array to store full bin data
let binsData = [];

// Function to display full bins as a list
function displayFullBins(bins) {
    const fullBinsList = document.getElementById('fullBinsList');
    fullBinsList.innerHTML = '';  // Clear the list before adding new bins

    bins.forEach(bin => {
        const [id, level, status, lat, lon] = bin;

        // Only show bins that are full (status = 'Full')
        if (status === "Full") {
            // Create a list item for each full bin
            const listItem = document.createElement('li');
            listItem.innerHTML = `Bin ID: ${id}, Level: ${level}%, Status: ${status}`;
            fullBinsList.appendChild(listItem);
        }
    });
}

// Fetch all bins and display only full bins
document.getElementById('showFullBins').addEventListener('click', function() {
    fetch('/get_bins')
        .then(response => response.json())
        .then(data => {
            binsData = data.bins;
            const fullBins = binsData.filter(bin => bin[2] === "Full");
            displayFullBins(fullBins);
        })
        .catch(error => console.error('Error fetching bin data:', error));
});

// Handle the form submission to add a new bin
document.getElementById('addBinForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const level = document.getElementById('level').value;
    const status = document.getElementById('status').value;
    let latitude = parseFloat(document.getElementById('latitude').value);
    let longitude = parseFloat(document.getElementById('longitude').value);
    
    // Get direction values
    const latDirection = document.getElementById('latDirection').value;
    const lonDirection = document.getElementById('lonDirection').value;

    // Adjust coordinates based on direction
    if (latDirection === 'S') latitude = -latitude;
    if (lonDirection === 'W') longitude = -longitude;

    // Send data to the server
    fetch('/add_bin', {
        method: 'POST',
        body: new URLSearchParams({ level, status, latitude, longitude })
    }).then(response => {
        if (response.ok) alert("New bin added successfully!");
        else alert("Failed to add bin.");
    }).catch(error => console.error('Error:', error));
});
