

/**
 * ajaxGet - Funktion, die ein Promise mit einer ajax get-Anfrage auf eine bestimmte
 * URL zurückgibt.
 *
 * @param  {String} url Die URL auf der die get-Anfrage ausgeführt werden soll
 * @return {Promise}    Ein Promise mit der ajax Anfrage
 */
function ajaxGet(url){
  return new Promise(function (res,rej){
      $.ajax({
          url: url,
          success: function (result) {res(result);},
          error: function (err) {console.log(err);}
      });
  });
}

/**
 * ajaxPost - Funktion, die ein Promise mit einer ajax post-Anfrage auf
 * eine bestimmte URL zurückgibt. Dabei wird ein vorher übergebener Datensatz gepostet.
 *
 * @param  {String} url Die URL auf der die post-Anfrage ausgeführt werden soll
 * @param  {object} dat Der Datensatz, der gepostet werden soll
 * @return {Promise}    Ein Promise mit der ajax Anfrage
 */
function ajaxPost(url, dat){
  return new Promise(function (res,rej){
      $.ajax({
          url: url,
          data: dat,
          type: "post",
          success: function (result) {res(result);},
          error: function (err) {console.log(err);}
      });
  });
}
