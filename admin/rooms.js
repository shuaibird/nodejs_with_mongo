var express = require('express')
var {connect, ObjectID} = require('../data/chatDB')


var router = express.Router()
module.exports = router


router.get('/', (req, res, next) => {
  connect
    .then(db => db.collection('rooms').find().toArray())
    .then(rooms => res.render('rooms/list', {
      title: 'Admin Rooms',
      rooms: rooms
    }))
    .catch(next)
})


router.route('/add')
  .get((req, res) => res.render('rooms/add'))
  .post((req, res, next) => {
    var room = {name: req.body.name}
    connect
      .then(db => db.collection('rooms').insertOne(room))
      .then(() => res.redirect(req.baseUrl))
      .catch(next)
  })


router.route('/edit/:id')
  .all((req, res, next) => {
    var roomId = req.params.id
    var filtered = { _id: new ObjectID(roomId)}

    connect
      .then(db => db.collection('rooms').find(filtered).next())
      .then(room => {
        if (!room) {
          res.sendStatus(404)
          return
        }
        res.locals.room = room
        next()
      })
      .catch(next)
  })
  .get((req, res) => res.render('rooms/edit'))
  .post((req, res, next) => {
    var roomId = req.params.id
    var filtered= {_id: new ObjectID(roomId)}
    var newRoom = {name: req.body.name}

    connect
      .then(db => db.collection('rooms').replaceOne(filtered, newRoom))
      .then(() => res.redirect(req.baseUrl))
      .catch(next)
  })


router.get('/delete/:id', (req, res, next) => {
  var roomId = req.params.id
  var filtered = {_id: new ObjectID(roomId)}

  connect
    .then(db => db.collection('rooms').deleteOne(filtered))
    .then(() => res.redirect(req.baseUrl))
    .catch(next)
})
