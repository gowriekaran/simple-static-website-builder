document.addEventListener('DOMContentLoaded', function () {
    Typed.new('#landingPageHeaderBottomText', {
        strings: ["Italy", "France · Spain · Portugal"],
        typeSpeed: 25,
        backSpeed: 20,
        startDelay: 500
    });
});

function initMap() {
    var geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('europeMap'), {
        center: { lat: 0, lng: 0 },
        zoom: 4
    });

    geocoder.geocode({ 'address': "Europe" }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}