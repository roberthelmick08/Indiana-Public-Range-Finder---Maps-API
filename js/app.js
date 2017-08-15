var markers = [];
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.849312,
      lng: -104.673828
    },
    zoom: 12
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
      title: 'Denver',
      location: {
        lat: 39.849312,
        lng: -104.673828
      }
    },
    {
      title: 'Denver1',
      location: {
        lat: 39.849312,
        lng: -101.673828
      }
    },
    {
      title: 'Denver2',
      location: {
        lat: 39.849312,
        lng: -4.22
      }
    },
    {
      title: 'Denver3',
      location: {
        lat: 27,
        lng: -104.673828
      }
    },
    {
      title: 'Denver4',
      location: {
        lat: 24,
        lng: 100
      }
    }
  ];

  var largeInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

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
  }

  function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div>' + marker.position + '</div>');
      infoWindow.open(map, marker);
      infoWindow.addListener('closeclick', function() {
        infoWindow.setMarker(null);
      });
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
