const express = require('express');
const mongodb = require('mongodb');
const path =require('path');
const app     = express();
const port    = 3000;
var val = require(path.resolve(__dirname, "database", "dbValidators.js"));

app.use('/database', express.static(__dirname + '\\database'));

app.get('/login', (req,res) => { res.sendFile(path.resolve(__dirname,"/login.html"))});
/**
 * Ein paar Testdatensätze für die users collection
 */
var startusers = [
  {"_id":"Fabian", "role":"admin"},
  {"_id":"Max", "role":"admin"},
  {"_id":"Hans Wurst", role:"medical"}
];

/**
 * Ein paar Testdatensätze für die trips collection
 */
var starttrips = [
  {"_id":{"line":"N80", "time": new Date()},"geography":{"location":"here"},"risk":"niedrig"},
  {"_id":{"line":"Testfahrt T2", "time":new Date()}, "geography":{}, risk:"hoch"}
];


/**
 * connectMongoDB - Eine Funktion die eine Datenbank
 * namens geosoftproject schafft bzw. mit ihr verbindet
 * Gelichzeitig werden die collections users/trips geschaffen/ erneuert
 */
async function connectMongoDB(){
    try{
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017/geosoftproject", {useNewUrlParser: true, useUnifiedTopology: true});
        app.locals.db = await app.locals.dbConnection.db("geosoftproject"); //Creation of the database
        console.log("Using db: " + app.locals.db.databaseName);
        createUsers(app.locals.db);// Collection users
        createTrips(app.locals.db);// Collection trips
    }
    catch(error){// Falls die connection mal fehlschlägt
        console.dir(error);
        setTimeout(connectMongoDB, 3000);
    }

}



/**
 * createUsers - Erzeugt eine Collection namens users, falls diese noch nicht existiert
 * Außerdem werden dabei ein validator gesetzt und die Testdatensätze geladen
 * Sonst wird sie geleert und mit den Testdatensätzen gefüllt und der validator geupdated
 *
 * @param  {type} db Die Mongo Datenbank in der die Collection erzeugt werden soll.
 */
function createUsers(db){
  //db.dropCollection('trips');
    try{
      db.collection('users', {strict:true},
        function(error,collection)
        {
          if(error)
          {
            db.createCollection('users',
              {validator: val.userval, validationLevel:"moderate"});
            db.collection('users').deleteMany();//Cleans the database
            db.collection('users').insertMany(startusers);
          }
          else{
            console.log('No new user setup');
            db.collection('users').deleteMany();//Cleans the database
            db.command({collMod: 'users',validator:val.userval});//Refresh validator
            db.collection('users').insertMany(startusers);
          }
        });
    }

    catch(error){
        console.dir(error);
    }
}


/**
 * createTrips - Erzeugt eine Collection namens trips, falls diese noch nicht existiert
 * Außerdem werden dabei ein validator gesetzt und die Testdatensätze geladen
 * Sonst wird sie geleert und mit den Testdatensätzen gefüllt und der validator geupdated
 *
 * @param  {type} db Die Mongo Datenbank in der die Collection erzeugt werden soll.
 */
function createTrips(db){
    try{
      db.collection('trips', {strict:true},
        function(error,collection)
        {
          if(error)
          {
            db.createCollection('trips',
              {validator: val.tripval, validationLevel:"moderate"});
            db.collection('trips').deleteMany();//Cleans the database
            db.collection('trips').insertMany(starttrips);
          }
          else{
            db.collection('trips').deleteMany();//Cleans the database
            db.command({collMod: 'trips',validator:val.tripval});//Refresh validator
            db.collection('trips').insertMany(starttrips);
          }
        });
    }

    catch(error){
        console.dir(error);
    }
}

connectMongoDB();


/**
 * Kleine Übersicht im Browser der users collection für Entwicklungszwecke
 */
app.get('/users', (req,res) => {
    app.locals.db.collection('users').find({}).toArray((error, result) => {
        if(error){
            console.dir(error);
        }
        res.json(result)
    });
});

/**
 * Kleine Übersicht im Browser der trips collection für Entwicklungszwecke
 */
app.get('/trips', (req,res) => {
    app.locals.db.collection('trips').find({}).toArray((error, result) => {
        if(error){
            console.dir(error);
        }
        res.json(result)
    });
});


/**
 * Zurodnung des port Konstanten für die express app
 */
app.listen(port,
            () => console.log('Example app listening at http://localhost:'+port));
