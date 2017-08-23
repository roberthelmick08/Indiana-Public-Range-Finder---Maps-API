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

      self.marker.addListener('click', function() {
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

  self.hideMarkers = function(filteredArray) {
    self.filteredArray = ko.observableArray(filteredArray);
    console.log("self.filteredArray():");
    console.log(self.filteredArray());
    console.log("self.markers():");
    console.log(self.markers());

    for (var j = 0; j < self.markers().length; j++) {
      for (var i = 0; i < self.filteredArray().length; i++) {
        if(self.markers()[j].title === self.filteredArray()[i].title){
          self.markers()[j].setMap(null);
        }
      }
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

  // Attribution: Ryan Niemeyer (http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
  self.filteredItems = ko.computed(function() {
    var filter = self.search().toLowerCase();
    if (!filter) {
      return self.locations();
    } else {
      var filteredArray = ko.utils.arrayFilter(self.markers(), function(item) {
        var string = item.title.toLowerCase();
        var result = (string.search(filter) >= 0);
        return result;
      });
      // self.hideMarkers(filteredArray);

      // set marker visibility to false
      for (var i = 0; i < self.markers().length; i++) {
        self.markers()[i].setVisible(false);
      }

      self.markers(filteredArray);

      // set marker visibility to true for filtered values
      for (i = 0; i < self.markers().length; i++) {
        if(self.markers()[i].visible){
          self.markers()[i].setVisible(false);
        } else{
          self.markers()[i].setVisible(true);
        }
      }
      return self.markers();
    }
  }, ViewModel);

};
