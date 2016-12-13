var User = require('../models/user');
var request = require('request');
var jwt = require('jsonwebtoken');
var tokenAuth = require('../config/token_auth')

module.exports = {
  create: create,
  me: me,
  google: google
}

function create(req, res, next) {
  if(!req.body.password) {
    return res.status(422).send('Missing required fields');
  }
  User
    .create(req.body)
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully created user.',
        data: {
          email: user.email,
          id: user._id
        }
      });
    }).catch(function(err) {
      if(err.message.match(/E11000/)) {
        err.status = 409;
      } else {
        err.status = 422;
      }
      next(err);
    });
}

function me(req, res, next) {
  User
    .findOne({email: req.decoded.email}).exec()
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully retrieved user data.',
        data: user
      });
    }).catch(function(err) {
      next(err);
    });
}

function google(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        console.log(req.header('Authorization'))
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            console.log(existingUser)
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, process.env.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            // user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            // user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = tokenAuth.generateJwt(user);
              res.json({token: token});
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.json({token: tokenAuth.generateJwt(existingUser)});
          }
          var user = new User();
          user.google = profile.sub;
          user.email = profile.email;
          user.name = profile.name;
          user.save(function(err) {
            console.log(err)
            var token = tokenAuth.generateJwt(user);
            console.log(token)
            console.log(user)
            res.json({token: token});
          });
        });
      }
    });
  });
}
