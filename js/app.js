var markers = [];
var map;
var polygon = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.7521299,
      lng: -104.9929679
    },
    zoom: 15
  });

  var styles = [{
      featureType: 'water',
      stylers: [{
        color: 'red'
      }]
    },
    {
      featureType: 'transit.station',
      stylers: [{
        weight: 12
      }]
    }
  ];

  var locations = [{
      title: 'Retro Room',
      location: {
        lat: 39.7533541,
        lng: -104.99183449999998
      }
    },
    {
      title: 'Ignite Burgers',
      location: {
        lat: 39.7541734,
        lng: -104.99062779999997
      }
    },
    {
      title: 'Great Divide Brewing Company',
      location: {
        lat: 39.7538085,
        lng: -104.98852779999999
      }
    },
    {
      title: 'Marquis Pizza',
      location: {
        lat: 39.753246,
        lng: -104.9924191
      }
    },
    {
      title: 'Falling Rock Tap House',
      location: {
        lat: 39.75392920000001,
        lng: -104.99546800000002
      }
    }
  ];

  var largeInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Initializes drawing manager
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON
      ]
    }
  });

  for (var i = 0; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      position: locations[i].location,
      animation: google.maps.Animation.DROP,
      title: locations[i].title,
      styles: styles,
      mapTypeControl: false,
      id: i
    });

    markers.push(marker);

    bounds.extend(marker.position);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });

    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
    document.getElementById('toggle-drawing').addEventListener('click', function(){
      toggleDrawing(drawingManager);
    });
    document.getElementById('zoom-to-area').addEventListener('click', function(){
      zoomToArea();
    });
  }

  drawingManager.addListener('overlaycomplete', function(event){
    if(polygon){
      polygon.setMap(null);
      hideListings(markers);
    }

    drawingManager.setDrawingMode(null);

    polygon = event.overlay;
    polygon.setEditable(true);
    searchWithinPolygon();

    polygon.getPath().addListener('set_at', searchWithinPolygon);
    polygon.getPath().addListener('insert_at', searchWithinPolygon);
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

      function getStreetView(data, status){
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
            var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
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

function makeMarkerIcon(markerColor){
  var markerImage = new google.maps.MarkerImage();
}

function toggleDrawing(drawingManager){
  if(drawingManager.map){
    drawingManager.setMap(null);
  } else{
    drawingManager.setMap(map);
  }
}

function searchWithinPolygon(){

  //calculate square meters within the polygon
  var area = google.maps.geometry.spherical.computeArea(polygon.getPath());
  window.alert(area+"sq m");
  for (var i = 0; i < markers.length; i++){
    if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)){
      markers[i].setMap(map);
    } else {
      markers[i].setMap(null);
    }
  }
}

function zoomToArea(){
  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('zoom-to-area-text').value;

  if (address == ''){
    window.alert('please enter an area/address');
  } else {
    geocoder.geocode(
      { address: address,
        componentRestrictions: {locality: 'Denver'}
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK){
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else{
        window.alert("Couldn't find location, please try again.");
      }
    });
  }
}
