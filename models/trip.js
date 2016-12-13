var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  location: String,
  startDate: Date,
  endDate: Date,
  flightOrigin: String,
  flightDestination: String,
  flightDepartureTime: String,
  flightDuration: String,
  lodgingAddress: String,
  bookmarks: []
});
