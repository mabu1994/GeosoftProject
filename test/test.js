/**
 * Willkommen in den heiligen Hallen unseres test.js, welches mit Mocha funktioniert.
 * Für die assertion und die Verbindungstests haben wir chai bzw. chai-http benutzt,
 * die machen Vieles einfacher :] Fürs testen einfach "npm test" im CLI abfeuern.
 *
 */
 //Die externen Module
var chai     = require('chai');
var chaiHttp = require('chai-http');
var path     = require('path');

//Unsere eignen Module
var risk = require(path.resolve( 'databaseCommunication', 'riskRoutes.js'));
var ajax = require(path.resolve( 'databaseCommunication', 'ajaxFunctions.js'));
var config = require(path.resolve( 'config.js'));

//Ein bissel Chai Setup, damit assert,should und http genutzt werden können
chai.use(chaiHttp);
assert = chai.assert;
var should   = chai.should();


 /**
  * Ab hier wird die checkForRisk Funktion getestet. Diese ist sehr zentral, da
  * von ihr die Warnungen der User abhängen.
  */

//Ein paar Test Arrays
var noStrings = [
  {risk: 1},
  {risk: 2},
  {risk: 3},
  {risk: 4}
];

var falseStrings = [
  {risk: "niedrig"},
  {risk: "testing"},
  {risk: "is"},
  {risk: "fun"}
];

var rightStrings = [
  {risk: "niedrig"},
  {risk: "hoch"},
  {risk: "is"},
  {risk: "fun"}
];

var largeTestArray = [];
for(var i = 0; i < 5000; i++){
  if( i == 4444){
    largeTestArray.push({risk:"mittel"});
  }
  largeTestArray.push({risk:""});
}

describe('Testen unserer eigenen Funktionen', function() {
  describe('#checkForRisk()', function() {
    it('Sollte false zurückgeben, wenn ein leeres Objekt übergeben wird', function() {
      assert.equal(risk.checkForRisk({}), false);
    });
    it('Sollte false zurückgeben, wenn ein Array ohne Strings übergeben wird', function() {
      assert.equal(risk.checkForRisk(noStrings), false);
    });
    it('Sollte false zurückgeben, wenn ein Array ohne die passenden Strings übergeben wird', function() {
      assert.equal(risk.checkForRisk(falseStrings), false);
    });
    it('Sollte true zurückgeben, wenn ein Array mit die passenden Strings an erster Stelle übergeben wird', function() {
      assert.equal(risk.checkForRisk(rightStrings), true);
    });
    it('Sollte true zurückgeben, auch wenn ein groesseres Array mit passendem String übergeben wird', function() {
      assert.equal(risk.checkForRisk(largeTestArray), true);
    });
  });
});


/**
 * Hier wird die Verbindung mit der HERE Public Transit API getest,
 * dafür nutzen wir verschiedene Eigenschaften der Response.
 */

//Diesen Datensatz habe ich aus einer vorherigen erfolgreichen Anfrage für das GEO1 kopiert
var mendelStrasse = {"place":{"name":"Mendelstraße","type":"station","location":{"lat":51.969202,"lng":7.596262},"id":"db_906684"}};

describe('Testen der API-Verbindung mit chai-http', function() {
  describe('Verbindung zur HERE Public Transit Stations API wird mit einer GET-Anfrage mit den Koordinaten des GEO1 und dem API-Key getestet.', function() {
    it('Die Response sollte Status 200 haben, ein Objekt sein, ein Attribut namens "stations" haben, das die Länge 5 hat und das Objekt mendelStrasse als ersten Eintrag haben.', function() {
      chai.request("https://transit.hereapi.com")
        .get("/v8/stations")
        .query({apiKey: config.config.HERE_KEY, in:"51.969301,7.595724"})
        .end(function(err, res){
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.stations.length.should.be.eql(5);
          res.body.stations[0].should.be.eql(mendelStrasse);
        });
    });
  });
  describe('Verbindung zur HERE Public Transit Stations API wird mit einer GET-Anfrage mit den Koordinaten des GEO1 und ohne den API-Key getestet.', function() {
    it('Die Response sollte Status 401 haben, ein Objekt sein, ein Attribut namens "error" , der "Unauthorized" lautet.', function() {
      chai.request("https://transit.hereapi.com")
        .get("/v8/stations")
        .query({ in:"51.969301,7.595724"})
        .end(function(err, res){
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.error.should.be.eql("Unauthorized");//Vorher bekannt
        });
    });
  });
  describe('Verbindung zur HERE Public Transit Stations API wird mit einer GET-Anfrage ohne Koordinaten und dem API-Key getestet.', function() {
    it('Die Response sollte Status 400 haben, ein Objekt sein, ein Attribut namens "cause" haben, das den String "Too few parameters set" als Wert hat', function() {
      chai.request("https://transit.hereapi.com")
        .get("/v8/stations")
        .query({apiKey: config.config.HERE_KEY})
        .end(function(err, res){
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.cause.should.be.eql('Too few parameters set');//Vorher bekannt
        });
    });
  });
});
