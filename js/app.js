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

  var locations = [{
      title: 'Atterbury Shooting Complex',
      location: {
        lat: 39.363141,
        lng: -86.022134
      },
      address: "4250 E. Edinburgh St. Edinburgh, IN 46124",
      phone: "812-562-6552",
      website: "http://atterburyshootingcomplex.com/",
      fees: true,
      rifle: true,
      handgun: true,
      shotgun: true,
    },
    {
      title: 'Brookville Lake',
      location: {
        lat: 39.588681,
        lng: -84.99634900000001
      },
      address: "3056 Quakertown Ramp Rd. Liberty, IN 47353",
      phone: "(765) 647-2657",
      website: "http://www.in.gov/dnr/parklake/2961.htm",
      fees: true,
      rifle: true,
      handgun: true,
      shotgun: true,
    },
    {
      title: 'Clark State Forest',
      location: {
        lat: 38.5748164,
        lng: -85.83171440000001
      },
      address: "Bowen Run, Scottsburg, IN 47170",
      phone: "(812) 294-4306",
      website: "http://www.in.gov/dnr/forestry/4827.htm",
      fees: true,
      rifle: true,
      handgun: true,
      shotgun: true,
    },
    {
      title: 'Crosley Fish & Wildlife Area',
      location: {
        lat: 38.9597008,
        lng: -85.5997931
      },
      address: "2010 S. State Highway 3 North Vernon, IN 47265",
      phone: "(812) 346-5596",
      website: "http://www.in.gov/dnr/fishwild/3097.htm",
      fees: false,
      rifle: true,
      handgun: true,
      shotgun: false,
    },
    {
      title: 'Deer Creek Fish & Wildlife Area',
      location: {
        lat: 39.5737858,
        lng: -86.88452370000005
      },
      address: "South County Road 200 West, Greencastle, IN",
      phone: "(765) 635-0453",
      website: "https://www.deercreekrange.org/",
      fees: true,
      rifle: true,
      handgun: true,
      shotgun: true,
    },
    {
      title: 'J. Edward Roush Lake',
      location: {
        lat: 40.83832049999999,
        lng: -85.46544699999998
      },
      address: "517 N. Warren Road Huntington, IN 46750",
      phone: "(260) 468-2165",
      website: "http://www.in.gov/dnr/fishwild/6358.htm",
      fees: true,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Jasper-Pulaski FWA',
      location: {
        lat: 41.1394599,
        lng: -86.91728810000001
      },
      address: "5822 N. Fish and Wildlife Lane Medaryville, IN 47957",
      phone: "(219) 843-4841",
      website: "http://www.in.gov/dnr/fishwild/3091.htm",
      fees: false,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Kingsbury FWA',
      location: {
        lat: 41.5193809,
        lng: -86.6202429
      },
      address: "5344 S. Hupp Road LaPorte, IN 46350",
      phone: "(219) 393-1128",
      website: "http://www.in.gov/dnr/fishwild/3089.htm",
      fees: true,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Pigeon River FWA',
      location: {
        lat: 41.682226,
        lng: -85.26775399999997
      },
      address: "8310 E. 300 N. Box 71 Mongo, IN 46771",
      phone: "(260) 367-2164",
      website: "http://www.in.gov/dnr/fishwild/3086.htm",
      fees: false,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Sugar Ridge FWA',
      location: {
        lat: 38.35413459999999,
        lng: -87.2324504
      },
      address: "2310 East SR 364  Winslow, IN 47598",
      phone: "(812) 789-2724",
      website: "http://www.in.gov/dnr/fishwild/3083.htm",
      fees: false,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Tri-County FWA',
      location: {
        lat: 41.3573625,
        lng: -85.68091849999996
      },
      address: "8432 N 850 E, Syracuse, IN 46567, United States",
      phone: "(574) 834-4461",
      website: "http://www.in.gov/dnr/fishwild/3082.htm",
      fees: false,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Wilbur Wright FWA',
      location: {
        lat: 39.9643841,
        lng: -85.3585402
      },
      address: "2239 N. State Road 103 New Castle, IN 47362",
      phone: "(765) 529-9581",
      website: "http://www.in.gov/dnr/fishwild/3081.htm",
      fees: false,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Willow Slough FWA',
      location: {
        lat: 40.977296,
        lng: -87.51707199999998
      },
      address: "1803 S. 700 W. Morocco, IN 47963",
      phone: "(219) 285-2060",
      website: "http://www.in.gov/dnr/fishwild/3080.htm",
      fees: true,
      rifle: true,
      handgun: true,
      shotgun: true
    },
    {
      title: 'Winamac FWA',
      location: {
        lat: 41.1274914,
        lng: -86.6316564
      },
      address: "1493 West 500 North Winamac, IN 46996",
      phone: "(574) 946-4422",
      website: "http://www.in.gov/dnr/fishwild/3079.htm",
      fees: false,
      rifle: true,
      handgun: true,
      shotgun: true
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
      mapTypeControl: false,
      id: i
    });

    markers.push(marker);

    bounds.extend(marker.position);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
  }

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

  drawingManager.addListener('overlaycomplete', function(event) {
    if (polygon) {
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
