var map;

// Initialize map. Attribution: Google Maps API
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

  // Sets options menu visibility based on window width
  if ($(window).width() < 720) {
    self.menuVisible = ko.observable(false);
    google.maps.event.trigger(map, 'resize');
  } else {
    self.menuVisible = ko.observable(true);
  }

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

      // to be displayed in infoWindow
      self.highlightedPlaceCheckins = ko.observable();
      self.highlightedPlaceUsers = ko.observable();

      // Attribution: Foursquare (https://developer.foursquare.com/docs/venues/venues)
      self.getFoursquareData = function(place) {
        var url = 'https://api.foursquare.com/v2/venues/search?' +
          'll=' + place.position.lat() + ', ' + place.position.lng() +
          '&query=' + place.title +
          '&client_id=HQJPL3TWZYPFNF22MMGKGOXQD4LDXAB4ZCDMEY24COWJUZ2W' +
          '&client_secret=UEIJHNVSUWXQEKFGWDCBMUMZRCV4S4SDKKYM2HR4LWRDXG1H' +
          '&v=20170823' +
          '&limit=1';

        self.apiSuccess = ko.observable(false);

        $.ajax(url, {
          success: function(val) {
            if (val.response.venues.length > 0) {
              self.apiSuccess(true);
              var venue = val.response.venues[0];
              self.highlightedPlaceCheckins(venue.stats.checkinsCount ? venue.stats.checkinsCount : '0');
              self.highlightedPlaceUsers(venue.hereNow.count ? venue.hereNow.count : '0');
              self.populateInfoWindow(place, largeInfoWindow);
            } else {
              self.apiSuccess(false);
              alert("No results found");
            }
          },
          error: function() {
            self.apiSuccess(false);
            alert("Foursquare API load failed");
          }
        });
      };

      self.populateInfoWindow = function(marker, infoWindow) {
        if (infoWindow.marker != marker) {
          infoWindow.marker = marker;
          infoWindow.setContent(
            '<div id="infoWindow"><strong>' +
            marker.title +
            '</strong><hr> Check-ins: ' +
            self.highlightedPlaceCheckins() +
            '<br> Users here now: ' +
            self.highlightedPlaceUsers() +
            '<hr> <div id="attribution-text">Powered by Foursquare</div>' +
            '</div>'
          );
          infoWindow.open(map, marker);
        }
      };


      // Sets animation when selected
      self.toggleSelectedMarker = function(marker) {
        // center map on highlighted marker
        map.panTo(marker.position);

        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 750);
        }
        self.getFoursquareData(marker);
      };

      self.marker.addListener('click', function() {
        self.toggleSelectedMarker(this);
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

  // Initialize locations
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
};
