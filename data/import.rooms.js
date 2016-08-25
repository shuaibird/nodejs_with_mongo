var MongoClient = require('mongodb').MongoClient

var rooms = require('./rooms.json')

var url = 'mongodb://localhost/chat'

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log(err)
    return
  }

  db.collection('rooms').find().toArray((err, users) => {
    if(err) {
      console.log(err)
      return
    }
    console.log(users)
    db.close()
  })
})
