/**
 * Created by george on 7/20/2016.
 */

var myMarkers = {
    "subway": [
        {
            "latitude": 44.4339458,
            "longitude": 26.0351768
        }, {
            "latitude": 44.4343593,
            "longitude": 26.054056
        }
    ],
    "malls": [
        {
            "latitude": 44.4311601,
            "longitude": 26.053476
        }, {
            "latitude": 44.4285137,
            "longitude": 26.0353663
        }
    ]
};

var markers = [];
var markerCluster;
function initialize() {
    var center = new google.maps.LatLng(44.4600, 25.9733);

    var map = new google.maps.Map(document.getElementById('g-maps'), {
        zoom: 11,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    initMarkers("subway");
    initMarkers("malls");

    var options = {
        imagePath: 'images/m'
    };

    markerCluster = new MarkerClusterer(map, markers, options);
}

function initMarkers(groupName) {
    var marker;
    var i = 0;
    for (var mark in myMarkers[groupName]) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(myMarkers[groupName][mark].latitude, myMarkers[groupName][mark].longitude)
        });
        google.maps.event.addListener(marker, 'click', function (e) {
            var url = "http://maps.google.com/maps?q=" + e.latLng.lat() + "," + e.latLng.lng() + "&ll=" + e.latLng.lat() + "," + e.latLng.lng() + "&z=17"
            window.open(url);
        });
        markers.push(marker);
    }
}


function rePaint(groupName) {
    markers = [];
    markerCluster.clearMarkers();
    initMarkers(groupName);
    markerCluster.addMarkers(markers);
    markerCluster.repaint();
}

function findNearest(groupName) {
    var pos;
    navigator.geolocation.getCurrentPosition(function (position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        rePaint(groupName);
        var closestPos = findCLosest(pos, groupName);
        markerCluster.getMap().setCenter(closestPos.marker.getPosition());
        markerCluster.getMap().setZoom(16);
    }, function () {
        console.log('error');
    });

}

function findCLosest(myPosition, groupName) {
    var closest;
    var pos = new google.maps.LatLng(myPosition.lat,
        myPosition.lng);
    $.each(markers, function () {
        var distance = google.maps.geometry.spherical
            .computeDistanceBetween(this.getPosition(), pos);
        if (!closest || closest.distance > distance) {
            closest = {
                marker: this,
                distance: distance
            }
        }
    });
    return closest;
}
//document.addEventListener("DOMContentLoaded", findNearest, false);

$('#options').on("change", function () {
    var val = $(this).find("option:selected").val();
    findNearest(val);
});


google.maps.event.addDomListener(window, 'load', initialize);