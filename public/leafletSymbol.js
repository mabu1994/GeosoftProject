var busIcon =
    L.icon({
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Zeichen_224_-_Stra%C3%9Fenbahn-Haltestelle%2C_StVO_1970.svg",
        iconSize:[17,17]
});

var redVirusIcon =
  L.icon({
      iconUrl: "/public/pictures/virus_red.svg",
      iconSize:[27,27]
});

var yellowVirusIcon =
  L.icon({
      iconUrl: "/public/pictures/virus_yellow.svg",
      iconSize:[27,27]
});




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

function riskSelection(number){
  var sText = '<select name="risks" route=' + number +' id="risks'+ number +'">' +
	            '<option value="niedrig" ' + colorRisk('niedrig') + '>Niedrig</option>' +
              '<option value="mittel" '  + colorRisk('mittel') + '>Mittel</option>' +
              '<option value="hoch" ' + colorRisk('hoch') + '>Hoch</span></option>' +
              '</select> <button onClick=saveRisk("risks'+ number+'")>Speichern</button>';
  return sText;
}