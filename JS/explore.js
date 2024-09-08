let cityName;
function searchCity() {
    cityName= document.getElementById("citySearch").value.trim();

    if (cityName) {
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        window.location.href = `city.html?city=${cityName}`;
    } else {
        alert("Please enter a city name.");
    }
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');

    if (cityName) {
        document.title = `Explore ${cityName}`;
        document.getElementById("head").textContent = cityName;
        document.getElementById("cityName").textContent = cityName;
        document.getElementById("hotelhead").textContent = cityName;

        fetchCityData(cityName);
        searchHotels(cityName);
        searchCity(cityName);
        result(cityName);
    }
}

function fetchCityData(cityName) {
    const wikipediaAPI = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;

    fetch(wikipediaAPI)
        .then(response => response.json())
        .then(data => {
            if (data.type === "standard") {
                // Set the image source in the #image div
                document.getElementById("image").innerHTML = `
                    <img src="${data.thumbnail ? data.thumbnail.source : ''}" alt="${cityName}" style="width:300px; height:auto;">
                `;

                // Set the city information in the #cityInfo div
                document.getElementById("cityInfo").innerHTML = `
                    <p>${data.extract}</p>
                    <a href="${data.content_urls.desktop.page}" target="_blank">Read more on Wikipedia</a> 
                `;
            } else {
                document.getElementById("cityInfo").textContent = "City information not available.";
                document.getElementById("image").textContent = ""; // Clear the image if not available
            }
        })
        .catch(error => console.error("Error fetching city data:", error));
}

async function fetchPhotos() {
    const placeName = document.getElementById('placeInput').value.trim();

    if (placeName) {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&per_page=5&client_id=tt3HHYA2pmd5M9OnGSSTe0_litOTp2JRxyhMpUiWodc`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const imagesContainer = document.getElementById('imagesContainer');
            imagesContainer.innerHTML = '';

            data.results.forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.urls.small;
                img.alt = photo.alt_description;
                img.style.width = '300px'; // Adjust width as needed
                img.style.width = '400px';
                img.style.margin = '5px'; // Add margin between images
                imagesContainer.appendChild(img);
            });
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    } else {
        alert("Please enter a place name.");
    }
}
var userMarker = null;
var searchMarker = null;
var userLocation = null;
var searchedLocation = null;

// Initialize map without setting a view initially
var map = L.map('map');

// Tile Layers (Customizable Map Layers)
var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var satellite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');

var baseMaps = {
    "Streets": streets,
    "Satellite": satellite
};
L.control.layers(baseMaps).addTo(map);

// Geocoder
var geocoder = L.Control.Geocoder.nominatim();

// Function to search for the city
function searchCity(city) {
    geocoder.geocode(city, function(results) {
        if (results.length > 0) {
            searchedLocation = results[0].center;
            clearMarkers(); // Clear existing markers
            searchMarker = L.marker(searchedLocation).addTo(map)
                .bindPopup(results[0].name)
                .openPopup();

            if (userLocation) {
                // Smooth transition to searched location
                map.flyTo(searchedLocation, 13, {
                    duration: 2 // Duration of the animation in seconds
                });

                displayDistance(userLocation, searchedLocation);

                // Add routing control with a slight delay to ensure it's not blocking the animation
                setTimeout(() => {
                    L.Routing.control({
                        waypoints: [
                            L.latLng(userLocation),
                            L.latLng(searchedLocation)
                        ],
                        routeWhileDragging: true
                    }).addTo(map);
                }, 500); // 0.5 second delay before adding routing control
            }
        } else {
            alert('City not found');
        }
    });
}

function displayDistance(loc1, loc2) {
    const distance = loc1.distanceTo(loc2); 
    document.getElementById('distance-info').textContent = `Distance to the location from your current location is: ${Math.round(distance / 1000)} km`; 
    recommendTransport(distance);
}

function recommendTransport(distance) {
    let transport;
    if (distance <= 1000) {
        transport = "Walking or Biking";
    } else if (distance <= 50000) {
        transport = "Car or Public Transit";
    } else if (distance <= 1000000) {
        transport = "Train";
    } else {
        transport = "Flight";
    }
    document.getElementById('transport-info').textContent = `Recommended mode of transport: ${transport}`;
}

function clearMarkers() {
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    if (searchMarker) {
        map.removeLayer(searchMarker);
    }
}

// Track and display user's location
navigator.geolocation.getCurrentPosition(success, error);

function success(pos) {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    const accu = pos.coords.accuracy;

    userLocation = L.latLng(lat, long); // Save the user's location

    // Center the map on the user's current location
    map.setView(userLocation, 13);
    
    // Add user marker and circle
    userMarker = L.marker(userLocation).addTo(map);
    L.circle(userLocation, { radius: accu }).addTo(map);

    if (searchedLocation) {
        displayDistance(userLocation, searchedLocation);
    }
}
function displayDistance(loc1, loc2) {
    const distance = loc1.distanceTo(loc2); 
    document.getElementById('distance-info').textContent = `Distance to the location from your current location is: ${Math.round(distance / 1000)} km`;
    
    const transport = recommendTransport(distance);
    document.getElementById('transport-info').textContent = `Recommended mode of transport: ${transport}`;
    
    const time = calculateTravelTime(distance, transport);
    document.getElementById('time-info').textContent = `Estimated travel time from your location: ${time}`;
}

function recommendTransport(distance) {
    let transport;
    if (distance <= 1000) {
        transport = "Walking or Biking";
    } else if (distance <= 50000) {
        transport = "Car or Public Transit";
    } else if (distance <= 1000000) {
        transport = "Train";
    } else {
        transport = "Flight";
    }
    return transport;
}

function calculateTravelTime(distance, transport) {
    // Convert distance to kilometers
    const distanceKm = distance / 1000;
    
    // Average speeds in km/h
    const speeds = {
        "Walking or Biking": 5,      
        "Car or Public Transit": 50, // Average car/public transit speed
        "Train": 100,                // Average train speed
        "Flight": 800                // Average flight speed
    };
    
    const speed = speeds[transport] || 50; // Default to 50 km/h if transport not found
    const timeHours = distanceKm / speed;  // Time in hours
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60); // Convert remaining fraction to minutes
    
    return `${hours}h ${minutes}m`;
}


function error(err) {
    if (err.code === 1) {
        alert("Please allow geolocation access.");
    } else {
        alert("Cannot find current location.");
    }
}

// Automatically search a city if specified
if (typeof cityName !== 'undefined') {
    searchCity(cityName); // Replace 'cityName' with an actual value if required
}



let currentPage = 1;
const hotelsPerPage = 5;

function searchHotels(cityName) {
    // Clear previous results
    const hotelContainer = document.getElementById('hotel-list');
    hotelContainer.innerHTML = '';

    // Set up the API call
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            const response = JSON.parse(this.responseText);
            const hotelList = response.data.data;

            // Paginate results
            const startIndex = (currentPage - 1) * hotelsPerPage;
            const endIndex = startIndex + hotelsPerPage;
            const paginatedHotels = hotelList.slice(startIndex, endIndex);

            if (paginatedHotels.length === 0) {
                hotelContainer.innerHTML = '<p>No hotels found.</p>';
            } else {
                // Loop through the hotel list and create HTML for each hotel
                paginatedHotels.forEach(hotel => {
                    const hotelDiv = document.createElement('div');
                    hotelDiv.className = 'hotel';

                    const hotelImg = document.createElement('img');
                    hotelImg.src = hotel.heroImgUrl || 'https://via.placeholder.com/150';
                    hotelDiv.appendChild(hotelImg);

                    const hotelInfo = document.createElement('div');
                    hotelInfo.className = 'hotel-info';

                    const hotelName = document.createElement('h3');
                    hotelName.textContent = hotel.name;
                    hotelInfo.appendChild(hotelName);

                    const hotelRating = document.createElement('p');
                    hotelRating.className = 'hotel-rating';
                    hotelRating.textContent = `Rating: ${hotel.averageRating} (${hotel.userReviewCount} reviews)`;
                    hotelInfo.appendChild(hotelRating);

                    const hotelStatus = document.createElement('p');
                    hotelStatus.className = 'hotel-status';
                    hotelStatus.textContent = `Status: ${hotel.currentOpenStatusText}`;
                    hotelInfo.appendChild(hotelStatus);

                    hotelDiv.appendChild(hotelInfo);
                    hotelContainer.appendChild(hotelDiv);
                });

                // Update the page number for the next refresh
                currentPage++;
                if (endIndex >= hotelList.length) {
                    currentPage = 1; // Reset page number if we reach the end
                }
            }
        }
    });

    const locationIds = {
        'mumbai': '304554',
        'delhi': '304551',
        'bangalore': '297628',
        'goa': '1096363',
    };

    const locationId = locationIds[cityName.toLowerCase()];

    if (locationId) {
        xhr.open('GET', `https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=${locationId}`);
        xhr.setRequestHeader('x-rapidapi-key', '9a9dee9c97mshae5be1fb932b74ep1548eejsndb8d2b6f2697');
        xhr.setRequestHeader('x-rapidapi-host', 'tripadvisor16.p.rapidapi.com');

        xhr.send(null);
    } else {
        hotelContainer.innerHTML = `<p>Sorry, no data found for "${cityName}". Please try another city.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');

    if (cityName) {
        document.title = `Explore ${cityName}`;
        document.getElementById("head").textContent = cityName;
        document.getElementById("cityName").textContent = cityName;

        searchHotels(cityName);
    }
});

//weather

async function result(cityName) {
    const resultsDiv = document.getElementById('results');

    if (!cityName) {
        resultsDiv.innerHTML = '<p>Please enter a place.</p>';
        return;
    }

    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${encodeURIComponent(cityName)}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '879c4e3d8fmsh7d48e509036c3cfp1dda49jsn8fa59471ca0a',
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        // Clear previous results
        resultsDiv.innerHTML = '';

        if (result && result.current) {
            const temp = result.current.temp_c;
            const condition = result.current.condition.text.toLowerCase();
            const humidity = result.current.humidity;
            const wind = result.current.wind_kph;

            let riskMessage = '';
            console.log('Condition:', condition);

            // Check weather conditions for risks
            if (condition.includes('thunder') || condition.includes('storm') || condition.includes('snow')) {
                riskMessage = '<p><strong>Risk:</strong> Dangerous conditions due to storms or snow.</p>';
            } else if (temp > 35 || humidity > 70) {
                riskMessage = '<p><strong>Risk:</strong> High risk of heat exhaustion or heatstroke.</p>';
            } else if (humidity > 80 && wind > 30) {
                riskMessage = '<p><strong>Risk:</strong> Risk of slippery roads and poor visibility due to heavy rain and strong winds.</p>';
            } else if (condition.includes('fog') && humidity > 80 && wind < 10) {
                riskMessage = '<p><strong>Risk:</strong> Poor visibility due to fog. Exercise caution.</p>';
            } else if (condition.includes('dust')) {
                riskMessage = '<p><strong>Risk:</strong> Dust storms may cause breathing difficulties and low visibility.</p>';
            }

            resultsDiv.innerHTML = `
                <h2>Weather in ${result.location.name}</h2>
                <p><strong>Temperature:</strong> ${temp} °C</p>
                <p><strong>Condition:</strong> ${result.current.condition.text}</p>
                <p><strong>Humidity:</strong> ${humidity} %</p>
                <p><strong>Wind:</strong> ${wind} kph</p>
                ${riskMessage}
            `;
        } else {
            resultsDiv.innerHTML = '<p>No weather data found.</p>';
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
    }
}
