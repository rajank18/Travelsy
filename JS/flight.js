document.getElementById('flightSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fromAirport = document.getElementById('fromAirport').value;
    const toAirport = document.getElementById('toAirport').value;
    const tripType = document.getElementById('tripType').value;
    
    searchFlights(fromAirport, toAirport, tripType);
});

function searchFlights(fromEntityId, toEntityId, type) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            displayResults(JSON.parse(this.responseText));
        }
    });

    const apiUrl = `https://sky-scanner3.p.rapidapi.com/flights/search-everywhere?fromEntityId=${fromEntityId}&toEntityId=${toEntityId}&type=${type}`;
    
    xhr.open('GET', apiUrl);
    xhr.setRequestHeader('x-rapidapi-key', '9a9dee9c97mshae5be1fb932b74ep1548eejsndb8d2b6f2697');
    xhr.setRequestHeader('x-rapidapi-host', 'sky-scanner3.p.rapidapi.com');

    xhr.send(data);
}

function displayResults(response) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (response.data && response.data.flightQuotes) {
        const flightQuotes = response.data.flightQuotes.buckets[0].resultIds;
        flightQuotes.forEach(flight => {
            const flightItem = document.createElement('div');
            flightItem.classList.add('result-item');
            flightItem.textContent = `Flight ID: ${flight}`;
            resultsContainer.appendChild(flightItem);
        });
    } else {
        resultsContainer.textContent = 'No flights found.';
    }
}

