var mongoose = require('mongoose')

var users = require('./users.json')

var url = 'mongodb://localhost/chat'

mongoose.Promise = global.Promise

mongoose.connect(url)
  .then(importUsers)


function importUsers() {

  var userSchemaOptions = {
    collection: 'users',
    strict: true  // default
  }

  var userSchema = new mongoose.Schema({
    alias: String,
    roles: [String],
    contact: {
      phone: String,
      email: String
    },
    address: {
      lines: [String],
      city: String,
      state: String,
      zip: Number
    },
  }, userSchemaOptions)

  var User = mongoose.model('User', userSchema)

  User.insertMany(users)
    .then(() => mongoose.disconnect())
    .catch(err => console.log(err))
}
