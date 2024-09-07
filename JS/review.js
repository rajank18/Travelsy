document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('message').innerHTML = `
        Your review has been submitted
        <span>Go back to <a href="/Travelsy/HTML/index.html">Home Page</a></span>
    `;
});
