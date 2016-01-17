define([], function() {
    'use strict';

    function MapController(el) {
        this.domNode = document.querySelector(el);
        this.title = this.domNode.querySelector('.section_title');
        this.content = this.domNode.querySelector('.section_content');

        this.initialize();
    }

    MapController.prototype.initialize = function() {
        this.title.addEventListener("click", handleMapSection.bind(this), false);
        this.addMap();
        setInterval(this.updateCurrentPosition.bind(this), 2000);
        // google.maps.event.addDomListener(window, 'load', function() {
    };

    MapController.prototype.addMap = function() {
        // Initialize the map
        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(42.35, -71.12),
            streetViewControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP]
            }
        };
        this.map = new google.maps.Map(this.content, mapOptions);
        this.marker = new google.maps.Marker({
            position: mapOptions.center,
            map: this.map
        });
    };

    MapController.prototype.updateCurrentPosition = function() {
        var self = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                self.map.setCenter(pos);
                self.marker.setPosition(pos);
            });
        }
    };

    function handleMapSection(e) {
        /*jshint validthis:true */
        this.title.classList.toggle('collapsed');
        this.content.classList.toggle('hide');
    }

    return MapController;
});
