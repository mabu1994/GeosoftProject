/**
 * changeUser - Eine Funktion, die einen Anufruf an den Server als Promise
 * startet mit der Id eines Nutzerkontos, dass dann auf aktiv gesetzt wird.
 *
 * @param  {string} newUser Die Id des Kontos, dass auf aktiv gesetzt wird
 * @return {Promise} Promise mit ajax Aufruf an den Server "/changeActive"
 */
function changeUser(newUser){
    console.log(newUser);
    return ajaxGet("/changeActive?id=" + newUser);
}

/**
 * getUser - Eine Funktion, die den aktuell aktiven User zurück gibt mithilfe
 * eines Serveraufrufs.
 *
 * @return {Promise} Promise mit ajax Aufruf an den Server "/getActive"
 */
function getUser(){
  return ajaxGet("/getActive");
}

/**
 * displayUser - Eine Funktion, die den aktuellen User in einem html Element
 * mit der id "user" zeigt.
 *
 */
async function displayUser(){
  var cUser = await getUser();
  console.log(cUser);
  $("#user").html("Sie sind angemeldet als: " + cUser[0]._id);
}


/**
 * tripsUser - Eine Funktion, die ein Array von Routen ids annihmt und die
 * entsprechenden Routen Einträge aus der Datenbank als Promise zurückgibt.
 *
 * @param  {array} trips Ein array von _id Objekten im Schema der Routes DB
 * @return {Promise} Promise mit den matchenden Route eintragen
 */
function tripsUser(trips){
  return ajaxGet("/tripsActive?trips=" + trips);
}

async function getUserTrips(){
  var aUser  = await getUser();
  var aTrips = await tripsUser(JSON.stringify(aUser[0].trips));
  return aTrips;
}

/**
 * logoutUser - Eine Funktion, die einen Anufruf an den Server als Promise
 * startet, dass das aktive Konto auf inaktiv gesetzt wird.
 *
 * @return {Promise} Promise mit ajax Aufruf an den Server "/logoutActive"
 */
function logoutUser(){
  return ajaxGet("/logoutActive");
}

async function checkForMedical(){
  var cUser = await getUser();
  console.log(cUser[0].role);
  if(cUser[0].role != "medical"){
    window.open("/find","_self");
  }
}

/**
 * backToLogin - Eine Funktion, die den akitven User auslogt und das Login-Fenster
 * öffnet.
 */
async function backToLogin(){
  var logout = await logoutUser();
  window.open("/login", "_self");
}

/**
 * searchRequest - Funktion, die eine ajax Postanfrage an /search schickt, um
 * ein user Datensatz zuerhalten.
 *
 * @param  {String} input Die id eines Users als String
 * @return {object}       Datensatz aus der User Collection mit der entsprechenden Id
 */
function searchRequest(input){
 return ajaxGet("/search?id="+input);
}
