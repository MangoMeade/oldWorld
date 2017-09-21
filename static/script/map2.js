//get text from the search box of this webpage and the main home page
        var searchRedirect = document.getElementById("result");
        searchRedirect.innerHTML = sessionStorage.getItem("geo");
        var markers = [];
        
        
      function initMap() {
        //initialize map
        var map = new google.maps.Map(document.getElementById('map'), {
          center: new google.maps.LatLng(42.271084, -83.737277),
          zoom: 16
        });
        var geocoder = new google.maps.Geocoder();
        //go to viewport specified in the search box. else go to default google maps location 
        if (searchRedirect.innerHTML == "") {
          var nothing = "";
        }
        else {
          geocodeAddress(geocoder, map);
        }
        
        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    //this part runs when the mapobject is created and rendered
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        //this part runs when the mapobject shown for the first time
        loadMarker(map)
            });
        });
        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    //this part runs when the mapobject is created and rendered
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        //this part runs when the mapobject shown for the first time
        showVisibleMarkers(map)
            });
        });
        //load markers in current viewport
        google.maps.event.addListener(map, "idle", function() {loadMarker(map)});
        //show markers in current viewport
        google.maps.event.addListener(map, "idle", function() {showVisibleMarkers(map)});
        //clear markers everytime the viewport bounds changes
        google.maps.event.addListener(map, "bounds_changed", function() {clearMarkers(map)});
        //geocode address of search box
        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress2(geocoder, map);
          console.log("click");
        });
      }
      
      function geocodeAddress(geocoder, resultsMap) {
        geocoder.geocode({'address': searchRedirect.innerHTML}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
      
      function geocodeAddress2(geocoder, resultsMap) {
        var address = document.getElementById("address").value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
      
      function loadMarker(map) {
                var customIcon = {
          //specifies the color of the markers of photos taken in a given decade         
          "Before 1900": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#448D7A',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1901-1910": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#D8A027',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1911-1920": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#E74C3C',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1921-1930": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#2980B9',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1931-1940": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#2C3E50',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1941-1950": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#8E44AD',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1951-1960": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#34459E',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1961-1970": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#330033',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1971-1980": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#000033',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1981-1990": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#990000',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "1991-2000": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#003300',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "2001-2010": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#ff99cc',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
          "2011-2020": {
            style: {
        path: "M-5,0a5,5 0 0.25,0 10,0a5,5 0 0.25,0 -10,0",
        fillColor: '#ffff00',
        fillOpacity: .6,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
            } 
          },
        };
        
        //callback database of markers within the current viewport
        var bounds = map.getBounds();
        var NE = bounds.getNorthEast();
        var SW = bounds.getSouthWest();
        
        var neLat = NE.lat()
        var neLng = NE.lng()
        var swLat = SW.lat()
        var swLng = SW.lng()
        
        downloadUrl('/data?neLat=' + neLat + "&neLng=" + neLng + "&swLat=" + swLat + "&swLng=" + swLng, function(results) {
          console.log(results);
          var resultsJSON = JSON.parse(results.responseText).data;
          console.log(resultsJSON);
          for (var i = 0; i < resultsJSON.length; i++) {
          var lat = resultsJSON[i].lat;
          var lng = resultsJSON[i].lng;
          var latLng = new google.maps.LatLng(lat, lng);
          var title = resultsJSON[i].title;
          var description = resultsJSON[i].description;
          var year = resultsJSON[i].year;
          
          var infowincontent = document.createElement('div');
          var img = document.createElement("img");
          img.setAttribute("src", resultsJSON[i].file);
          img.setAttribute("width", "450px");
          img.setAttribute("height", "auto");
          img.setAttribute("max-height", "400px");
          infowincontent.appendChild(img);
          
          var strong = document.createElement('text');
          strong.setAttribute("id", "text-title");
          strong.textContent = title;
          infowincontent.appendChild(strong);
          infowincontent.appendChild(document.createElement('br'));
          var text = document.createElement('text');
          text.textContent = year;
          infowincontent.appendChild(text);
          infowincontent.appendChild(document.createElement('br'));
          var text2 = document.createElement('text');
          text2.textContent = description;
          infowincontent.appendChild(text2);
          var icon = customIcon[year] || {};
          var marker = new google.maps.Marker({
            position: latLng,
            category:year,
            icon: icon.style,
            scale: 2
          });
          markers.push(marker);
          attachInfoWindow(marker, infowincontent);
          filterMarkers(year, marker);
        }
        });
      }
        function showVisibleMarkers (map) {
          var zoom = map.getZoom();
          for (var i = 0; i < markers.length; i++) {
            if (zoom >= 14 ) {
              console.log("It worked");
            markers[i].setMap(map);
            }
            else if  (zoom < 14) {
              markers[i].setMap(null);
            }
          }
        }
        function clearMarkers(map) {
        for (var i = 0; i < markers.length; i++) {
            if (!map.getBounds().contains(markers[i].getPosition())) {
            markers[i].setMap(null);
          } 
          }
        
      }
        
        //overlay opens when a markers its clicked
        function attachInfoWindow(marker, infoWinContent) {
        marker.addListener('click', function() {
          var getter = document.getElementById("overlay");
          getter.setAttribute("style", "opacity: 1; width:500px; height:200px");
          var getImg = document.getElementById("image");
          getImg.appendChild(infoWinContent);
          getImg.setAttribute("style", "opacity: 1");
          var getIt = document.getElementById("modal-background"); 
          getIt.setAttribute("style", "opacity: 0.8; width:100%; height:100%");
          var getText = document.getElementById("text-title"); 
          getText.setAttribute("style", "text-align: center; font-size: 20px;font-weight: bold; color: #FCFCFC;");
        });
      }  

      function doNothing() {}
      
      //overlay closes when a markers its clicked
      var closeBtn = document.getElementById("close");
      closeBtn.addEventListener('click', function() {
      var getImg = document.getElementById("image");
	    getImg.setAttribute("style", "opacity: 0; width:0%; height:0%; display:none");
	    getImg.innerHTML="";
	    var getter = document.getElementById("overlay");
	    getter.setAttribute("style", "opacity: 0; width:0%; height:0%; display:none");  
	    var getIt = document.getElementById("modal-background"); 
          getIt.setAttribute("style", "opacity: 0.0; width:0%; height:0%");
      });
      
      //overlay closes when a markers its clicked
      var modalBackground = document.getElementById("modal-background"); 
      modalBackground.addEventListener('click', function() {
        var getImg = document.getElementById("image");
	    getImg.setAttribute("style", "opacity: 0; width:0%; height:0%; display:none");
	    getImg.innerHTML="";
	    var getter = document.getElementById("overlay");
	    getter.setAttribute("style", "opacity: 0; width:0%; height:0%; display:none");  
	    var getIt = document.getElementById("modal-background"); 
          getIt.setAttribute("style", "opacity: 0.0; width:0%; height:0%");
      });
      
      //filter markers selected
      function filterMarkers (year, marker) {
        var selectYear = document.getElementById("selectyear"); 
          selectYear.addEventListener('change', function() {
        var selectedYearIndex = selectYear.selectedIndex;
        var selectedYear = selectYear.options[selectedYearIndex].value;
            
            
          // If is same category or category not picked
            if (year == selectedYear || selectedYear.length=== 0) {
                marker.setVisible(true);
            }
            // Categories don't match 
            else {
                marker.setVisible(false);
            }
          });
        }
        
        //callback function
        function downloadUrl(url, callback) {
        var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function() {
          if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
          }
        };

        request.open('GET', url, true);
        request.send(null);
      }
    