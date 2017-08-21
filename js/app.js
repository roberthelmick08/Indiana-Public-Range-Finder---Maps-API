var markers = [];
var map;
var polygon = null;

function initMap() {
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


// Initializes markers
  for (var i = 0; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      position: locations[i].location,
      animation: google.maps.Animation.DROP,
      title: locations[i].title,
      mapTypeControl: false,
      id: i
    });

    markers.push(marker);

    bounds.extend(marker.position);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
  }


//TODO: refactor to knockout
  $('#show-listings').on('click', showListings);
  $('#hide-listings').on('click', hideListings);
  $('#toggle-drawing').on('click', function() {
    toggleDrawing(drawingManager);
  });
  $('#filter-text-btn').on('click', function() {
    filter();
  });
  $('#filter-text').keypress(function(e) {
    if (e.which == 13) {
      filter();
    }
  });

  function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div>' + marker.position + '</div>');
      infoWindow.open(map, marker);
      infoWindow.addListener('closeclick', function() {
        infoWindow.setMarker(null);
      });
      
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;

      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
          infoWindow.setContent('</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama($('#pano'), panoramaOptions);
        } else {
          infoWindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>');
        }
      }
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    }
  }

  var infoWindow = new google.maps.InfoWindow({
    content: 'Info Window content lorem ipsum dolor set'
  });

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

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage();
}

function toggleDrawing(drawingManager) {
  if (drawingManager.map) {
    drawingManager.setMap(null);
  } else {
    drawingManager.setMap(map);
  }
}

function searchWithinPolygon() {

  //calculate square meters within the polygon
  var area = google.maps.geometry.spherical.computeArea(polygon.getPath());
  window.alert(area + "sq m");
  for (var i = 0; i < markers.length; i++) {
    if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
      markers[i].setMap(map);
    } else {
      markers[i].setMap(null);
    }
  }
}

function filter() {
  var geocoder = new google.maps.Geocoder();
  var input = document.getElementById('filter-text').value;
  var splitInput = input.split(" ");

  if (input == '') {
    window.alert('Please enter a city or keyword');
  } else {

    for(var i = 0; i < splitInput.length; i++){

    }
    displayMarkersWithKeywords();
    // searches map by address

    // geocoder.geocode({
    //     address: input,
    //     componentRestrictions: {
    //       locality: 'Indiana'
    //     }
    //   },
    //   function(results, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //       map.setCenter(results[0].geometry.location);
    //       map.setZoom(15);
    //     } else {
    //       window.alert("Couldn't find location, please try again.");
    //     }
    //   });
  }
}

var displayMarkersWithKeywords = function(keywords){
  for(var i = 0; i < locations.length; i++){
  for(var j = 0; i < keywords.length; j++){
    if(locations[i].indexOf(keywords[j]) !== -1){
      console.log("YOOOO");
    }
  }
}
};
