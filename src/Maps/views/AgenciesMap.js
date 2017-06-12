/**
 * Created by george on 7/21/2016.
 */
var DEFAULT_MAP_ZOOM = 11;
var FOCUS_MAP_ZOOM = 16;

var AgenciesMap = Backbone.View.extend({
    el: "body",
    events: {
        'change #options': "findAgencies"
    },
    myLocationModel: null,
    markersModel: null,
    centerMap: null,
    googleMap: null,
    markerCluster: null,
    markers: [],
    markersFromDb: [],
    markersGroups: [],
    initialize: function (centerLatitude, centerLongitude, markersFromDb) {
        if (typeof centerLatitude === "undefined" || typeof centerLongitude === "undefined") {
            console.log("The center is not defined.");
            return;
        }
        this.markersFromDb = markersFromDb;
        this.centerMap = new google.maps.LatLng(centerLatitude, centerLongitude);
        this.myLocationModel = new MyLocation();
        this.initMap();
    },
    /**
     * Initialize the google map
     */
    initMap: function () {
        var _this = this;
        this.googleMap = new google.maps.Map(document.getElementById("agencies-map"), {
            zoom: DEFAULT_MAP_ZOOM,
            center: _this.centerMap,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.initMapMarkers();
        this.markerCluster = new MarkerClusterer(this.googleMap, this.markers);
    },
    /**
     * Initialize the markers
     */
    initMapMarkers: function () {
        this.markers = [];
        var _this = this;
        $.each(this.markersFromDb, function (groupName, markers) {
            _this.markersGroups.push(groupName);
            _this.initMarkersGroup(groupName);
        });
    },
    /**
     * Initialize the markers from given groupName
     * @param groupName
     */
    initMarkersGroup: function (groupName) {
        var marker;
        var i = 0;
        for (var mark in this.markersFromDb[groupName]) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.markersFromDb[groupName][mark].latitude, this.markersFromDb[groupName][mark].longitude)
            });
            google.maps.event.addListener(marker, 'click', function (e) {
                var url = "http://maps.google.com/maps?q=" + e.latLng.lat() + "," + e.latLng.lng() + "&ll=" + e.latLng.lat() + "," + e.latLng.lng() + "&z=17"
                window.open(url);
            });
            this.markers.push(marker);
        }
    },
    /**
     * After the agency is selected, find nearest agenciest
     * @param e
     */
    findAgencies: function (e) {
        var val = $(e.target).find("option:selected").val();
        this.showNearestAgencies(val);
    },
    /**
     * Show nearest agencies by current location
     * @param groupName
     */
    showNearestAgencies: function (groupName) {
        var _this = this;
        this.myLocationModel.getMyLocation(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            _this.repaintMap(groupName, pos);
        }, function () {
            this.myLocationErrorCallback();
        });
    },
    /**
     * Repaint the google map with markers
     * @param groupName
     * @param myPosition
     */
    repaintMap: function (groupName, myPosition) {
        this.markers = [];
        this.markerCluster.clearMarkers();
        var zoom = DEFAULT_MAP_ZOOM;
        if (typeof groupName === "undefined" || groupName === "") {
            this.initMapMarkers();
        } else {
            this.initMarkersGroup(groupName);
            zoom = FOCUS_MAP_ZOOM;
        }
        this.markerCluster.addMarkers(this.markers);
        this.markerCluster.repaint();
        var closestAgency = this.findClosestAgency(myPosition);
        this.googleMap.setCenter(closestAgency.marker.getPosition());
        this.googleMap.setZoom(zoom);
    },
    myLocationErrorCallback: function () {

    },
    /**
     * Find the closest agency by current position
     * @param myPosition
     * @returns {*}
     */
    findClosestAgency: function (myPosition) {
        var closest;
        var pos = new google.maps.LatLng(myPosition.lat,
            myPosition.lng);
        $.each(this.markers, function () {
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
});