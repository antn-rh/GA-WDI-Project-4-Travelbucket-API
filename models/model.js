var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  email: {type: String, required: true},
  googleId: String
});

// add bcrypt hashing to model (works on a password field)
userSchema.plugin(require('mongoose-bcrypt'));

// Add a "transformation" to the model's toJson function that stops the password field (even in digest format) from being returned in any response
userSchema.options.toJSON = {
  transform: function(document, returnedObject, options) {
    delete retruendObject.password;
    return returnedObject;
  }
}

var User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
