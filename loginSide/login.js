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
        window.open("/find", "_self");
       }
    }
    catch(e){
        console.log(e);
    }

}
function searchRequest(input){
    console.log(input)
    return new Promise(function (res,rej){
        $.ajax({
            url: "/search?id=" + input,
            success: function (result) {res(result)},
            error: function (err) {console.log(err)}
        });
    })
}