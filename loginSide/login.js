/**
 * searchAcc - Eine Funktion, die bei einem Loginversuch überprüft, ob das
 * angegbene Konto in der Datenbank existiert. Sollte dies nicht der Fall sein
 * wird der User benachrichtigt. Bei richtigen Login wird der Benutzer je nach
 * Rolle auf /find oder /medical geleitet. Dabei wird der neu einglogte User in
 * der Datenbank auf aktiv gesetzt.
 *
 */
async function searchAcc(){
    let input = document.getElementById("uname").value;
    let pword = $("#kword").val();
    try{
       let re = await confirmRequest(input, pword);
       console.log(re);
       if(re==0){
           window.alert("Der eingebene Benutzername oder das Passwort ist falsch. Bitte versuchen sie es erneut.")
       }
       else{
        var logoutU = await logoutUser();
        var changeU = await changeUser(document.getElementById("uname").value);
        var activeU = await getUser();
        if(activeU[0].role == "user"){ // Userrollenabfrage
          var trips = await getUserTrips();
          console.log(checkForRisk(trips));
          if(checkForRisk(trips) == true){
            window.open("/warn", "_self");
          }
          else{
            window.open("/find", "_self");
          }
        }
        else if (activeU[0].role == "medical"){ // Userrollenabfrage
          window.open("/medical", "_self");
        }
       }
    }
    catch(e){
        console.log(e);
    }
}
