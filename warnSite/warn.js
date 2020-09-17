showTable();

async function showTable(){
  var trips = await getUserTrips();
  trips.sort(function(a,b){return (new Date(a._id.time) - new Date(b._id.time));});
  console.log(trips);
  var tText = "<table class='niceTable'><tr><th>Linie</th><th>Zeit</th><th>Zustieg</th><th>Risiko</th></tr>";
  //Kopfzeile der Tabelle
  for(var i = 0; i < trips.length; i++){
    if(trips[i].risk == "mittel" || trips[i].risk == "hoch"){
    tText += createTableData(trips[i]);
    }
  }
  tText += "</table>";
  $("#warnTable").html(tText);//Die Tabelle wird geladen
}

/**
 * createTableData - Eine Funktion, die ein Routen Objekt als HTML
 * Tabellen Reihe umsetzt.
 *
 * @param  {routes object} trip Routen Objekt, desssen Infos tabelisiert werden sollen
 * @return {String} Vorformatierte Tabellenzeile der HTML Tabelle
 */
function createTableData(trip){
  var dText = "<tr><td>" + trip._id.line + "</td><td>" +
              (new Date(trip._id.time)).toLocaleString('de-DE',{timeZone: "UTC"}) + //Datumskonversion damit nicht umgerechnet wird
              "</td><td>" + trip.stop.name + "</td><td>" +
              "<span "+ colorRisk(trip.risk) + " >" + trip.risk + "</span></td></tr>";

  return dText;
}
