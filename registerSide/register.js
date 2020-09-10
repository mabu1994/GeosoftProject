/**
 * 
 *
 */
function addUser(){
    let userName = document.getElementById("uname").value;
    let userRole = $("#role").val();

    
    var newuser = {
        _id: userName,
        role: userRole
    }
    try{    
        postRequest(newuser)
        window.alert("Ihr Benutzerkonto wurde erstellt");
    }
    catch(e){
        console.log(e)
    }
}

/**
 * 
 * 
 */
function postRequest(dat){
    console.log(dat)
    return new Promise(function (res,rej){
        $.ajax({
            url: "/users",
            data: dat,
            type: "post",

            success: function (result) {res(result)},
            error: function (err) {console.log(err)}
        })
    })
}
/**
 * 
 * @param {*} input 
 */
async function searchFile(){
    let input = document.getElementById("uname").value;
    try{
        let result = await searchRequest(input);
    }
    catch(e){
        console.log(e);
        alert("Not Found")
    }
}

/**
 * 
 */
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