
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

function getUser(){
  return new Promise(function (res,rej){
      $.ajax({
          url: "/getActive",
          success: function (result) {res(result);},
          error: function (err) {console.log(err);}
      });
  });
}

async function displayUser(){
  var cUser = await getUser();
  console.log(cUser);
  $("#user").html("Sie sind angemeldet als: " + cUser[0]._id);
}

function logoutUser(){
  return new Promise(function (res,rej){
      $.ajax({
          url: "/logoutActive",
          success: function (result) {res(result);},
          error: function (err) {console.log(err);}
      });
  });
}

async function backToLogin(){
  var logout = await logoutUser();
  window.open("/login", "_self");
}
