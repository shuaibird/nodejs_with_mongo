var express = require("express");
var mongodb = require('mongodb')
var {MongoClient, ObjectID} = mongodb

var url = 'mongodb://localhost/chat';

var router = express.Router();
module.exports = router;

router.get('/', function (req, res, next) {
  MongoClient.connect(url, (err, db) => {
    if(err) return next(err)
      
    db.collection('rooms').find().toArray((err, rooms) => {
      res.render("rooms/list", {
        title: "Admin Rooms",
        rooms: rooms
      })
      db.close()
    })
  })
})


router.route('/add')
  .get(function (req, res) {
    res.render("rooms/add");
  })
  .post(function (req, res) {
    var room = {
      name: req.body.name
    };
    MongoClient.connect(url, (err, db) => {
      db.collection('rooms').insertOne(room, (err, result) => {
        res.redirect(req.baseUrl);
      })
    })
  });

router.route('/edit/:id')
  .all(function (req, res, next) {
    var roomId = req.params.id;

    MongoClient.connect(url, (err, db) => {
      var filter = {_id: new ObjectID(roomId)}
      db.collection('rooms').find(filter).next((err, room) => {
        if (!room) {
          res.sendStatus(404);
          return;
        }
        res.locals.room = room;
        next()
        db.close()
      })
    })
  })
  .get(function (req, res) {
    res.render("rooms/edit");
  })
  .post(function (req, res) {
    var roomId = req.params.id;
    MongoClient.connect(url, (err, db) => {
      var filter = {_id: new ObjectID(roomId)}
      var newRoom = {
        name: req.body.name
      }
      db.collection('rooms').replaceOne(filter, newRoom, (err, result) => {
        res.redirect(req.baseUrl);
      })
    })
  });

router.get('/delete/:id', function (req, res) {
  var roomId = req.params.id;

  MongoClient.connect(url, (err, db) => {
    var filter = {_id: new ObjectID(roomId)}
    db.collection('rooms').deleteOne(filter, (err, result) => {
      res.redirect(req.baseUrl);
    })
  })
});
