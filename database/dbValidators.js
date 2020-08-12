/**
 *  In dieser JS Datei werden die Validatoren für die Collection der Datenbank gespeichert
 */

/**
 * Users Validator im jsonschema Format
 */
const userval = {
  $jsonSchema:{
    bsonType:"object",
    required:["_id","role"],//Passwörter können hier noch hinzugefügt werden
    properties:{
        role:{
          enum:["admin","user","medical"],
          description: "can only be one of the enum values and is required"
        }
    //Ein Array für die entsprechenden Fahrt Schlüssel folgt noch
    }
  }
};

/**
 * Trips Validator im jsonschema Format
 */
const tripval ={
  $jsonSchema:{
    bsonType:"object",
    required:["_id","geography","risk"],
    additionalProperties: false,
    properties:{
        _id:{
          bsonType: "object",
          required: ["line","time"],
          properties:{
            line:{
              bsonType:"string",
              description:"Must be a string and is required"
            },
            time: {
              bsonType:"date",
              description: "Must be a date and is required"
            }
          }
        },
        geography:{
          bsonType:"object"
          //Genaures zur geographischen Repräsentation folgt hier...
        },
        risk:{
          enum:["niedrig", "mittel", "hoch"], //Auch möglich als boolean (dann aber type:boolean)
          description: "Must be a enum value and is required."
        }
    }
  }
};

//Export Anweisungen für Nutzung in index.js
module.exports.tripval = tripval;
module.exports.userval = userval;
