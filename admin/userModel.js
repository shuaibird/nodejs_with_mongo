var mongoose = require('mongoose')

var schemaOptions = {
  collection: 'users'
}

var schema = new mongoose.Schema({
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
}, schemaOptions)

var User = mongoose.model('User', schema)

module.exports = User
