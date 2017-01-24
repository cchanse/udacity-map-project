/* I found this codepen that MCS shared on the Udacity discussion forum (https://discussions.udacity.com/t/linking-the-ko-filter-to-the-markers-le-sigh/35771/2) to be very helpful: http://codepen.io/prather-mcs/pen/KpjbNN?editors=0010#0
*/

// Create global variables
var infowindow, map;

// array of EBAC sites
var locations = [
    {name: "Administrative Office", address:"303 Van Buren Ave", city: "Oakland", zipcode: "94610", phone:"510-268-3770", latLng: {lat: 37.810924, lng: -122.256157}, services: "Administrative" },

    {name: "Bancroft Counseling Enriched Program", address:"1150 Bancroft Ave.", city: "San Leandro", zipcode: "94577", phone: "510-504-0115", latLng: {lat: 37.727952, lng:  -122.147723}, services: "After-school"},

    {name: "Fremont Healthy Start", zipcode: '', latLng: {lat: 37.807709, lng: -122.266436}, lat: 37.807709, lng: -122.266436, services: "Counseling", city: "Oakland"},

    {name: "SBBH Services at Glassbrook Elementary", address: "975 Shafer Road", zipcode: 94544, latLng: {lat: 37.641056, lng: -122.079810}, services: "South Region School Based Behavioral Health Services, Counseling", city: "Hayward"},

    {name: "SBBH Services at Hesperian Elementary", address: "620 Drew Street", zipcode: 94580, latLng: {lat: 37.693460, lng: -122.125025}, services: "South Region School Based Behavioral Health Services",city: "San Lorenzo"},

    {name: "SBBH Services at Hillside Elementary", address: "15980 Marcella Street", zipcode: 94578, latLng: {lat: 37.701747, lng: -122.116367}, services: "South Region School Based Behavioral Health Services, After-school",city: "San Leandro"},

    {name: "SBBH Services at Bowman School", address: "520 Jefferson Street", zipcode: 94544, latLng: {lat: 37.641738, lng: -122.062723}, services: "After-school",city: "Hayward"},

    {name: "SBBH Services at Burbank School", address: "353 B Street", zipcode: 94541, latLng: {lat: 37.668048, lng: -122.094318}, services: "After-school",city: "Hayward"},

    {name: "SBBH Services at Cherryland School", address: "585 Willow Ave", zipcode: 94541, latLng: {lat: 37.675611, lng: -122.098558}, services: "After-school",city: "Hayward"},

    {name: "SBBH Services at Tyrrell School", address: "27000 Tyrrell Ave", zipcode: 94544, latLng: {lat: 37.638178, lng: -122.075084}, services: "After-school",city: "Hayward"},

    {name: "SBBH Services at Martin Luther King, Jr. Middle School", address: "26890 Holly Hill Ave", zipcode: 94545, latLng: {lat: 37.635879, lng: -122.091281}, services: "After-school",city: "Hayward"},

    {name: "SBBH Services at Fremont Durham Elementary", address: "40292 Leslie St.", zipcode: 94545, latLng: {lat: 37.542378, lng: -121.966316}, services: "After-school",city: "Fremont"},

    {name: "Alameda", zipcode: '', latLng: {lat: 37.708221, lng: -122.206422}, lat: 37.208221, lng: -122.406422, services: "Counseling",city: "Alameda"},

    {name: "Other", zipcode: '', latLng: {lat: 37.708221, lng: -122.206422}, lat: 37.108221, lng: -122.606422, services: "Counseling",city: "San Leandro"}
];

// customize the styles for the Google map
var styles = [
    {
      elementType: 'geometry',
      stylers: [{color: '#f5f5f5'}]
    },
    {
      elementType: 'labels.icon',
      stylers: [{visibility: 'off'}]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{color: '#616161'}]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{color: '#f5f5f5'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{color: '#bdbdbd'}]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{color: '#eeeeee'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#757575'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#e5e5e5'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9e9e9e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#ffffff'}]
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [{color: '#757575'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#dadada'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#616161'}]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9e9e9e'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{color: '#e5e5e5'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{color: '#eeeeee'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#c9c9c9'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9e9e9e'}]
    }
];

// once google maps api loads, run this initMap function
var initMap = function() {

    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.808221, lng: -122.306422},
        zoom: 11,
        mapTypeControl: false
    });

    // set styles for the map
    map.setOptions({styles: styles});

    ko.applyBindings(new ViewModel());
}

// Error handling
function googleError() {
    alert('<p>Unfortunately, the map can not be loaded at this time.</p>');
}

// constructor function that creates a prototype, Location. Objects of this type will be created for each location as the array of locations change according to search parameters.  Each object of this type will have the following initialized properties (name, latLng, services, address, city, zipcode, and marker
function Location(obj) {
    this.name = obj.name;
    this.latLng = obj.latLng;
    this.services = obj.services;
    this.address = obj.address;
    this.city = obj.city;
    this.zipcode = obj.zipcode;
    this.marker = null;
}

// view model for the app
var ViewModel = function() {

    'use strict';

    var self = this;

    // create array that will store all the locations
    self.allLocations = [];

    // when first loading the page, iterate through locations array and push instance of Location into allLocations array
    locations.forEach(function(location) {
        self.allLocations.push(new Location(location));
    });

    // build markers for each location in the allLocations array
    self.allLocations.forEach(function(location) {

        var markerOptions = {
            map: map,
            position: location.latLng,
            animation: google.maps.Animation.DROP
        };

        location.marker = new google.maps.Marker(markerOptions);

        // content loaded into infowindow when marker clicked
        google.maps.event.addListener(location.marker, 'click', function() {

            map.panTo(location.marker.getPosition());
            if (location.services === undefined) {
                location.services = 'No services currently listed';
            } else if (location.address === undefined) {
                location.address = 'No address currently listed';
            } else if (location.zipcode === undefined) {
                location.zipcode = 'No zipcode currently listed';
            } else {

            }

            location.content = '<h2>' + location.name + '</h2><p>' + location.address + '<br>' + location.city + ', CA ' + location.zipcode + '</p><p>' + location.services + '</p><h3 class="article-heading">Latest NYTimes article referencing ' + location.city + '</h3><p class="nytimes-article"></p>';
            location.marker.setAnimation(google.maps.Animation.BOUNCE);

            setTimeout(function() { // stop bouncing of marker
                location.marker.setAnimation(null)
            }, 2100);

            queryNYTimes(location);

        });

        // when user clicks on map outside of marker, close infowindow
        google.maps.event.addListener(map, 'click', function(){
            infowindow.close();
        });
    });

    // create an array for visible markers
    self.visibleLocations = ko.observableArray();

    // set visibility for all markers
    self.allLocations.forEach(function(location) {
        self.visibleLocations.push(location);
    });

    self.filterText = ko.observable('');


    // when input changes, run this function
    self.filter = ko.computed(function() {

        var searchInput = self.filterText().toLowerCase();

        self.visibleLocations.removeAll();

        self.allLocations.forEach(function(location) {

            // only want to show markers that meet the criteria
            location.marker.setVisible(false);

            if ( (location.name.toLowerCase().indexOf(searchInput) !== -1) || (location.services.toLowerCase().indexOf(searchInput) !== -1) || (location.city.toLowerCase().indexOf(searchInput) !== -1)) {
                self.visibleLocations.push(location); // we store locations that meet critiera into an array that we then iterate through to set visibility to true
            }

        });

        self.visibleLocations().forEach(function(location) {
            location.marker.setVisible(true);
        });
        /* Filter implementation goes in here */
    }, this) ;


    // when location is clicked on filterlist, run this function to open up corresponding marker
    self.markerInfo = function(location) {
        google.maps.event.trigger(location.marker, 'click');
    }



};

// define function for NYTimes API requests. Pass the city of the selected marker as a query parameter so only articles that reference that city will be retrieved
function queryNYTimes(location) {
    var $nytHeader = $('.article-heading');
    var $nytArticle = $('.nytimes-article');
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + location.city + '&sort=newest&api-key=42319605f44f49bba54758d38711077f';
    $.ajax({
        url: nytimesUrl,
        dataType: "json"})
        .done(function(result) {
            articles = result.response.docs;
            var article = articles[0];
                location.content += '<h4>' + article.headline.main + '</h4><p>' + article.snippet + '</p>';
                infowindow.setContent(location.content);
                infowindow.open(map, location.marker);

        })
        .fail(function(error) {
            alert("Unable to load NYTimes API at this time");
        });
}
