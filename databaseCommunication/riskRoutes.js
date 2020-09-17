
/**
 * getAllRoutes - Eine Funktion, die alle Routen, die momentan auf dem Server
 * gespeichert sind zurück gibt als Array
 *
 * @return {array}  Ein Array von mit allen Datensätzen aus der routes Collection
 */
function getAllRoutes(){
  return ajaxGet("/routes");
}


/**
 * changeRiskRoute - Eine Funktion, die bei einer bestimmten Route das Risiko
 * ändert.
 *
 * @param  {object} dat Objekt mit den entsprechenden Daten (Routen Id, Risiko)
 * @return {Promise}  promise mit Ajax post auf /riskByRoute
 */
function changeRiskRoute(dat){
  return ajaxPost("/riskByRoute", dat);
}

/**
 * changeRiskUser - Eine Funktion,die eine ajax Post-Anfrage mit einem gegebenen
 * Datensatz an /riskByUSer.
 *
 * @param  {object} dat description
 * @return {Promise}     promise mit Ajax post auf /riskByUser
 */
function changeRiskUser(dat){
  return ajaxPost("/riskByUser", dat);
}

/**
 * sendUserRoutes - Eine Funktion, ein Objekt mit einem Username, Risiko, Start-
 * Enddatum entgegennihmt und daraus ein Anfrageobjekt für die changeRiskUser
 * Funktion erzeugt.
 *
 * @param  {type} data Das Objekt für die Anfrage (_id,start,end,risk)
 */
async function sendUserRoutes(data){
  var userTrips = await ajaxGet("/search?id=" + data._id);//Trips des Users holen
  var query     = {
    trips: userTrips[0].trips,
    start: data.start,
    end:   data.end,
    risk:  data.risk
  };
  console.log(query);
  var poop = changeRiskUser(query);//People order our programs
}


/**
 * saveRisk - Eine Funktion, die eine HTML Id entgegen und fragt das dort
 * eingetragene Risiko and die changeRiskRoute Funktion und damit an die
 * Datenbank weiterleitet.
 *
 * @param  {string} htmlId Die Id des abzufrageneden HTML ELementes
 */
async function saveRisk(htmlId){
  var data = {
    risk: $("#"+htmlId).val(),
    _id: currentRoutes[$("#"+htmlId).attr("route")]._id
  };
  var sendRisk = await changeRiskRoute(data);
}


/**
 * checkForRisk - Eine Funktion, die ein boolschen Wert zurück gibt, ob der
 * ein Array von Fahrten eine risikobehafte Fahrt beinhaltet oder nicht.
 * Dabei wird das risk Attribut auf hoch oder mittel überptüft.
 *
 * @param  {type} trips Ein Array von fahrten
 * @return {boolean}    description
 */
function checkForRisk(trips){
  for(var i = 0; i < trips.length; i++){
    if(trips[i].risk == "mittel"|| trips[i].risk == "hoch"){
      return true;
    }
  }
  return false;
}
