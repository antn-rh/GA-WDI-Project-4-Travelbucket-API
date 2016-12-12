var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users');
var token = require('./token_auth');

/* GET home page. */
// API Documentation Landing Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Travelbucket' });
});

router.route('/api/users')
  .post(usersController.create)
router.route('/api/token')
  .post(token.create)
router.route('/api/me')
  .get(token.authenticate, usersController.me)

module.exports = router;
