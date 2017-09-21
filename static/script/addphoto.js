var map;
      var marker;
      var infowindow;
      var messagewindow;

      function initMap() {
        //initialize map
        var annArbor = {lat: 42.271084, lng: -83.737277};
        map = new google.maps.Map(document.getElementById('map'), {
          center: annArbor,
          zoom: 14
        });

        infowindow = new google.maps.InfoWindow({
          content: document.getElementById('form')
        })

        messagewindow = new google.maps.InfoWindow({
          content: document.getElementById('message')
        });

        //markers is created in the spot where the map was clicked
        google.maps.event.addListener(map, 'click', function(event) {
          marker = new google.maps.Marker({
            position: event.latLng,
            map: map
          });
        //infowindow opens when a marker is clicked
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
          var getter = document.getElementById("form");
	        getter.setAttribute("style", "display:block");
          document.getElementById('lat').value=marker.getPosition().lat();
          document.getElementById('lng').value=marker.getPosition().lng();
          });
        });
      }
     
     //map shown in map2 webpage centers in the place where the markers was created 
    var button = document.getElementById("submit");
    
    button.addEventListener("click", function() {
    
    var text = marker.getPosition().lat() + "," + marker.getPosition().lng();
    
    if (typeof(Storage) !== "undefined") {
        // Store
        sessionStorage.setItem("geo", text);
        // Retrieve
        document.getElementById("result").innerHTML = sessionStorage.getItem("geo");
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
    });