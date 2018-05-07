var loki = require('lokijs');
var config = require('./config');
var path = require('path');

module.exports = {
  initialize: initialize
};

function initialize(loadFinish){
  var dbPath = path.resolve('./', config.db.dir, config.db.name);
  var db = new loki(dbPath,
  {
    autosave: true,
    autoload: true,
    autoloadCallback: loadHandler, 
    autosaveInterval: 10000
  }); 

  function loadHandler() {
    var collection = db.getCollection(config.db.collection);
    if (collection === null) {
      console.log("initializing new database");
      collection = db.addCollection(config.db.collection, {
        unique: [ 'uuid' ]
      });
    }
    else {
      console.log("found existing database");
    }

    loadFinish(collection);
  }

  return db;
}
