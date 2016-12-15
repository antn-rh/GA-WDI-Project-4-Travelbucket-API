var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  departureTime: String,
  duration: String
});

var tripSchema = new mongoose.Schema({
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  latitude: Number,
  longitude: Number,
  location: String,
  startDate: Date,
  endDate: Date,
  departingFlight: flightSchema,
  returnFlight: flightSchema,
  lodgingAddress: String,
  bookmarks: []
});

var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
