async function calculateFare() {
    const depAddress = document.getElementById('depAddress').value;
    const arrAddress = document.getElementById('arrAddress').value;

    if (!depAddress || !arrAddress) {
        alert('Please enter both departure and arrival addresses.');
        return;
    }

    try {
        // Get latitude and longitude for the departure address
        const depLatLng = await getLatLng(depAddress);
        // Get latitude and longitude for the arrival address
        const arrLatLng = await getLatLng(arrAddress);

        if (depLatLng && arrLatLng) {
            // Calculate the fare
            const fare = await getFare(depLatLng, arrLatLng);
            displayResults(fare);
        } else {
            alert('Unable to get location details.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while calculating the fare.');
    }
}

async function getLatLng(address) {
    const url = `https://maps-data.p.rapidapi.com/geocoding.php?query=${encodeURIComponent(address)}&lang=en&country=fr`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '879c4e3d8fmsh7d48e509036c3cfp1dda49jsn8fa59471ca0a',
            'x-rapidapi-host': 'maps-data.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (data && data.data) {
        return {
            lat: data.data.lat,
            lng: data.data.lng
        };
    }
    return null;
}

async function getFare(depLatLng, arrLatLng) {
    const url = `https://taxi-fare-calculator.p.rapidapi.com/search-geo?dep_lat=${depLatLng.lat}&dep_lng=${depLatLng.lng}&arr_lat=${arrLatLng.lat}&arr_lng=${arrLatLng.lng}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '879c4e3d8fmsh7d48e509036c3cfp1dda49jsn8fa59471ca0a',
            'x-rapidapi-host': 'taxi-fare-calculator.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

function displayResults(fare) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (fare && fare.journey) {
        const fareInfo = `
            <div class="result-item">
                <p><strong>City Name:</strong> ${fare.journey.city_name}</p>
                <p><strong>Departure Location:</strong> ${fare.journey.department}</p>
                <p><strong>Arrival Location:</strong> ${fare.journey.arrival}</p>
                <p><strong>Duration:</strong> ${fare.journey.duration} minutes</p>
                <p><strong>Distance:</strong> ${fare.journey.distance} km</p>
                ${fare.journey.fares.map(fareDetail => {
                    const originalPrice = fareDetail.price_in_INR;
                    const discountedPrice = (originalPrice * 0.03).toFixed(2); // Deduct 95%, keep 5%
                    return `
                        <p><strong>Fare (${fareDetail.name}):</strong> ₹${discountedPrice}</p>
                    `;
                }).join('')}
                <button>Proceed to pay</button>
            </div>
        `;
        resultsDiv.innerHTML = fareInfo;
    } else {
        resultsDiv.innerHTML = '<p>No fare details found.</p>';
    }
}