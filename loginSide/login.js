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
    try{
       let re = await searchRequest(input);
       console.log(re);
       if(re==0){
           window.alert("Unter diesem Benutzernamen ist kein Konto registriert!")
       }
       else{
        var logoutU = await logoutUser();
        var changeU = await changeUser(document.getElementById("uname").value);
        var activeU = await getUser();
        if(activeU[0].role == "user"){ // Userrollenabfrage
          window.open("/find", "_self");
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
