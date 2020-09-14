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
app.use('/node_modules', express.static(path.resolve(__dirname , 'node_modules')));
app.use('/currentUser', express.static(path.resolve(__dirname, 'currentUser')));
app.use('/database', express.static(path.resolve(__dirname, 'database')));
app.use('/findRoutes', express.static(path.resolve(__dirname,'findRoutes')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.use('/leaflet', express.static(path.resolve(__dirname, 'node_modules', 'leaflet')));

app.use('/registerSide',express.static(path.resolve(__dirname,"registerSide", "register.js")));
app.use('/showRoutes', express.static(path.resolve(__dirname, 'showRoutes')));

app.get('/login', (req,res) => { res.sendFile(path.resolve(__dirname,"login.html"))});

app.get('/register', (req,res) => {res.sendFile(path.resolve(__dirname,"registerSide","register.html"))});

/**
 * Ein paar Testdatensätze für die users collection
 */
var startusers = [
  {"_id":"Fabian", "role":"admin", "trips":[], "active":false},
  {"_id":"Max", "role":"admin", "trips":[], "active":false},
  {"_id":"Hans Wurst", "role":"medical", "trips":[], "active":false}
];

/**
 * Ein paar Testdatensätze für die routes collection
 */
var startroutes = [
  {"_id":{"line":"N80", "time": new Date()},"stop":{"name":"halte","location":{"lat":22.0,"lng":23.0}},"risk":"niedrig"},
  {"_id":{"line":"Testfahrt T2", "time":new Date()}, "stop":{"name":"halte","location":{"lat":29.0,"lng":23.0}}, "risk":"hoch"}
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
        createCollection(app.locals.db, 'users', val.userval, startusers);// Collection users
        createCollection(app.locals.db, 'routes',val.routeval, startroutes);// Collection routes
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
function createCollection(db, cName, cVal, cData){
  //db.dropCollection('routes');
    try{
      db.collection(cName, {strict:true},
        function(error,collection)
        {
          if(error)
          {
            db.createCollection(cName,
              {validator: cVal, validationLevel:"moderate"});
            db.collection(cName).deleteMany();//Cleans the database
            db.collection(cName).insertMany(cData);
          }
          else{
            console.log('No new user setup');
            db.collection(cName).deleteMany();//Cleans the database
            db.command({collMod: cName,validator:cVal});//Refresh validator
            db.collection(cName).insertMany(cData);
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
  app.locals.db.collection('users').insertOne({
    _id:    req.body._id,
    role:   req.body.role,
    trips:  [],
    active: false
  },(error,result)=>{
    if(error){
      console.dir(error);
    }
    res.json(result);
  });
});



/**
 * Die app nihmt den request body entgegen und speichert ihn als Objekt
 * in der Routes Collection speichert.
 */
app.post("/routes", (req,res)=>{
  console.log("create Route");
  console.log(JSON.stringify(req.body));
  app.locals.db.collection('routes').insertOne({
    _id: {
      line: req.body._id.line,
      time: new Date(req.body._id.time)
    },
    stop: req.body.stop,
    risk: req.body.risk
  },(error,result)=>{
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
      res.send(result);
  });
});


/**
 * Die app findet in der Datenbank einem angegebenen User und setzt sein active
 * Attribut auf 'true'.
 */
app.get("/changeActive",
  (req,res) => {
    try{
    let id = req.query.id;
    console.log(req.query);

    app.locals.db.collection('users').updateOne({_id:id},{$set:{active: true}});
  }
        catch(error){
            console.dir(error);
        }
        console.log("Setting active user");
        res.send("User is now online");
  }
);

/**
 * Die app findet alle user deren active Attribut auf true gesetzt werden und gibt
 * sie als Array zurück.
 */
app.get("/getActive",(req,res) => {
  console.log("Getting active user");
  app.locals.db.collection('users').find({active:true}).toArray((error,result)=>{
      if(error){
          console.dir(error);
      }
      res.send(result);
  });
});

/**
 * Wenn auf /getActive etwas gepostet wird, wird die id Request im Trips
 * des aktuellen Users gespeichert.
 */
app.post("/getActive", (req,res)=>{
  console.log("Add Route to Users Routes");
  console.log(JSON.stringify(req.body));
  app.locals.db.collection('users').updateOne(
    {active: true},
    {$push: {trips: req.body._id}},
    (error,result)=>{
    if(error){
      console.dir(error);
    }
    res.json(result);
  });
});


/**
 * Die trips des aktuellen Users werden als Array bei einer get Anfrage auf
 * '/tripsActive' zurückgesendet  
 */
app.get("/tripsActive", (req,res) => {
  var trips = JSON.parse(req.query.trips);
  for(var i = 0; i<trips.length; i++){
    trips[i].time = new Date(trips[i].time);//Datumskonversion
  }
  console.log(trips);
  console.log("Getting active users trips");
  app.locals.db.collection('routes').find({_id:{$in: trips}}).toArray((error,result)=>{
      if(error){
          console.dir(error);
      }
      res.json(result);
  });
});

/**
 * Die findet den user der aktiv ist und setzt das active attribut auf false.
 */
app.get("/logoutActive",
  (req,res) => {
    try{
    app.locals.db.collection('users').updateOne({active: true},{$set:{active: false}});
  }
        catch(error){
            console.dir(error);
        }
        console.log("Logging out active user");
        res.send("User is logged out.");
  }
);

app.get('/find',
  (req,res) => res.sendFile(path.resolve(__dirname,'findRoutes', 'findRoutes.html'))
);

app.get('/show',
  (req,res) => res.sendFile(path.resolve(__dirname,'showRoutes', 'showRoutes.html'))
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
