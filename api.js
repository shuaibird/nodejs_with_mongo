var express = require("express");
var rooms = require("./data/rooms.json");
var messages = require("./data/messages.json");
var _ = require("lodash");
var uuid = require("node-uuid");
var users = require("./data/users.json");


var {connect, ObjectID} = require('./data/chatDB')


var router = express.Router()
module.exports = router


router.get("/rooms", (req, res, next) => {
  connect
    .then(db => db.collection('rooms').find().toArray())
    .then(rooms => res.json(rooms))
    .catch(next)
})

router.get("/users", (req, res, next) => {
  connect
    .then(db => db.collection('users').find().toArray())
    .then(users => res.json(users))
    .catch(next)
})

router.route("/rooms/:roomId/messages")
  .get(function (req, res) {
    var roomId = req.params.roomId;

    var roomMessages = messages
      .filter(m => m.roomId === roomId)
      .map(m => {
        var user = _.find(users, u => u.id === m.userId);
        var userName = user ? user.alias : "unknown";
        return {text: `${userName}: ${m.text}`};
      });

    var room = _.find(rooms, r => r.id === roomId);
    if (!room) {
      res.sendStatus(404);
      return;
    }

    res.json({
      room: room,
      messages: roomMessages
    })

  })
  .post(function (req, res) {
    var roomId = req.params.roomId;

    var message = {
      roomId: roomId,
      text: req.body.text,
      userId: "44f885e8-87e9-4911-973c-4074188f408a",
      id: uuid.v4()
    };

    messages.push(message);

    res.sendStatus(200);
  })
  .delete(function (req, res) {
    var roomId = req.params.roomId;

    // note: careful as this will not update the array that was exported from the messages.json module so if you use that array in other modules it won't update.
    messages = messages.filter(m => m.roomId !== roomId);

    res.sendStatus(200);
  });