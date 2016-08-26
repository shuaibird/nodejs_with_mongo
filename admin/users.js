var uuid = require("node-uuid");
var _ = require("lodash");
var express = require("express");
var users = require("./../data/users.json");
var os = require('os');

var router = express.Router()
module.exports = router;

router.get('/', function (req, res) {
  res.render("users/list", {
    title: "Admin Users",
    users: users
  });
});

router.route('/add')
  .get(function (req, res) {
    res.render("users/add");
  })
  .post(function (req, res) {
    var user = {
      id: uuid.v4()
    };

    userFromRequestBody(user, req);

    users.push(user);

    res.redirect(req.baseUrl);
  });

function userFromRequestBody(user, request) {
  user.alias = request.body.alias;
  user.roles = request.body.roles;
  user.contact = {
    phone: request.body["contact.phone"],
    email: request.body["contact.email"]
  };
  user.address = {
    lines: request.body["address.lines"].split(os.EOL),
    city: request.body["address.city"],
    state: request.body["address.state"],
    zip: request.body["address.zip"]
  };
}

router.route('/edit/:id')
  .all(function (req, res, next) {
    var userId = req.params.id;

    var user = _.find(users, r => r.id === userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.locals.user = user;
    res.locals.userHasRole = function (role) {
      return (user.roles || []).indexOf(role) > -1
    };
    next()
  })
  .get(function (req, res) {
    res.render("users/edit");
  })
  .post(function (req, res) {
    userFromRequestBody(res.locals.user, req);

    res.redirect(req.baseUrl);
  });

router.get('/delete/:id', function (req, res) {
  var userId = req.params.id;

  users = users.filter(r => r.id !== userId);

  res.redirect(req.baseUrl);
});
