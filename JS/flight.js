// Function to fetch skyId and entityId for a location (origin or destination)
async function fetchLocationData(location) {
    const url = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${location}&locale=en-US`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '879c4e3d8fmsh7d48e509036c3cfp1dda49jsn8fa59471ca0a',
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        // Ensure we have a valid response
        if (result.status && result.data && result.data[0]) {
            const skyId = result.data[0].skyId;
            const entityId = result.data[0].entityId;
            return { skyId, entityId };
        } else {
            throw new Error(`Could not fetch data for location: ${location}`);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to fetch flight data from the API
async function fetchFlightData(originSkyId, originEntityId, destinationSkyId, destinationEntityId, departureDate) {
    const url = `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?originSkyId=${originSkyId}&destinationSkyId=${destinationSkyId}&originEntityId=${originEntityId}&destinationEntityId=${destinationEntityId}&date=${departureDate}&cabinClass=economy&adults=1&sortBy=best&currency=INR&market=en-US&countryCode=US`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '879c4e3d8fmsh7d48e509036c3cfp1dda49jsn8fa59471ca0a',
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        // Assuming API response is in the right format
        if (result.status || result.data.itineraries) {
            displayResults(result.data.itineraries);
        } else {
            console.error("Error fetching flight data");
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to display results in card format
function displayResults(itineraries) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    itineraries.forEach(itinerary => {
        const price = itinerary.price.formatted;
        localStorage.setItem('flightPrice', price);
        const flightId = itinerary.id;
        const legs = itinerary.legs;

        legs.forEach(leg => {
            const departureTime = leg.departure;
            const arrivalTime = leg.arrival;
            const durationInMinutes = leg.durationInMinutes;
            const stopCount = leg.stopCount;
            const origin = leg.origin.city;
            const destination = leg.destination.city;

            // Convert duration from minutes to hours and minutes
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;
            const totalDuration = `${hours}h ${minutes}m`;

            // HTML structure for each flight card
            const html = `
                <div class="flight-card">
                    <img src="https://content.skyscnr.com/m/3719e8f4a5daf43d/original/Flights-Placeholder.jpg" alt="Flight Image">
                    <div class="flight-price">${price} </div>
                    <div class="flight-details">
                        <strong>Flight ID:</strong> ${flightId}<br>
                        <strong>Origin:</strong> ${origin}<br>
                        <strong>Destination:</strong> ${destination}<br>
                        <strong>Departure:</strong> ${new Date(departureTime).toLocaleString()}<br>
                        <strong>Arrival:</strong> ${new Date(arrivalTime).toLocaleString()}<br>
                        <strong>Total Duration:</strong> ${totalDuration}<br>
                        <strong>Stops:</strong> ${stopCount}
                    </div>
                </div>
            `;
            resultsDiv.innerHTML += html;
        });
    });
}

// Handle form submission
document.getElementById('flightForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departureDate').value;

    // Step 1: Fetch skyId and entityId for both origin and destination
    const originData = await fetchLocationData(origin);
    const destinationData = await fetchLocationData(destination);

    if (originData && destinationData) {
        // Step 2: Fetch flight data using skyId and entityId
        fetchFlightData(originData.skyId, originData.entityId, destinationData.skyId, destinationData.entityId, departureDate);
    } else {
        alert("Error fetching location data. Please try again.");
    }
});

function redirectToFlightBooking() {
    window.location.href = 'flightbook.html'; 
}