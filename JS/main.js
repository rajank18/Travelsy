$('.carousel').carousel({
    interval: 5000
})

document.querySelector('.arrow').addEventListener('click', function() {
    const inputValue = document.querySelector('.search input').value;
    
    if (inputValue) {
        window.location.href = `./explore.html?city=${encodeURIComponent(inputValue)}`;
    } else {
        alert("Please enter a city name.");
    }
});

(function ($) {

    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
})(jQuery);

$(document).ready(function(){
    $(".testimonial-carousel").owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive:{
            0:{
                items: 1
            },
            600:{
                items: 1
            },
            1000:{
                items: 1
            }
        }
    });
  });
  
