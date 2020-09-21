
/**
 * addUser - Eine Funktion, die einen neuen User in der user Collection anlegt
 * mit den Daten aus dem Registrationsfenster.
 */
async function addUser(){
    let userName = document.getElementById("uname").value;
    let password = $("#kword").val();
    let userRole = $("#role").val();
    var newuser = {
        _id: userName,
        password: password,
        role: userRole
    };
    try{
        ajaxPost("/users",newuser);
        window.alert("Ihr Benutzerkonto wurde erstellt");

    }
    catch(e){
        console.log(e);
    }
}


/**
 * searchFile - Eine Funktion, welche einen User durch addUser angelegt.
 * Sie führt vorher eine Überprüfung auf Dopplung in der user Collection mit
 * einem searchRequest Aufruf
 *
 */
async function searchFile(){
    let input = document.getElementById("uname").value;
    try{
       let re = await searchRequest(input);
       console.log(re);
       if(re==0){
           addUser();
       }
       else{
           window.alert("Dieser Benutzername ist bereits vergeben!");
       }
    }
    catch(e){
        console.log(e);
    }

}
