/**
 * Die Leaflet Karte wird initialisiert und mit einer Leaflet tile-Karte versehen.
 */
var map = L.map('mapContainer').setView([51.9623600, 7.6257100], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 18,
attribution: 'Leaflet, OpenStreetMapContributors',
}).addTo(map);

var stopMarkers = L.featureGroup();

displayStops();
console.log(stopMarkers);

/**
 * displayStops - Eine Funktion, die die Fahrten des aktuellen Users auf einer Leaflet
 * Karte zeigt. Die Halte erhalten Popups mit der entsprechenden Fahrt.
 */
async function displayStops(){
  var currentStops = [],
      trips = await getUserTrips();//Die Fahrten des aktuellen users werden geladen.
  console.log(trips);
  for(var i = 0; i < trips.length; i++){
    createStop(trips[i], currentStops);//Popup und Marker werden erstellt
    currentStops[i] = trips[i];
    // !-- Doppelte Stops müssen noch berücksichtig --!
  }
  stopMarkers.addTo(map);
  map.flyToBounds(stopMarkers.getBounds());//Dynamischer Flug zu allen Stops
}


/**
 * createStop - Der Stop wird als Leafletmarker mit Popup umgesetzt.
 *
 * @param  {route object} trip Eintrag aus der Routes Datenbank
 */
function createStop(trip){
  var stopIcon = iconRisk(trip);
  if(checkForStop(trip)[0] == 1){
    var secondStop = "<br><h4>" + trip._id.line + "</h4><br>" +
    (new Date(trip._id.time)).toLocaleString('de-DE',{timeZone: "UTC"}) + "<br>" +
    "<b>Zugestiegen</b>: " + trip.stop.name + "<br>" +
    "<b>Risiko</b>: " + "<span "+ colorRisk(trip.risk)+">" + trip.risk + "</span>";

    //Der Marker wird um den Halt im Popup erweitert und das Icon wird ggf. angepasst
    var existMarker = stopMarkers.getLayer(checkForStop(trip)[1]);
    existMarker.setIcon(compareRisk(existMarker.getIcon().options.className, trip.risk));
    console.log(existMarker.getIcon());
    existMarker.setPopupContent(existMarker.getPopup().getContent() + secondStop);
  }
  else{
    var cTrip = L.marker(trip.stop.location, {icon: stopIcon}).addTo(stopMarkers);
    cTrip.bindPopup(
      "<h4>" + trip._id.line + "</h4><br>" +
      (new Date(trip._id.time)).toLocaleString('de-DE',{timeZone: "UTC"}) + "<br>" +
      "<b>Zugestiegen</b>: " + trip.stop.name + "<br>" +
      "<b>Risiko</b>: " + "<span "+ colorRisk(trip.risk)+">" + trip.risk + "</span>"
    );
  }
}
