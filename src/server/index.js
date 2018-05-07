var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var logs = require('./logger');
var db = require('../db');

module.exports = {
  start: start
};

function start(config) {
  let logger = logs.initialize();
  let pack;

  db.initialize(function(collection) {
    pack = collection;
  });

  let app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.param('watcher', addWatcherToReq);

  app.get('/pack', sendAllWatchers);

  app.get('/pack/:watcher', sendWatcher);

  app.route('/admin/pack')
    .post(addWatcher);

  app.route('/admin/pack/:watcher')
    .get(sendWatcher)
    .patch(updateWatcher)
    .delete(deleteWatcher);

  function addWatcherToReq(req, res, next) {
    let watcher = pack.findOne({ watcher: req.params.watcher });
    if(watcher) {
      req.watcher = watcher;
      next();
    } else {
      res.status(404).send({ error: 'Bee watcher not found' });
    }
  }

  function sendAllWatchers(req, res){
    res.send(pack.find());
  }

  function sendWatcher(req, res) {
    res.send(req.watcher);
  }

  function addWatcher(req, res) {
    let name = req.body.name;
    let uuid = req.body.uuid;
    let description = req.body.description;
    let location = req.body.location;
    let flock = req.body.flock;
    let update_date = new Date();

    if(uuid && name && location) {
      if(!pack.findOne({ uuid })) {
        let newWatcher = pack.insert({
          name,
          uuid,
          description,
          location,
          flock,
          update_date,
        });

        res.status(200).send(newWatcher);
      } else {
        res.status(400).send({ error: 'Watcher ' + name + ' already exists' });
      }
    } else {
      res.status(400).send({ error: 'uuid/name/location are required' });
    }
  }

  function updateWatcher(req, res) {
    let description = req.body.description || "";
    let flock = req.body.flock || [];
    let watcher = req.watcher;

    let oldFlock = watcher.flock;
    watcher.flock = flock;
    let updatedWatcher = pack.update(watcher);
    
    res.status(200).send(updatedWatcher);
    logger.info('Updating watcher flock ' + watcher.name + ' flock from ' + oldFlock + ' to ' + flock);
  }

  function deleteWatcher(req, res) {
    var watcher = req.watcher;

    pacl.remove(watcher);
    res.send('Deleted watcher ' + watcher.name);
    logger.info('Deleted watcher ' + watcher.name);
  }

  //error handling
  app.use(function(err, req, res, next){
    logger.warn({ message: 'Server error', stack: err.stack });
    res.status(500).send({ error: 'Server error'});
  });

  var server = http.Server(app);

  server.listen(config.server.port);
  console.log("Listening on port " + config.server.port);
}
