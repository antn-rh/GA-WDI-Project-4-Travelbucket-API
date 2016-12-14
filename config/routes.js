var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users');
var tripsController = require('../controllers/trips')
var token = require('./token_auth');

/* GET home page. */
// API Documentation Landing Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Travelbucket' });
});

// Authenticating users, includes Google OAuth2
router.route('/api/users')
  .post(usersController.create);
router.route('/api/token')
  .post(token.create);
router.route('/api/me')
  .get(token.authenticate, usersController.me);
router.route('/auth/google')
  .post(usersController.google);

// Trip routes
router.route('/api/trips')
  .get(token.authenticate, tripsController.index)
  .post(token.authenticate, tripsController.create);
router.route('/api/trips/:id')
  .get(token.authenticate, tripsController.show)
  .patch(token.authenticate, tripsController.update)
  .delete(token.authenticate, tripsController.destroy);

module.exports = router;
