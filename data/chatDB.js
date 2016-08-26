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


var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var connectMongoose = mongoose.connect(url)

module.exports = {
  connect,
  close,
  ObjectID,
  connectMongoose
}
