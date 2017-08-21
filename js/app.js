var markers = [];

// Initialize map
function initMap() {
  var map;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.768403,
      lng: -86.15806800000001
    },
    mapTypeControl: false,
    zoom: 7
  });

  var largeInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Initialize markers
  for (var i = 0; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      position: locations[i].location,
      animation: google.maps.Animation.DROP,
      title: locations[i].title,
      mapTypeControl: false,
      id: i
    });

    markers.push(marker);

    // Expands map bounds to fit all markers
    bounds.extend(marker.position);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
  }

  showListings();

  function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div>' + marker.title + '</div>');
      infoWindow.open(map, marker);
      infoWindow.addListener('closeclick', function() {
        infoWindow.setMarker(null);
      });
    }

  }
  ko.applyBindings(new ViewModel(locations, map));

  function showListings() {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
}

var ViewModel = function(locations, map) {
  var self = this;
  self.menuVisible = ko.observable(true);
  self.locations = ko.observableArray();

  self.toggleNavVisibility = function() {
    console.log(self.menuVisible());
    self.menuVisible(self.menuVisible() ? false : true);
    console.log(self.menuVisible());
  };

  locations.forEach(function(location) {
    self.locations().push(new Location(location));
  });

  self.visibleLocations = ko.observableArray(self.locations());

  console.log(self.visibleLocations());

  self.filteredItems = ko.computed(function() {
    console.log(this);
    var filter = this.filter().toLowerCase();
    if (!filter) {
      return this.locations();
    } else {
        return ko.utils.arrayFilter(this.locations(), function(item) {
            return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
        });
    }
}, this);

  // self.filterListings = ko.computed({
  //   read: function() {
  //     return "";
  //   },
  //   write: function(input) {
  //     // Empty visibleLocations array
  //     self.visibleLocations([]);
  //
  //     self.locations().forEach(function(location) {
  //       location.marker.setVisible(false);
  //
  //       if (location.name().toLowerCase().includes(input.toLowerCase())) {
  //         self.visibleLocations.push(location);
  //         marker.setVisible(true);
  //       }
  //     });
  //   }
  // });
};
