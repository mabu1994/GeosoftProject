checkForMedical();
displayUser();
medicalTable();

var currentRoutes;
/**
 * medicalTable - Die Trips des aktuellen Users werden als Tabelle angezeigt,
 * geordnet nach dem Datum der Fahrt.
 */
async function medicalTable(){
  var trips = await getAllRoutes();
  trips.sort(function(a,b){return (new Date(a._id.time) - new Date(b._id.time));});
  console.log(trips);
  var tText = "<table class='niceTable'><tr><th>Linie</th><th>Zeit</th><th>Zustieg</th><th>Risiko</th></tr>";
  //Kopfzeile der Tabelle
  for(var i = 0; i < trips.length; i++){
    tText += createTableData(trips[i], i);
  }
  tText += "</table>";
  $("#stopTable").html(tText);//Die Tabelle wird geladen
  currentRoutes = trips;

  for(var i = 0; i < trips.length; i++){
    $("#risks" + i).val(trips[i].risk);
  }
}

/**
 * createTableData - Eine Funktion, die ein Routen Objekt als HTML
 * Tabellen Reihe umsetzt.
 *
 * @param  {routes object} trip Routen Objekt, desssen Infos tabelisiert werden sollen
 * @return {String} Vorformatierte Tabellenzeile der HTML Tabelle
 */
function createTableData(trip, number){
  var dText = "<tr><td>" + trip._id.line + "</td><td>" +
              (new Date(trip._id.time)).toLocaleString('de-DE',{timeZone: "UTC"}) + //Datumskonversion damit nicht umgerechnet wird
              "</td><td>" + trip.stop.name + "</td><td>" +
              riskSelection(number) + "</td></tr>";

  return dText;
}

function refreshRoutes(){
  document.getElementById('medMap').contentDocument.location.reload(true);
  medicalTable();
}

function quarantine(){
  var userDate = {
    _id: $("#username").val(),
    start: $("#startDate").val(),
    end:   $("#endDate").val(),
    risk: $("#riskUser").val()
  };
  console.log(userDate);
  sendUserRoutes(userDate);
}
