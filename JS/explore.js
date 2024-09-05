function searchCity() {
    let cityName = document.getElementById("citySearch").value.trim();
    
    if (cityName) {
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        window.location.href = `city.html?city=${cityName}`;
    } else {
        alert("Please enter a city name.");
    }
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search); 
    const cityName = urlParams.get('city');  
    
    if (cityName) { 
        document.title = `Explore ${cityName}`;  
            document.getElementById("head").textContent = cityName;
        document.getElementById("cityName").textContent = cityName;  
        
        fetchCityData(cityName);  
    }
}

function fetchCityData(cityName) {
    const wikipediaAPI = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`; 
    
    fetch(wikipediaAPI) 
        .then(response => response.json()) 
        .then(data => {
            if (data.type === "standard") {  
                document.getElementById("cityInfo").innerHTML = `
                    <img src="${data.thumbnail ? data.thumbnail.source : ''}" alt="${cityName}" style="width:300px; height:auto;">
                    <p>${data.extract}</p>
                    <a href="${data.content_urls.desktop.page}" target="_blank">Read more on Wikipedia</a> 
                `;
            } else {  
                document.getElementById("cityInfo").textContent = "City information not available."; 
            }
        })
        .catch(error => console.error("Error fetching city data:", error));  
}

async function fetchPhotos() {
    const placeName = document.getElementById('placeInput').value;
    const url = `https://api.unsplash.com/search/photos?query=${placeName}&per_page=5&client_id=tt3HHYA2pmd5M9OnGSSTe0_litOTp2JRxyhMpUiWodc`;

    const response = await fetch(url);
    const data = await response.json();

    const imagesContainer = document.getElementById('imagesContainer');
    imagesContainer.innerHTML = ''; 

    data.results.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.urls.small;
        img.alt = photo.alt_description;
        imagesContainer.appendChild(img);
    });
}