/**
 * Ein Skript für die findRoutes Datei, das die Leaflet Karte startet und
 * es ermöglicht die nächsten Haltestellen für eine userdefinierte Position
 * einzusehen. Von diesen Haltestellen kann der User dann seine Route und die Zeit
 * wählen.
 */
var hereKey = "OhdfY06Bw18h1Cwi7hsQNdhb7f8rJ2zvt9y-W3WiIrc"; //Den Here api key hier einfügen
var currentPosition, stops, currentLine;//Variablen für die Userposition und die nahen Stops

//Limitation of the input date to the current date
var today = new Date();
console.log(today.toJSON());
today = today.toJSON().slice(0,10);
$("#inputDate").attr("max", today);


/**
 * Die Leaflet Karte wird initialisiert und mit einer Leaflet tile-Karte versehen.
 */
var map = L.map('mapContainer').setView([51.9623600, 7.6257100], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 18,
attribution: 'Leaflet, OpenStreetMapContributors',
}).addTo(map);


// Zwei Layergruppen für die Positions- und Haltestellen
var markerGroup = L.featureGroup().addTo(map);
var stopmarkers = L.featureGroup();


/**
 * Ein eventlistener, der bei Doppelklick auf die Karte einen Positionsmarker
 * auf die Mausposition setzt. Danach werden die Haltestellen in der Umgebung
 * gesucht.
 *
 * @param  {event} 'dblclick' Das Doppelklick-Event
 * @param  {function} function(e) Funktion die Marker setzt und showStops() aufruft
 */
map.on('dblclick', function(e){
  markerGroup.clearLayers();//Vorherige Position löschen, damit die Karte übersichtlich bleibt
  var mousePosition = e.latlng;
  currentPosition = L.marker(mousePosition).addTo(markerGroup).addTo(map);
  map.flyTo(mousePosition);
  showStops();
});


/**
 * getLocation - Funktion, die überprüft, ob der Browser des Users die HTML
 * geolocation api unterstützt. Falls ja, wird die Funktion showPosition()
 * aufgerufen. Kopiert von https://www.w3schools.com/html/html5_geolocation.asp
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");// Vielleicht als alert?
  }
}


/**
 * showPosition - Eine Funktion, die die Position der HTML geolocation api
 * verwendet, um einen leaflet marker zu erstellen. Dann wird noch showStops
 * aufgerufen.
 *
 * @param  {type} position description
 * @return {type}          description
 */
function showPosition(position) {
  markerGroup.clearLayers();//Vorherige Position löschen, damit die Karte übersichtlich bleibt
  map.flyTo([position.coords.latitude, position.coords.longitude], 15);
  currentPosition = L.marker([position.coords.latitude, position.coords.longitude]).addTo(markerGroup).addTo(map);
  currentPosition.bindPopup("Your Position.");
  showStops();
}


/**
 * showStops - Die Funktion sendet eine ajax-Request an die here api und setzt
 * die zurückgebenen Haltestellen als marker auf der Karte um.
 *
 */
function showStops(){
  var pos      = currentPosition.getLatLng();
  var hereUrl  = 'https://transit.hereapi.com/v8/stations?apiKey=' + hereKey + '&in=' + pos.lat + ',' + pos.lng + '&return=transport';
  console.log(hereUrl);
  var stopData = $.ajax({ //Anfrage für alle nahen Stops (500m) von der here api
          url:        hereUrl,
          dataType:   "json",
          success:    console.log("Stop data successfully loaded."),
          error:      function (xhr) {
              console.log(xhr.statusText);
            }
        });
  $.when(stopData).done(function(){
    stopmarkers.clearLayers();//Vorherige Haltestellen löschen, damit die Karte übersichtlich bleibt
    stops = stopData.responseJSON.stations;
    console.log(stops);

    for(var i = 0; i<stops.length; i++){
      var curStop = L.marker(stops[i].place.location, {icon: busIcon}).addTo(stopmarkers);
      //Mit Haltestellen icon, damit Unterscheidung gegeben ist
      var stopLines = "";

      for(var j = 0; j < stops[i].transports.length; j++){
        var lineName = stops[i].transports[j].name + " " + stops[i].transports[j].headsign;
        var k = (1+i);
        console.log(k);
        var lineButton = "<button id=" + k + j + " onClick='chooseLine(" + k + j + ")'>" + lineName + "</button><br>";
        stopLines += lineButton;
      }

      curStop.bindPopup("<h3>" + stops[i].place.name + "</h3>" + stopLines);
    }
    stopmarkers.addTo(map);
  });
}

function chooseLine(line) {
    $("#selection").html("Ihre Route: " + $("#"+line).html());
    currentLine = $("#"+line).html();
    console.log(line, $("#"+line).html());
}

function sendRoute() {
  var date     = $("#inputDate").val(),
      time     = $("#inputTime").val(),
      jsonDate = date + "T" + time + ":00.000Z";

  var newRoute = {
    _id: {
      line: currentLine,
      time: jsonDate
    },
    risk:"niedrig"
  };

  postRoute(newRoute);
}


function postRoute(dat){
    console.log(dat);
    return new Promise(function (res,rej){
        $.ajax({
            url: "/routes",
            data: dat,
            type: "post",

            success: function (result) {res(result);},
            error: function (err) {console.log(err);}
        });
    });
}
