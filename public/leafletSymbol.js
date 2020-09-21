var busIcon =
    L.icon({
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Zeichen_224_-_Stra%C3%9Fenbahn-Haltestelle%2C_StVO_1970.svg",
        iconSize:[17,17]
});//Icon für risikolose Fahrten

var redVirusIcon =
  L.icon({
      iconUrl: "/public/pictures/virus_red.svg",
      iconSize:[27,27]
});//Icon für mitelmäßig riskante Fahrten

var yellowVirusIcon =
  L.icon({
      iconUrl: "/public/pictures/virus_yellow.svg",
      iconSize:[27,27]
});// Icon für hochriskante Fahrten




/**
 * colorRisk - Eine Funktion, die für die entsprechende Risikostufe der Fahrt
 * das HTML style-Attribut mit korrespondierender Farbe zur Weiterverarbeitung
 * zurückgegeben.
 *
 * @param  {string} risk Die Risikostufe als String (s. Validator für Routes)
 * @return {string} color Rohtext des Html Style Elements
 */
function colorRisk(risk){
  var color;
  switch(risk){
    case "niedrig":
    color = "style='color:#33cc33'";
    return color;
    case "mittel":
    color = "style='color:#ff9900'";
    return color;
    case "hoch":
    color = "style='color:#ff0000'";
    return color;
    default:
    console.error("Diese Risikostufe ist nicht verfügbar");
  }
}

/**
 * iconRisk - Eine Funktion, die für die entsprechende Risikostufe der Fahrt
 * das Leaflet Icon mit korrespondierender Farbe zur Weiterverarbeitung
 * zurückgegeben.
 *
 * @param  {string} risk Die Risikostufe als String (s. Validator für Routes)
 * @return {L.icon} Ein Icon zur Weiterverarbeitung in den Karten
 */
function iconRisk(trip){
  switch(trip.risk){
    case "niedrig":
    return busIcon;
    case "mittel":
    return yellowVirusIcon;
    case "hoch":
    return redVirusIcon;
    default:
    console.error("Diese Risikostufe ist nicht verfügbar");
  }
}

/**
 * riskSelection - Eine Funktion, die ein nummeriertes Select HTML Element als
 * Rohtext zurückgibt.
 *
 * @param  {number} number Die Nummer des aktuellen Select Elements zur Unterscheidung durch die Id
 * @return {String}        Das Select Html Element als String
 */
function riskSelection(number){
  var sText = '<select name="risks" class="form-control-sm" route=' + number +' id="risks'+ number +'">' +
	            '<option value="niedrig" ' + colorRisk('niedrig') + '>Niedrig</option>' +
              '<option value="mittel" '  + colorRisk('mittel') + '>Mittel</option>' +
              '<option value="hoch" ' + colorRisk('hoch') + '>Hoch</span></option>' +
              '</select> <button class="btn btn-dark btn-sm" onClick=saveRisk("risks'+ number+'")>Speichern</button>';
  return sText;
}


/**
 * checkForStop - Eine Funktion, die ein Objekt der routes Collection entgegennihmt
 * und bestimmt, ob ein Stop mit den selben Koordinaten schon einer Markergruppe "stopMarkers" existiert.
 *
 * @param  {object} trip Das auszuwertende Objekt in der Form der routes collection 
 * @return {array}      Ein Array mit 0 oder 1 als Wert, falls der Stop gefunden
 *                     wurde und die Layerid des entsprechenden Layers in Stopmarkers an zweiter Stelle
 */
function checkForStop(trip){
  var output = [0, null];
  stopMarkers.eachLayer(function(layer){
    var markerPos = layer.getLatLng();
    if(markerPos.lat == trip.stop.location.lat && markerPos.lon == trip.stop.location.lon){
      output[0] = 1;
      output[1] = stopMarkers.getLayerId(layer);
    }
  });
  return output;
}
