$('.carousel').carousel({
    interval: 2000
})

document.querySelector('.arrow').addEventListener('click', function() {
    const inputValue = document.querySelector('.search input').value;
    
    if (inputValue) {
        window.location.href = `./explore.html?city=${encodeURIComponent(inputValue)}`;
    } else {
        alert("Please enter a city name.");
    }
});
