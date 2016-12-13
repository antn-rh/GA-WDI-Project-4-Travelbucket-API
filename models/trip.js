var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
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

var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
