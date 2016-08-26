var mongodb = require('mongodb')
var {MongoClient, ObjectID} = mongodb

var url = 'mongodb://localhost/chat'
var connect = MongoClient.connect(url)

module.exports = {
  connect,
  ObjectID
}
