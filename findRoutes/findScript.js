/**
 * Ein Skript für die findRoutes Datei, das die Leaflet Karte startet und
 * es ermöglicht die nächsten Haltestellen für eine userdefinierte Position
 * einzusehen. Von diesen Haltestellen kann der User dann seine Route und die Zeit
 * wählen.
 */
var hereKey = config.HERE_KEY; //Den Here api key hier einfügen
var currentPosition, stops, currentStop, currentLine;//Variablen für die Userposition und die nahen Stops


displayUser();
//Limitation der Datumeingabe auf das aktuelle Datum
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
  showStops();//Stops in der Nähe werden geladen
}


/**
 * showStops - Die Funktion sendet eine ajax-Request an die here api und setzt
 * die zurückgebenen Haltestellen als marker auf der Karte um.
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
        var lineButton = "<button class='btn btn-dark btn-sm' id=" + k + j + " stop="+ i +" onClick='chooseLine(" + k + j + ")'>" + lineName + "</button><br>";
        //Html Button wird als Rohtext erzeugt
        stopLines += lineButton;
      }

      curStop.bindPopup("<h3>" + stops[i].place.name + "</h3>" + stopLines);
      //Popup erstellen
    }
    stopmarkers.addTo(map);
  });
}

/**
 * chooseLine - Eine Funktion, die die aktuell gewählte Route in
 * die entsprechenden Zwischenvariablen lädt.
 *
 * @param  {type} line Kennziffer der Linie und des Stops
 */
function chooseLine(line) {
    $("#selection").html("Ihre Route: " + $("#"+line).html());//In Html wird die Linie angezeigt
    var stopNumber = $("#"+line).attr("stop");
    currentStop = stops[stopNumber];//Stop wird gespeichert
    console.log(currentStop);
    currentLine = $("#"+line).html();//Linie wird gespeichert
    console.log(line, $("#"+line).html());
}

/**
 * sendRoute - Eine Funktion, die aktuell gewählte Route in die Routen Datenbank
 * speichert. Gleichzeitig wird sie als Referenz im trips Attribut des aktuell
 * aktiven Users.
 */
async function sendRoute() {
  var date     = $("#inputDate").val(),
      time     = $("#inputTime").val(),
      jsonDate = date + "T" + time + ":00.000Z";//Vorformatiertung des Datums

  var newRoute = {
    _id: {
      line: currentLine,
      time: jsonDate
    },
    stop:{
      name: currentStop.place.name,
      location: currentStop.place.location
    },
    risk:"niedrig"
  };

  var pRoute      = await postRoute(newRoute, "/routes");
  var routeToUser = await postRoute(newRoute, "/getActive");
}


/**
 * postRoute - Eine Funktion, die eine url und einen Datensatz entgegen nihmt und
 * dann den Datensatz dort als Promise mit ajax Anfrage postet.
 *
 * @param  {object} dat  Der Datensatz, der gepostet werden soll
 * @param  {string} pUrl Die Ziel url
 * @return {Promise} Ein Promise, das die post ajax beinhaltet
 */
function postRoute(dat, pUrl){
    console.log(dat);
    return new Promise(function (res,rej){
        $.ajax({
            url:  pUrl,
            data: dat,
            type: "post",

            success: function (result) {res(result);},
            error: function (err) {console.log(err);}
        });
    });
}
