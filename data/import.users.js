var mongoose = require('mongoose')

var users = require('./users.json')
var User = require('../admin/userModel')

var url = 'mongodb://localhost/chat'

mongoose.connect(url)
  .then(importUsers)


function importUsers() {
  User.insertMany(users)
    .then(() => mongoose.disconnect())
    .catch(err => console.log(err))
}
