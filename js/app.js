// var markers = ko.observableArray([]);
var map;

// Initialize map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.768403,
      lng: -86.15806800000001
    },
    mapTypeControl: false,
    zoom: 7
  });

  ko.applyBindings(new ViewModel(locations, map));
}

var ViewModel = function(locations, map) {
  var self = this;
  self.menuVisible = ko.observable(true);
  self.locations = ko.observableArray([]);
  self.markers = ko.observableArray([]);

  var largeInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Initialize markers
  function initMarkers() {
    for (var i = 0; i < locations.length; i++) {
      self.marker = new google.maps.Marker({
        position: locations[i].location,
        animation: google.maps.Animation.DROP,
        title: locations[i].title,
        mapTypeControl: false,
        id: i
      });

      self.markers().push(self.marker);
      // Expands map bounds to fit all markers
      bounds.extend(self.marker.position);

      self.populateInfoWindow = function(marker, infoWindow) {
        if (infoWindow.marker != marker) {
          infoWindow.marker = marker;
          infoWindow.setContent('<div>' + marker.title + '</div>');
          infoWindow.open(map, marker);
          infoWindow.addListener('closeclick', function() {
            infoWindow.setMarker(null);
          });
        }
      };

      self.toggleSelectedMarker = function(marker){
        if (marker.getAnimation() !== null) {
         marker.setAnimation(null);
       } else {
         marker.setAnimation(google.maps.Animation.BOUNCE);
         setTimeout(function(){ marker.setAnimation(null); }, 750);
       }
      }

      self.marker.addListener('click', function() {
        self.toggleSelectedMarker(this);
        self.populateInfoWindow(this, largeInfoWindow);
      });
    }
  }

  initMarkers();

  self.showMarkers = function() {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < self.markers().length; i++) {
      self.markers()[i].setMap(map);
      bounds.extend(self.markers()[i].position);
    }
    map.fitBounds(bounds);
  };

  self.showMarkers();

  // Moves options menu offscreen
  self.toggleNavVisibility = function() {
    self.menuVisible(self.menuVisible() ? false : true);
  };

  locations.forEach(function(location) {
    self.locations().push(new Location(location));
  });

  self.search = ko.observable('');

  // Attribution: Ryan Niemeyer (http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
  self.filteredItems = ko.computed(function() {
    self.filter = ko.observable(self.search().toLowerCase());

    if (!self.filter()) {
      // Reset all markers if filter query is empty
      for (var x = 0; x < self.markers().length; x++) {
        self.markers()[x].setVisible(true);
      }
      return self.markers();
    } else {
        filteredArray = ko.utils.arrayFilter(self.markers(), function(item) {
        var string = item.title.toLowerCase();
        var result = (string.search(self.filter()) >= 0);
        return result;
      });

      // set all markers' visibility to false
      for (var i = 0; i < self.markers().length; i++) {
        self.markers()[i].setVisible(false);
      }

      self.tempMarkers = ko.observableArray(filteredArray);

      // set marker visibility to true for filtered values
      for (i = 0; i < self.tempMarkers().length; i++) {
        self.markers()[i].setVisible(true);
      }
      return self.tempMarkers();
    }
  }, ViewModel);

  self.highlightMarker = function(marker){
    console.log(marker);
    self.toggleSelectedMarker(marker);
    self.populateInfoWindow(marker, largeInfoWindow);
  };
};
