var mongodb = require('mongodb')
var {MongoClient, ObjectID} = mongodb

var url = 'mongodb://localhost/chat'
var connect = MongoClient.connect(url)

var close = cb => {
  connect.then(db => {
    db.close()
    cb()
  })
}

module.exports = {
  connect,
  close,
  ObjectID
}
