const express = require('express');
const mongodb = require('mongodb');
const path =require('path');
const app     = express();
const port    = 3000;

var objectId = require('mongodb').ObjectId;
var val = require(path.resolve(__dirname, "database", "dbValidators.js"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/jquery', express.static(path.resolve(__dirname, 'node_modules', 'jquery')));

app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/database', express.static(path.resolve(__dirname, 'database')));

app.use('/findRoutes', express.static(path.resolve(__dirname,'findRoutes')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.use('/leaflet', express.static(path.resolve(__dirname, 'node_modules', 'leaflet')));

app.use('/registerSide',express.static(path.resolve(__dirname,"registerSide", "register.js")));


app.get('/login', (req,res) => { res.sendFile(path.resolve(__dirname,"login.html"))});

app.get('/register', (req,res) => {res.sendFile(path.resolve(__dirname,"registerSide","register.html"))});

/**
 * Ein paar Testdatensätze für die users collection
 */
var startusers = [
  {"_id":"Fabian", "role":"admin"},
  {"_id":"Max", "role":"admin"},
  {"_id":"Hans Wurst", role:"medical"}
];

/**
 * Ein paar Testdatensätze für die routes collection
 */
var startroutes = [
  {"_id":{"line":"N80", "time": new Date()},"geography":{"location":"here"},"risk":"niedrig"},
  {"_id":{"line":"Testfahrt T2", "time":new Date()}, "geography":{}, risk:"hoch"}
];


/**
 * connectMongoDB - Eine Funktion die eine Datenbank
 * namens geosoftproject schafft bzw. mit ihr verbindet
 * Gelichzeitig werden die collections users/routes geschaffen/ erneuert
 */
async function connectMongoDB(){
    try{
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017/geosoftproject", {useNewUrlParser: true, useUnifiedTopology: true});
        app.locals.db = await app.locals.dbConnection.db("geosoftproject"); //Creation of the database
        console.log("Using db: " + app.locals.db.databaseName);
        createUsers(app.locals.db);// Collection users
        createroutes(app.locals.db);// Collection routes
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
  //db.dropCollection('routes');
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
 * createroutes - Erzeugt eine Collection namens routes, falls diese noch nicht existiert
 * Außerdem werden dabei ein validator gesetzt und die Testdatensätze geladen
 * Sonst wird sie geleert und mit den Testdatensätzen gefüllt und der validator geupdated
 *
 * @param  {type} db Die Mongo Datenbank in der die Collection erzeugt werden soll.
 */
function createroutes(db){
    try{
      db.collection('routes', {strict:true},
        function(error,collection)
        {
          if(error)
          {
            db.createCollection('routes',
              {validator: val.routeval, validationLevel:"moderate"});
            db.collection('routes').deleteMany();//Cleans the database
            db.collection('routes').insertMany(startroutes);
          }
          else{
            db.collection('routes').deleteMany();//Cleans the database
            db.command({collMod: 'routes',validator:val.routeval});//Refresh validator
            db.collection('routes').insertMany(startroutes);
          }
        });
    }

    catch(error){
        console.dir(error);
    }
}

connectMongoDB();

/**
 * Neuen User erstellen
 *
 */
app.post("/users", (req,res)=>{
  console.log("create User");
  console.log(JSON.stringify(req.body));
  app.locals.db.collection('users').insertOne(req.body,(error,result)=>{
    if(error){
      console.dir(error);
    }
    res.json(result);
  });
});
/**
 * 
 */
app.get("/search",(req,res) => {
  
  let id = req.query.id;
  
  console.log(req.query);
  app.locals.db.collection('users').find({_id:id}).toArray((error,result)=>{
      if(error){
          console.dir(error);
      }
      res.json(result);
  });
});

app.get('/find',
  (req,res) => res.sendFile(path.resolve(__dirname,'findRoutes', 'findRoutes.html'))
);

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
 * Kleine Übersicht im Browser der routes collection für Entwicklungszwecke
 */
app.get('/routes', (req,res) => {
    app.locals.db.collection('routes').find({}).toArray((error, result) => {
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
