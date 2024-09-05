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

var map = L.map('map').setView([51.505, -0.09], 13);
var userMarker = null;
var searchMarker = null;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var geocoder = L.Control.Geocoder.nominatim();
var userLocation = null;
var searchedLocation = null;

function searchCity(city) {
    geocoder.geocode(city, function(results) {
        if (results.length > 0) {
            searchedLocation = results[0].center;
            map.setView(searchedLocation, 13);
            clearMarkers(); // Clear existing markers
            searchMarker = L.marker(searchedLocation).addTo(map)
                .bindPopup(results[0].name)
                .openPopup();

            if (userLocation) {
                displayDistance(userLocation, searchedLocation);
            }
        } else {
            alert('City not found');
        }
    });
}

function displayDistance(loc1, loc2) {
    const distance = loc1.distanceTo(loc2); 
    document.getElementById('distance-info').textContent = `Distance to the location you searched is: ${Math.round(distance / 1000)} km`; 
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

document.getElementById('search-button').addEventListener('click', function() {
    var city = document.getElementById('city-input').value;
    searchCity(city);
});

navigator.geolocation.watchPosition(success, error);

let marker, circle, zoomed;
function success(pos) {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    const accu = pos.coords.accuracy;

    userLocation = L.latLng(lat, long); // Save the user's location
    
    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }
    map.setView(userLocation, 13);
    marker = L.marker(userLocation).addTo(map);
    circle = L.circle(userLocation, { radius: accu }).addTo(map);

    if (!zoomed) {
        zoomed = map.fitBounds(circle.getBounds());
    }

    if (!searchedLocation) {
        userMarker = marker;
    }

    if (searchedLocation) {
        displayDistance(userLocation, searchedLocation);
    }
}

function error(err) {
    if (err.code === 1) {
        alert("Please allow geolocation access.");
    } else {
        alert("Cannot find current location.");
    }
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
