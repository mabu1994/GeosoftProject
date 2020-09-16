var currentRoutes;
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


/**
 * displayStops - Eine Funktion, die die Fahrten des aktuellen Users auf einer Leaaflet
 * Karte zeigt. Die Halte erhalten Popups mit der entsprechenden Fahrt.
 */
async function displayStops(){
  var trips = await getAllRoutes();//Die Fahrten des aktuellen users werden geladen.
  console.log(trips);
  for(var i = 0; i < trips.length; i++){
    createStop(trips[i], i);//Popup und Marker werden erstellt
    // !-- Doppelte Stops müssen noch berücksichtig --!

  }
  stopMarkers.addTo(map);
  map.flyToBounds(stopMarkers.getBounds());//Dynamischer Flug zu allen Stops
  currentRoutes = trips;
}


/**
 * createStop - Der Stop wird als Leafletmarker mit risikoentsprechenden Icon
 * und Popup umgesetzt.
 *
 * @param  {route object} trip Eintrag aus der Routes Datenbank
 */
function createStop(trip, number){
  console.log(trip.risk);
  var stopIcon = iconRisk(trip);
  var cTrip = L.marker(trip.stop.location, {icon: stopIcon}).addTo(stopMarkers);
  cTrip.bindPopup(
    "<h4>" + trip._id.line + "</h4><br>" +
    (new Date(trip._id.time)).toLocaleString('de-DE',{timeZone: "UTC"}) + "<br>" +
    "<b>Zugestiegen</b>: " + trip.stop.name + "<br>" +
    "<b>Risiko</b>: " + riskSelection(number) + "</span>"
  );
  cTrip.on('popupopen', function(e){
    $("#risks" + number).val(trip.risk);
  });
}
