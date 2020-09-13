var busIcon =
    L.icon({
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Zeichen_224_-_Stra%C3%9Fenbahn-Haltestelle%2C_StVO_1970.svg",
        iconSize:[17,17]
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
