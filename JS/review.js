document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('message').innerHTML = `
        Your review has been submitted.
        <br>
        <button type="button" class="btn btn-warning" id="home"><a href="/Travelsy/HTML/index.html">Home</a></button>
    `;
});
