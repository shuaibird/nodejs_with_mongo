var express = require('express')
var os = require('os')
var {connectMongoose} = require('../data/chatDB')
var User = require('./userModel')

var router = express.Router()
module.exports = router


function userFromRequestBody(user, request) {
  user.alias = request.body.alias
  user.roles = request.body.roles
  user.contact = {
    phone: request.body['contact.phone'],
    email: request.body['contact.email']
  }
  user.address = {
    lines: request.body['address.lines'].split(os.EOL),
    city: request.body['address.city'],
    state: request.body['address.state'],
    zip: request.body['address.zip']
  }
}


router.get('/', (req, res, next) => {
  connectMongoose
    .then(() => User.find().exec())
    .then(users => {
      res.render('users/list', {
        title: 'Admin Users',
        users: users
      })
    })
    .catch(next)
})


router.route('/add')
  .get((req, res, next) => res.render('users/add'))
  .post((req, res, next) => {
    var user = new User()
    userFromRequestBody(user, req)
    user.save()
      .then(() => res.redirect(req.baseUrl))
      .catch(next)
  })


router.route('/edit/:id')
  .all((req, res, next) => {
    var userId = req.params.id
    User.findById(userId).exec()
      .then(user => {
        if (!user) {
          res.sendStatus(404)
          return
        }
        res.locals.user = user
        res.locals.userHasRole = role => (user.roles || []).indexOf(role) > -1
        next()
      })
      .catch(next)
  })
  .get((req, res) => res.render('users/edit'))
  .post((req, res) => {
    userFromRequestBody(res.locals.user, req)
    res.locals.user.save()
      .then(() => res.redirect(req.baseUrl))
      .catch(next)
  })


router.get('/delete/:id', (req, res) => {
  var userId = req.params.id
  User.remove({_id: userId})
    .then(() => res.redirect(req.baseUrl))
    .catch(next)
})
