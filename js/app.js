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
      console.log(self.marker);
      self.markers().push(self.marker);
      // Expands map bounds to fit all markers
      bounds.extend(self.marker.position);

      self.marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow);
      });
    }
    console.log("array");
    console.log(self.markers());
  }

  initMarkers();

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

  self.showListings = function() {
    var bounds = new google.maps.LatLngBounds();

    // for (var marker in self.markers()) {
    //   self.markers[i].setMap(map);
    //   bounds.extend(self.markers[i].position);
    // }
    for (var i = 0; i < self.markers().length; i++) {
      self.markers()[i].setMap(map);
      bounds.extend(self.markers()[i].position);
    }
    map.fitBounds(bounds);
  };

  self.showListings();

  self.hideListings = function() {
    for (var i = 0; i < self.markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  self.toggleNavVisibility = function() {
    console.log(self.menuVisible());
    self.menuVisible(self.menuVisible() ? false : true);
    console.log(self.menuVisible());
  };

  locations.forEach(function(location) {
    self.locations().push(new Location(location));
  });

  self.search = ko.observable('');

  var stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
      return false;
    return string.substring(0, startsWith.length) === startsWith;
  };

  self.filteredItems = ko.computed(function() {
    var filter = self.search().toLowerCase();
    if (!filter) {
      return self.locations();
    } else {
      return ko.utils.arrayFilter(self.locations(), function(item) {
        var string = item.title().toLowerCase();
        var result = (string.search(filter) >= 0);
        return result;
      });
    }
  }, ViewModel);
};

ViewModel.prototype.showMarker = function(map) {
  marker.setMap(map);
};

ViewModel.prototype.hideMarker = function() {
  marker.setMap(null);
};
