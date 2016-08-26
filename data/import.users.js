var mongoose = require('mongoose')

var users = require('./users.json')
var User = require('../admin/userModel')


var {connectMongoose} = require('./chatDB')

connectMongoose
  .then(importUsers)


function importUsers() {
  User.insertMany(users)
    .then(() => mongoose.disconnect())
    .catch(err => console.log(err))
}
