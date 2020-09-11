/**
 * changeUser - Eine Funktion, die einen Anufruf an den Server als Promise
 * startet mit der Id eines Nutzerkontos, dass dann auf aktiv gesetzt wird.
 *
 * @param  {string} newUser Die Id des Kontos, dass auf aktiv gesetzt wird
 * @return {Promise} Promise mit ajax Aufruf an den Server "/changeActive"
 */
function changeUser(newUser){
    console.log(newUser);
    return new Promise(function (res,rej){
        $.ajax({
            url: "/changeActive?id=" + newUser,
            success: function (result) {res(result);},
            error: function (err) {console.log(err);}
        });
    });
}

/**
 * getUser - Eine Funktion, die den aktuell aktiven User zurück gibt mithilfe
 * eines Serveraufrufs.
 *
 * @return {Promise} Promise mit ajax Aufruf an den Server "/getActive"
 */
function getUser(){
  return new Promise(function (res,rej){
      $.ajax({
          url: "/getActive",
          success: function (result) {res(result);},
          error: function (err) {console.log(err);}
      });
  });
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
 * logoutUser - Eine Funktion, die einen Anufruf an den Server als Promise
 * startet, dass das aktive Konto auf inaktiv gesetzt wird.
 *
 * @return {Promise} Promise mit ajax Aufruf an den Server "/logoutActive"
 */
function logoutUser(){
  return new Promise(function (res,rej){
      $.ajax({
          url: "/logoutActive",
          success: function (result) {res(result);},
          error: function (err) {console.log(err);}
      });
  });
}

/**
 * backToLogin - description
 *
 * @return {type}  description
 */
async function backToLogin(){
  var logout = await logoutUser();
  window.open("/login", "_self");
}
